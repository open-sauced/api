-------------------------------------------------------------------------------
-- Remove the pr reviews table:
--
-- This was a feature set that was partially implemented but never saw the light of day.
-- So this cleans up that table and removes those references from the database.
-------------------------------------------------------------------------------

drop table if exists public.pull_request_reviews;
