import { Controller, Get, Query, Version } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram";
import { StarsHistogramDto } from "./dtos/stars";

@Controller("histogram")
@ApiTags("Histogram generation service")
export class HistogramController {
  constructor(private readonly watchGitHubEventsService: WatchGithubEventsService) {}

  @Version("2")
  @Get("/stars")
  @ApiOperation({
    operationId: "starsHistogram",
    summary: "Generates a histogram based on 1 day time buckets",
  })
  @ApiOkResponse({ type: DbWatchGitHubEventsHistogram, isArray: true })
  async starsHistogram(@Query() options: StarsHistogramDto): Promise<DbWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsHistogram(options);
  }
}
