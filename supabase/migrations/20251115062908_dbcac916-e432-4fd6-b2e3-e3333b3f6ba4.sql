-- Add game_name and tag_line columns to linked_accounts table
ALTER TABLE public.linked_accounts 
ADD COLUMN IF NOT EXISTS game_name TEXT,
ADD COLUMN IF NOT EXISTS tag_line TEXT;

-- Update existing records to populate game_name from summoner_name if needed
-- (This is just a migration step, new records will have proper values)
UPDATE public.linked_accounts 
SET game_name = summoner_name, tag_line = 'NA1'
WHERE game_name IS NULL;
