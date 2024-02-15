import { registerAs } from "@nestjs/config";

export const GitHubConfig = registerAs("github", () => ({
  developerPackApi: String(process.env.DEVELOPER_PACK_API ?? ""),
  authToken: String(process.env.GITHUB_AUTH_TOKEN ?? ""),
}));

export default GitHubConfig;
