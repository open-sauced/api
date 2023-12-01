ALTER TABLE IF EXISTS public.user_lists
    ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
