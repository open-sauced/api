import { registerAs } from "@nestjs/config";

export const TierConfig = registerAs("tier", () => ({
  freePlan: String(process.env.TIER_PLAN_FREE ?? "plan:free@1"),
}));

export default TierConfig;
