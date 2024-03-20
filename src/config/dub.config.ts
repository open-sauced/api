import { registerAs } from "@nestjs/config";

export const DubConfig = registerAs("dub", () => ({
  apiHost: String(process.env.DUB_API_HOST ?? ""),
  apiKey: String(process.env.DUB_API_KEY ?? ""),
  workspaceId: String(process.env.DUB_WORKSPACE_ID ?? ""),
  domain: String(process.env.DUB_WORKSPACE_DOMAIN ?? ""),
}));

export default DubConfig;
