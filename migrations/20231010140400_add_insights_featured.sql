ALTER TABLE IF EXISTS public.insights
    ADD COLUMN is_featured boolean NOT NULL DEFAULT false;