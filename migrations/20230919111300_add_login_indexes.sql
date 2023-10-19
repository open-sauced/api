
CREATE INDEX if not exists pull_requests_idx_merged_by_login_lower ON pull_requests ((lower(merged_by_login)));

CREATE INDEX if not exists pull_requests_idx_author_login_lower ON pull_requests ((lower(author_login)));
