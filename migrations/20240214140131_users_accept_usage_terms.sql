-------------------------------------------------------------------------------
-- Adds flag to accept terms and conditions column to the user table
--
-- This denotes that the user has accepted the usage terms and conditions
-- of using OpenSauced including privacy policy.
-------------------------------------------------------------------------------

alter table users
  add column accepted_usage_terms boolean not null default false

