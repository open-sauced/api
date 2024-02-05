import { registerAs } from "@nestjs/config";

export const GitHubConfig = registerAs("github", () => ({
  developerPackApi: String(process.env.DEVELOPER_PACK_API ?? ""),
}));

export default GitHubConfig;
