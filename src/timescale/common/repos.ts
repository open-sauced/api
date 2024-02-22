/*
 * the following is a convenience function that:
 *   - validates via regex that the repos are of the for "{repo-owner}/{repo-name}"
 *   - ensures there are no hanging spaces
 *   - ensures there are no empty repo names.
 *
 *  this is in service of optimizing for "LOWER(repo_name)" queries against timescale
 */

export const sanatizeRepos = (repos: string[]): string[] => {
  const validRepoRegex = /^[^/]+\/[^/]+$/;

  return repos.map((repo) => repo.toLowerCase()).filter((repo) => repo && validRepoRegex.test(repo));
};
