import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbInsight } from "./entities/insight.entity";
import { DbInsightRepo } from "./entities/insight-repo.entity";
import { InsightController } from "./insight.controller";
import { UserInsightsController } from "./user-insight.controller";
import { InsightsService } from "./insights.service";
import { InsightRepoService } from "./insight-repo.service";

@Module({
  controllers: [InsightController, UserInsightsController],
  imports: [
    TypeOrmModule.forFeature([
      DbInsight,
      DbInsightRepo,
    ], "ApiConnection"),
  ],
  providers: [InsightsService, InsightRepoService],
  exports: [InsightsService, InsightRepoService],
})
export class InsightsModule {}
