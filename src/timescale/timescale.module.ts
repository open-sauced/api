import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbRepo } from "../repo/entities/repo.entity";
import { DbUserList } from "../user-lists/entities/user-list.entity";
import { DbUserListContributor } from "../user-lists/entities/user-list-contributor.entity";
import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { DbUser } from "../user/user.entity";
import { RepoModule } from "../repo/repo.module";
import { UserListModule } from "../user-lists/user-list.module";
import { PullRequestGithubEventsService } from "./pull_request_github_events.service";
import { PullRequestReviewGithubEventsService } from "./pull_request_review_github_events.service";
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event";
import { DbPullRequestReviewGitHubEvents } from "./entities/pull_request_review_github_event";
import { DbWatchGitHubEventsHistogram } from "./entities/watch_github_events_histogram";
import { WatchGithubEventsService } from "./watch_github_events.service";
import { DbPushGitHubEventsHistogram } from "./entities/push_github_events_histogram";
import { PushGithubEventsService } from "./push_github_events.service";

@Module({
  imports: [
    RepoModule,
    UserListModule,
    TypeOrmModule.forFeature(
      [
        DbPushGitHubEventsHistogram,
        DbPullRequestGitHubEvents,
        DbPullRequestReviewGitHubEvents,
        DbWatchGitHubEventsHistogram,
      ],
      "TimescaleConnection"
    ),
    TypeOrmModule.forFeature([DbRepo, DbUser, DbUserList, DbUserListContributor, DbUserHighlight], "ApiConnection"),
  ],
  providers: [
    PushGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    WatchGithubEventsService,
  ],
  exports: [
    PushGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    WatchGithubEventsService,
  ],
})
export class TimescaleModule {}
