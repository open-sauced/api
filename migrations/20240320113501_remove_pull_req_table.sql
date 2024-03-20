-------------------------------------------------------------------------------
-- Removes the pull_requests table
--
-- This table is no longer needed in the first party database
-- since we get this info from Timescale events data now.
-------------------------------------------------------------------------------

drop table if exists public.pull_requests;
