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
import { WatchGithubEventsService } from "./watch_github_events.service";
import { DbPushGitHubEventsHistogram } from "./entities/push_github_events_histogram";
import { PushGithubEventsService } from "./push_github_events.service";
import { ForkGithubEventsService } from "./fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "./entities/issue_comment_github_events_histogram";
import { IssueCommentGithubEventsService } from "./issue_comment_github_events.service";
import { IssuesGithubEventsService } from "./issues_github_events.service";
import { DbIssuesGitHubEventsHistogram } from "./entities/issues_github_events_histogram";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event";
import { RepoDevstatsService } from "./repo-devstats.service";
import { DbPushGitHubEvents } from "./entities/push_github_events";
import { DbPullRequestReviewCommentGitHubEventsHistogram } from "./entities/pull_request_review_comment_events_histogram.entity";
import { ContributorDevstatsService } from "./contrib-stats.service";
import { DbContributorStat } from "./entities/contributor_devstat.entity";
import { DbForkGitHubEvents } from "./entities/fork_github_events";
import { DbForkGitHubEventsHistogram } from "./entities/fork_github_events_histogram";
import { DbWatchGitHubEvents } from "./entities/watch_github_events";
import { DbWatchGitHubEventsHistogram } from "./entities/watch_github_events_histogram";

@Module({
  imports: [
    forwardRef(() => RepoModule),
    forwardRef(() => UserListModule),
    TypeOrmModule.forFeature(
      [
        DbContributorStat,
        DbForkGitHubEvents,
        DbForkGitHubEventsHistogram,
        DbIssueCommentGitHubEventsHistogram,
        DbIssuesGitHubEvents,
        DbIssuesGitHubEventsHistogram,
        DbPullRequestGitHubEvents,
        DbPullRequestReviewCommentGitHubEventsHistogram,
        DbPullRequestReviewGitHubEvents,
        DbPushGitHubEvents,
        DbPushGitHubEventsHistogram,
        DbWatchGitHubEvents,
        DbWatchGitHubEventsHistogram,
      ],
      "TimescaleConnection"
    ),
    TypeOrmModule.forFeature([DbRepo, DbUser, DbUserList, DbUserListContributor, DbUserHighlight], "ApiConnection"),
  ],
  providers: [
    ForkGithubEventsService,
    IssueCommentGithubEventsService,
    IssuesGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    RepoDevstatsService,
    WatchGithubEventsService,
    ContributorDevstatsService,
  ],
  exports: [
    ForkGithubEventsService,
    IssueCommentGithubEventsService,
    IssuesGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    RepoDevstatsService,
    WatchGithubEventsService,
    ContributorDevstatsService,
  ],
})
export class TimescaleModule {}
