import { Module } from "@nestjs/common";
import { OpenAiModule } from "../open-ai/open-ai.module";
import { BlogSummaryService } from "./issue-summary.service";
import { BlogSummaryController } from "./issue-summary.controller";

@Module({
  imports: [OpenAiModule],
  controllers: [BlogSummaryController],
  providers: [BlogSummaryService],
  exports: [BlogSummaryService],
})
export class BlogSummaryModule {}
