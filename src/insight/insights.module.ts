import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbInsight } from "./entities/insight.entity";
import { DbInsightRepo } from "./entities/insight-repo.entity";
import { InsightsController } from "./insights.controller";
import { InsightsService } from "./insights.service";

@Module({
  controllers: [InsightsController],
  imports: [
    TypeOrmModule.forFeature([
      DbInsight,
      DbInsightRepo,
    ]),
  ],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
