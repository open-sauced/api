import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiBody, ApiTags } from "@nestjs/swagger";

import { SupabaseGuard } from "../auth/supabase.guard";
import { CreateBlogSummaryDto } from "./dtos/create-blog-summary.dto";
import { BlogSummaryService } from "./issue-summary.service";

@Controller("blogs")
@ApiTags("Blog summary service")
export class BlogSummaryController {
  constructor(private readonly blogSummaryService: BlogSummaryService) {}

  @Post("/summary/generate")
  @ApiOperation({
    operationId: "generateBlogSummary",
    summary: "Generate a summary for a markdown supported blog",
  })
  @ApiBearerAuth()
  @UseGuards(SupabaseGuard)
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiBody({ type: CreateBlogSummaryDto })
  async genereateBlogSummary(@Body() genereateBlogSummaryDto: CreateBlogSummaryDto) {
    const summary = await this.blogSummaryService.generateBlogSummary(genereateBlogSummaryDto);

    if (!summary) {
      throw new BadRequestException();
    }

    return { summary };
  }
}
