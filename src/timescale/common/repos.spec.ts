import { sanatizeRepos } from "./repos";

describe("sanatizeRepos", () => {
  test("should conform to 'LOWER' strings for db query indexes", () => {
    const input = ["Org/Repo"];
    const output = sanatizeRepos(input);

    expect(output).toEqual(["org/repo"]);
  });

  test("should remove empty strings", () => {
    const input = ["Org/Repo", ""];
    const output = sanatizeRepos(input);

    expect(output).toHaveLength(1);
    expect(output).toEqual(["org/repo"]);
  });

  test("should filter out strings not in the format {org}/{name}", () => {
    const input = ["Org/Repo", "JustName", "org/"];
    const output = sanatizeRepos(input);

    expect(output).toEqual(["org/repo"]);
  });

  test("should handle strings with multiple slashes", () => {
    const input = ["Org/Repo/Extra", "org/repo"];
    const output = sanatizeRepos(input);

    expect(output).toEqual(["org/repo"]);
  });

  test("should work with multiple valid inputs", () => {
    const input = ["Org1/Repo1", "Org2/Repo2"];
    const output = sanatizeRepos(input);

    expect(output).toEqual(["org1/repo1", "org2/repo2"]);
  });

  test("should return an empty array for all invalid inputs", () => {
    const input = ["", "/", "Invalid"];
    const output = sanatizeRepos(input);

    expect(output).toEqual([]);
  });
});
