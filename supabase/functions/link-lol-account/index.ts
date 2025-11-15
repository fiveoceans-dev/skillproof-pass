import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkAccountRequest {
  gameName: string;
  tagLine: string;
  region: string;
  userId: string;
}

// Map platform routing region for Riot Account API
function getRoutingRegion(region: string): string {
  const regionMap: { [key: string]: string } = {
    'na1': 'americas',
    'br1': 'americas',
    'la1': 'americas',
    'la2': 'americas',
    'euw1': 'europe',
    'eun1': 'europe',
    'tr1': 'europe',
    'ru': 'europe',
    'kr': 'asia',
    'jp1': 'asia',
    'oc1': 'sea',
  };
  return regionMap[region] || 'americas';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { gameName, tagLine, region, userId }: LinkAccountRequest = await req.json();

    if (!gameName || !tagLine || !region || !userId) {
      throw new Error('Missing required fields');
    }

    console.log(`Fetching account: ${gameName}#${tagLine} in region: ${region}`);

    // Fetch Riot API key
    const riotApiKey = Deno.env.get('LOL_API');
    if (!riotApiKey) {
      throw new Error('Riot API key not configured');
    }

    // Step 1: Get account data (PUUID) from Riot Account API
    const routingRegion = getRoutingRegion(region);
    const accountResponse = await fetch(
      `https://${routingRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      }
    );

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text();
      console.error('Riot Account API error:', errorText);
      throw new Error(accountResponse.status === 404 ? 'Riot ID not found' : 'Failed to fetch account data');
    }

    const accountData = await accountResponse.json();
    console.log('Account found:', accountData.gameName, '#', accountData.tagLine);

    // Step 2: Get summoner data using PUUID
    const summonerResponse = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      }
    );

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      console.error('Summoner API error:', errorText);
      throw new Error('Failed to fetch summoner data');
    }

    const summonerData = await summonerResponse.json();
    console.log('Summoner found:', summonerData.name);

    // Fetch rank data
    let rankTier = null;
    let rankDivision = null;

    try {
      const rankedResponse = await fetch(
        `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`,
        {
          headers: {
            'X-Riot-Token': riotApiKey,
          },
        }
      );

      if (rankedResponse.ok) {
        const rankedData = await rankedResponse.json();
        const soloQueue = rankedData.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5');
        if (soloQueue) {
          rankTier = soloQueue.tier;
          rankDivision = soloQueue.rank;
          console.log(`Rank: ${rankTier} ${rankDivision}`);
        }
      }
    } catch (error) {
      console.error('Error fetching rank:', error);
      // Continue without rank data
    }

    // Generate verification code (icon number)
    const verificationCode = Math.floor(Math.random() * 29).toString(); // League has icons 0-28

    // Check if account is already linked
    const { data: existingAccount } = await supabaseClient
      .from('linked_accounts')
      .select('*')
      .eq('summoner_id', summonerData.id)
      .single();

    if (existingAccount) {
      // Update existing account
      const { error: updateError } = await supabaseClient
        .from('linked_accounts')
        .update({
          user_id: userId,
          summoner_name: summonerData.name,
          game_name: accountData.gameName,
          tag_line: accountData.tagLine,
          puuid: accountData.puuid,
          region,
          rank_tier: rankTier,
          rank_division: rankDivision,
          verification_code: verificationCode,
          verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAccount.id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          success: true,
          verificationCode,
          accountId: existingAccount.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert new linked account
    const { data: newAccount, error: insertError } = await supabaseClient
      .from('linked_accounts')
      .insert({
        user_id: userId,
        summoner_name: summonerData.name,
        game_name: accountData.gameName,
        tag_line: accountData.tagLine,
        summoner_id: summonerData.id,
        puuid: accountData.puuid,
        region,
        rank_tier: rankTier,
        rank_division: rankDivision,
        verification_code: verificationCode,
        verified: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('Account linked successfully');

    return new Response(
      JSON.stringify({
        success: true,
        verificationCode,
        accountId: newAccount.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in link-lol-account:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
