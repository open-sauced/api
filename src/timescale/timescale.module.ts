import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event";
import { PullRequestGithubEventsService } from "./pull_request_github_events.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbPullRequestGitHubEvents], "TimescaleConnection")],
  providers: [PullRequestGithubEventsService],
  exports: [PullRequestGithubEventsService],
})
export class TimescaleModule {}
