/*
 * the following is a convenience function that:
 *   - validates via regex that the repos are of the for "{repo-owner}/{repo-name}"
 *   - ensures there are no hanging spaces
 *   - ensures there are no empty repo names.
 *
 *  this is in service of optimizing for "LOWER(repo_name)" queries against timescale
 */

const validRepoRegex = /^[^/]+\/[^/]+$/;

export function sanitizeRepos(input: string[]): string[];
export function sanitizeRepos(input: string): string;

export function sanitizeRepos(input: string | string[]): string | string[] {
  if (Array.isArray(input)) {
    return input.map((repo) => repo.toLowerCase()).filter((repo) => repo && validRepoRegex.test(repo));
  }

  const lowerCaseInput = input.toLowerCase();

  return validRepoRegex.test(lowerCaseInput) ? lowerCaseInput : "";
}
