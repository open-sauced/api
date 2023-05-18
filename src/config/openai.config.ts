import { registerAs } from "@nestjs/config";

export const OpenAIConfig = registerAs("openai", () => ({
  APIKey: String(process.env.OPENAI_API_KEY ?? "apikey"),
  modelName: String(process.env.OPENAI_MODEL_NAME ?? "gpt-3.5-turbo"),
  completionsURL: String(process.env.OPENAI_COMPLETIONS_API_URL ?? ""),
}));

export default OpenAIConfig;
