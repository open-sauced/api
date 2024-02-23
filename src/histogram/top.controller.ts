import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { WatchGithubEventsService } from "../timescale/watch_github_events.service";
import { DbTopWatchGitHubEventsHistogram } from "../timescale/entities/watch_github_events_histogram";

@Controller("histogram/top")
@ApiTags("Top histogram generation service")
export class TopHistogramController {
  constructor(private readonly watchGitHubEventsService: WatchGithubEventsService) {}

  @Get("/stars")
  @ApiOperation({
    operationId: "starsTopHistogram",
    summary: "Generates a stars histogram based on 1 day time buckets for all data",
  })
  @ApiOkResponse({ type: DbTopWatchGitHubEventsHistogram, isArray: true })
  async starsTopHistogram(): Promise<DbTopWatchGitHubEventsHistogram[]> {
    return this.watchGitHubEventsService.genStarsTopHistogram();
  }
}
