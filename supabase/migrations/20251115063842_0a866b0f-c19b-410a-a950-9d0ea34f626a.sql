-- Make summoner_name nullable since we now primarily use game_name and tag_line
ALTER TABLE public.linked_accounts 
ALTER COLUMN summoner_name DROP NOT NULL;

-- Set default values for existing null summoner_names
UPDATE public.linked_accounts 
SET summoner_name = game_name 
WHERE summoner_name IS NULL AND game_name IS NOT NULL;