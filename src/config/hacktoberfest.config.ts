import { registerAs } from "@nestjs/config";

export const HacktoberfestConfig = registerAs("hacktoberfest", () => ({
  year: String(process.env.HACKTOBERFEST_YEAR ?? "2023"),
}));

export default HacktoberfestConfig;
