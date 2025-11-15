import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const demoEmail = 'demo@monad.passport';
    const demoPassword = 'demo123456';
    const demoUsername = 'DemoUser';

    console.log('Checking if demo user exists...');

    // Check if demo user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const demoExists = existingUser?.users.some(user => user.email === demoEmail);

    if (demoExists) {
      console.log('Demo user already exists');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Demo user already exists',
          existed: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating demo user...');

    // Create the demo user with admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: demoUsername,
      },
    });

    if (createError) {
      console.error('Error creating demo user:', createError);
      throw createError;
    }

    console.log('Demo user created successfully:', newUser.user.id);

    // Create profile for demo user
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        username: demoUsername,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't throw - user is created, profile creation is secondary
    }

    // Add sample linked account for demo
    const { error: accountError } = await supabaseAdmin
      .from('linked_accounts')
      .insert({
        user_id: newUser.user.id,
        summoner_name: 'DemoSummoner',
        game_name: 'DemoSummoner',
        tag_line: 'NA1',
        summoner_id: 'demo_summoner_id_' + Date.now(),
        puuid: 'demo_puuid_' + Date.now(),
        region: 'na1',
        rank_tier: 'DIAMOND',
        rank_division: 'II',
        verified: true,
      });

    if (accountError) {
      console.error('Error creating linked account:', accountError);
      // Don't throw - this is optional demo data
    }

    // Add sample badges for demo
    const { error: badgeError } = await supabaseAdmin
      .from('badges')
      .insert([
        {
          user_id: newUser.user.id,
          name: 'Diamond Rank',
          description: 'Achieved Diamond rank in Season 2024',
          badge_type: 'rank_diamond',
          rarity: 'rare',
          minted: true,
        },
        {
          user_id: newUser.user.id,
          name: 'High Win Rate',
          description: 'Maintained 60%+ win rate over 100 games',
          badge_type: 'high_winrate',
          rarity: 'epic',
          minted: false,
        },
      ]);

    if (badgeError) {
      console.error('Error creating badges:', badgeError);
      // Don't throw - this is optional demo data
    }

    console.log('Demo user initialization complete');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo user created successfully with sample data',
        userId: newUser.user.id,
        existed: false,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in init-demo-user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
