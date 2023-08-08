import { Module } from "@nestjs/common";
import { IssueSummaryService } from "./issue-summary.service";
import { IssueSummaryController } from "./issue-summary.controller";
import { OpenAiModule } from "../open-ai/open-ai.module";

@Module({
  imports: [OpenAiModule],
  controllers: [IssueSummaryController],
  providers: [IssueSummaryService],
  exports: [IssueSummaryService],
})
export class IssueSummaryModule {}
