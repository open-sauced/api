import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";

import { DbInsight } from "./entities/insight.entity";
import { InsightsService } from "./insights.service";

@Controller("insights")
@ApiTags("Insights service")
export class InsightController {
  constructor (
    private readonly insightsService: InsightsService,
  ) {}

  @Get("/:id")
  @ApiOperation({
    operationId: "findInsightPageById",
    summary: "Finds a insight page by :id",
  })
  @ApiOkResponse({ type: DbInsight })
  @ApiNotFoundResponse({ description: "Insight page not found" })
  async findInsightPageById (
    @Param("id") id: number,
  ): Promise<DbInsight> {
    return this.insightsService.findOneById(id);
  }
}
