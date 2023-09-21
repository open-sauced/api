import { registerAs } from "@nestjs/config";

export const HacktoberfestConfig = registerAs("hacktoberfest", () => ({
  year: String(process.env.HACKTOBERFEST_YEAR ?? `${new Date().getFullYear()}`),
}));

export default HacktoberfestConfig;
