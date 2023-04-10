import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbInsight } from "./entities/insight.entity";
import { DbInsightRepo } from "./entities/insight-repo.entity";
import { DbInsightMember } from "./entities/insight-member.entity";
import { InsightController } from "./insight.controller";
import { UserInsightsController } from "./user-insight.controller";
import { InsightsService } from "./insights.service";
import { InsightRepoService } from "./insight-repo.service";
import { UserInsightMemberController } from "./user-insight-member.controller";
import { InsightMemberService } from "./insight-member.service";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [InsightController, UserInsightsController, UserInsightMemberController],
  imports: [
    TypeOrmModule.forFeature([
      DbInsight,
      DbInsightRepo,
      DbInsightMember,
    ], "ApiConnection"),
    UserModule
  ],
  providers: [InsightsService, InsightRepoService, InsightMemberService],
  exports: [InsightsService, InsightRepoService],
})
export class InsightsModule {}
