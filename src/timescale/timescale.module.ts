import { Module, forwardRef } from "@nestjs/common";
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
import { DbForkGitHubEventsHistogram } from "./entities/fork_github_events_histogram";
import { ForkGithubEventsService } from "./fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "./entities/issue_comment_github_events_histogram";
import { IssueCommentGithubEventsService } from "./issue_comment_github_events.service";
import { IssueGithubEventsService } from "./issue_github_events.service";
import { DbIssueGitHubEventsHistogram } from "./entities/issue_github_events_histogram";

@Module({
  imports: [
    forwardRef(() => RepoModule),
    UserListModule,
    TypeOrmModule.forFeature(
      [
        DbForkGitHubEventsHistogram,
        DbIssueCommentGitHubEventsHistogram,
        DbIssueGitHubEventsHistogram,
        DbPullRequestGitHubEvents,
        DbPullRequestReviewGitHubEvents,
        DbPushGitHubEventsHistogram,
        DbWatchGitHubEventsHistogram,
      ],
      "TimescaleConnection"
    ),
    TypeOrmModule.forFeature([DbRepo, DbUser, DbUserList, DbUserListContributor, DbUserHighlight], "ApiConnection"),
  ],
  providers: [
    ForkGithubEventsService,
    IssueCommentGithubEventsService,
    IssueGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    WatchGithubEventsService,
  ],
  exports: [
    ForkGithubEventsService,
    IssueCommentGithubEventsService,
    IssueGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    WatchGithubEventsService,
  ],
})
export class TimescaleModule {}
