import { Module } from "@nestjs/common";
import { OpenAiModule } from "../open-ai/open-ai.module";
import { IssueSummaryService } from "./issue-summary.service";
import { IssueSummaryController } from "./issue-summary.controller";

@Module({
  imports: [OpenAiModule],
  controllers: [IssueSummaryController],
  providers: [IssueSummaryService],
  exports: [IssueSummaryService],
})
export class IssueSummaryModule {}
