ALTER TABLE public.user_highlights
    ADD COLUMN tagged_repos text[] DEFAULT '{}'::text[] NOT NULL;