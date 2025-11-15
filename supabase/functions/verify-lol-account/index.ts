import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyAccountRequest {
  accountId: string;
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

    const { accountId, userId }: VerifyAccountRequest = await req.json();

    if (!accountId || !userId) {
      throw new Error('Missing required fields');
    }

    // Fetch the linked account
    const { data: linkedAccount, error: fetchError } = await supabaseClient
      .from('linked_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !linkedAccount) {
      throw new Error('Linked account not found');
    }

    if (linkedAccount.verified) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Account already verified',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying account: ${linkedAccount.summoner_name}`);

    // Fetch current summoner data from Riot API
    const riotApiKey = Deno.env.get('LOL_API');
    if (!riotApiKey) {
      throw new Error('Riot API key not configured');
    }

    const summonerResponse = await fetch(
      `https://${linkedAccount.region}.api.riotgames.com/lol/summoner/v4/summoners/${linkedAccount.summoner_id}`,
      {
        headers: {
          'X-Riot-Token': riotApiKey,
        },
      }
    );

    if (!summonerResponse.ok) {
      throw new Error('Failed to fetch summoner data');
    }

    const summonerData = await summonerResponse.json();
    console.log('Current profile icon:', summonerData.profileIconId);

    // Check if the profile icon matches the verification code
    const expectedIcon = parseInt(linkedAccount.verification_code);
    const currentIcon = summonerData.profileIconId;

    if (currentIcon === expectedIcon) {
      // Verification successful
      const { error: updateError } = await supabaseClient
        .from('linked_accounts')
        .update({
          verified: true,
          verification_code: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', accountId);

      if (updateError) throw updateError;

      console.log('Account verified successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Account verified successfully',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`Verification failed: expected icon ${expectedIcon}, got ${currentIcon}`);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: `Profile icon does not match. Expected icon #${expectedIcon}, but found #${currentIcon}. Please update your profile icon in the League client.`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in verify-lol-account:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
