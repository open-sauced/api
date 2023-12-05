ALTER TABLE IF EXISTS public.users
    ADD COLUMN campaign_start_date timestamp without time zone default null;
