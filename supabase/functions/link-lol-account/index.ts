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

    console.log('Request received:', { gameName, tagLine, region, userId: userId ? 'provided' : 'missing' });

    if (!gameName || !tagLine || !region || !userId) {
      console.error('Missing required fields:', { gameName: !!gameName, tagLine: !!tagLine, region: !!region, userId: !!userId });
      throw new Error('Missing required fields');
    }

    console.log(`Fetching account: ${gameName}#${tagLine} in region: ${region}`);

    // Fetch Riot API key
    const riotApiKey = Deno.env.get('LOL_API');
    if (!riotApiKey) {
      console.error('LOL_API environment variable not found');
      throw new Error('Riot API key not configured');
    }
    console.log('API key found:', riotApiKey.substring(0, 10) + '...');

    // Step 1: Get account data (PUUID) from Riot Account API
    const routingRegion = getRoutingRegion(region);
    console.log('Using routing region:', routingRegion);
    
    const accountUrl = `https://${routingRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    console.log('Fetching from URL:', accountUrl);
    
    const accountResponse = await fetch(accountUrl, {
      headers: {
        'X-Riot-Token': riotApiKey,
      },
    });

    console.log('Account API response status:', accountResponse.status);

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text();
      console.error('Riot Account API error:', errorText);
      throw new Error(accountResponse.status === 404 ? 'Riot ID not found' : 'Failed to fetch account data');
    }

    const accountData = await accountResponse.json();
    console.log('Account found:', accountData.gameName, '#', accountData.tagLine, 'PUUID:', accountData.puuid);

    // Step 2: Get summoner data using PUUID
    const summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`;
    console.log('Fetching summoner from URL:', summonerUrl);
    
    const summonerResponse = await fetch(summonerUrl, {
      headers: {
        'X-Riot-Token': riotApiKey,
      },
    });

    console.log('Summoner API response status:', summonerResponse.status);

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      console.error('Summoner API error:', errorText);
      throw new Error('Failed to fetch summoner data');
    }

    const summonerData = await summonerResponse.json();
    console.log('Summoner data received:', JSON.stringify(summonerData));
    
    // Use name from summoner data, or fall back to gameName
    const summonerName = summonerData.name || accountData.gameName;
    console.log('Summoner name:', summonerName);

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
          summoner_name: summonerName,
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
        summoner_name: summonerName,
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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      error: error,
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
