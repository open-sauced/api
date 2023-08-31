ALTER TABLE IF EXISTS public.baked_repos
    ADD CONSTRAINT unique_clone_urls UNIQUE (clone_url);

ALTER TABLE IF EXISTS public.commit_authors
    ADD CONSTRAINT unique_commit_author_emails UNIQUE (commit_author_email);
