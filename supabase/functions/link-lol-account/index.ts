import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LinkAccountRequest {
  summonerName: string;
  region: string;
  userId: string;
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

    const { summonerName, region, userId }: LinkAccountRequest = await req.json();

    if (!summonerName || !region || !userId) {
      throw new Error('Missing required fields');
    }

    console.log(`Fetching summoner: ${summonerName} in region: ${region}`);

    // Fetch summoner data from Riot API
    const riotApiKey = Deno.env.get('LOL_API');
    if (!riotApiKey) {
      throw new Error('Riot API key not configured');
    }

    const summonerResponse = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      }
    );

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      console.error('Riot API error:', errorText);
      throw new Error(summonerResponse.status === 404 ? 'Summoner not found' : 'Failed to fetch summoner data');
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
        summoner_id: summonerData.id,
        puuid: summonerData.puuid,
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
