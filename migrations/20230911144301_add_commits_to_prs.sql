ALTER TABLE IF EXISTS public.pull_requests
    ADD COLUMN commits bigint NOT NULL DEFAULT 0;
