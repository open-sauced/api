ALTER TABLE IF EXISTS public.user_list_contributors
    ADD COLUMN username character varying(36) DEFAULT '';
