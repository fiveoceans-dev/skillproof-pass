# Demo Account Setup

## Demo Credentials

**Email:** demo@monad.passport  
**Password:** demo123456

## How to Create the Demo Account

### Option 1: Sign Up Through the UI (Recommended)

1. Go to `/auth` page
2. Switch to "Sign Up" tab
3. Enter demo credentials:
   - Email: `demo@monad.passport`
   - Password: `demo123456`
   - Username: `DemoUser` (or any username)
4. Click "Sign Up"

The demo account will be automatically created with auto-confirm enabled.

### Option 2: Use the Demo Button

On the login page, there's now a "Try Demo Account" button that:
1. Auto-fills the demo credentials
2. Switches to login mode
3. Shows a toast notification

Users can then click "Login" to sign in with the demo account.

## Features to Test with Demo Account

Once logged in with the demo account, users can:

1. **Link League Accounts**
   - Test the League account linking workflow
   - Verify summoner names
   - See rank information

2. **Connect Wallet**
   - Test WalletConnect integration
   - View wallet address in dashboard

3. **View Badges**
   - See earned badges (if any are minted)
   - Test badge display functionality

## Pre-populating Demo Data (Optional)

To make the demo more impressive, you can pre-populate data:

```sql
-- Add a demo linked account
INSERT INTO linked_accounts (
  user_id,
  summoner_name,
  summoner_id,
  puuid,
  region,
  rank_tier,
  rank_division,
  verified
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@monad.passport'),
  'DemoSummoner',
  'demo_summoner_id',
  'demo_puuid',
  'na1',
  'DIAMOND',
  'II',
  true
);

-- Add demo badges
INSERT INTO badges (
  user_id,
  name,
  description,
  badge_type,
  rarity,
  minted
) VALUES 
  (
    (SELECT id FROM auth.users WHERE email = 'demo@monad.passport'),
    'Diamond Rank',
    'Achieved Diamond rank in Season 2024',
    'rank_diamond',
    'rare',
    true
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'demo@monad.passport'),
    'High Win Rate',
    'Maintained 60%+ win rate over 100 games',
    'high_winrate',
    'epic',
    false
  );
```

## Security Note

The demo account password is public and should only be used for testing purposes. In production:

1. Change the demo password to something more secure
2. Add rate limiting to prevent abuse
3. Regularly reset demo account data
4. Consider making demo data read-only

## First Time Setup

If the demo account doesn't exist yet:

1. Navigate to the auth page
2. Click "Try Demo Account"
3. If you see "Invalid login credentials", click "Don't have an account? Sign up"
4. The credentials will still be filled - just add a username
5. Click "Sign Up" to create the demo account
6. Future users can then use "Try Demo Account" to login directly
