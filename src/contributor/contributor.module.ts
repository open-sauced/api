import { Module } from "@nestjs/common";

import { TimescaleModule } from "../timescale/timescale.module";
import { ContributorController } from "./contributor.controller";
import { ContributorInsightsController } from "./contributor-insights.controller";

@Module({
  imports: [TimescaleModule],
  controllers: [ContributorController, ContributorInsightsController],
})
export class ContributorModule {}
