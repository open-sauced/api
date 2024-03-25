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
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event.entity";
import { DbPullRequestReviewGitHubEvents } from "./entities/pull_request_review_github_event.entity";
import { WatchGithubEventsService } from "./watch_github_events.service";
import { DbPushGitHubEventsHistogram } from "./entities/push_github_events_histogram.entity";
import { PushGithubEventsService } from "./push_github_events.service";
import { ForkGithubEventsService } from "./fork_github_events.service";
import { DbIssueCommentGitHubEventsHistogram } from "./entities/issue_comment_github_events_histogram.entity";
import { IssueCommentGithubEventsService } from "./issue_comment_github_events.service";
import { IssuesGithubEventsService } from "./issues_github_events.service";
import { DbIssuesGitHubEventsHistogram } from "./entities/issues_github_events_histogram.entity";
import { DbIssuesGitHubEvents } from "./entities/issues_github_event.entity";
import { RepoDevstatsService } from "./repo-devstats.service";
import { DbPushGitHubEvents } from "./entities/push_github_events.entity";
import { ContributorDevstatsService } from "./contrib-stats.service";
import { DbContributorStat } from "./entities/contributor_devstat.entity";
import { DbForkGitHubEvents } from "./entities/fork_github_events.entity";
import { DbForkGitHubEventsHistogram } from "./entities/fork_github_events_histogram.entity";
import { DbWatchGitHubEvents } from "./entities/watch_github_events.entity";
import { DbWatchGitHubEventsHistogram } from "./entities/watch_github_events_histogram.entity";
import { DbReleaseGitHubEventsHistogram } from "./entities/release_github_events_histogram.entity";
import { ReleaseGithubEventsService } from "./release_github_events.service";
import { DbCommitCommentGitHubEventsHistogram } from "./entities/commit_comment_github_events_histogram.entity";
import { CommitCommentGithubEventsService } from "./commit_comment_github_events.service";
import { DbCreateGitHubEventsHistogram } from "./entities/create_github_events_histogram.entity";
import { CreateGithubEventsService } from "./create_github_events.service";
import { DeleteGithubEventsService } from "./delete_github_events.service";
import { DbDeleteGitHubEventsHistogram } from "./entities/delete_github_events_histogram.entity";
import { DbGollumGitHubEventsHistogram } from "./entities/gollum_github_events_histogram.entity";
import { GollumGithubEventsService } from "./gollum_github_events.service";
import { DbMemberGitHubEventsHistogram } from "./entities/member_github_events_histogram.entity";
import { MemberGithubEventsService } from "./member_github_events.service";
import { PullRequestReviewCommentGithubEventsService } from "./pull_request_review_comment_github_events.service";
import { DbPullRequestReviewCommentGitHubEventsHistogram } from "./entities/pull_request_review_comment_github_events_histogram.entity";

@Module({
  imports: [
    forwardRef(() => RepoModule),
    forwardRef(() => UserListModule),
    TypeOrmModule.forFeature(
      [
        DbCommitCommentGitHubEventsHistogram,
        DbContributorStat,
        DbCreateGitHubEventsHistogram,
        DbDeleteGitHubEventsHistogram,
        DbForkGitHubEvents,
        DbForkGitHubEventsHistogram,
        DbGollumGitHubEventsHistogram,
        DbIssueCommentGitHubEventsHistogram,
        DbIssuesGitHubEvents,
        DbIssuesGitHubEventsHistogram,
        DbMemberGitHubEventsHistogram,
        DbPullRequestGitHubEvents,
        DbPullRequestReviewCommentGitHubEventsHistogram,
        DbPullRequestReviewGitHubEvents,
        DbPushGitHubEvents,
        DbPushGitHubEventsHistogram,
        DbReleaseGitHubEventsHistogram,
        DbWatchGitHubEvents,
        DbWatchGitHubEventsHistogram,
      ],
      "TimescaleConnection"
    ),
    TypeOrmModule.forFeature([DbRepo, DbUser, DbUserList, DbUserListContributor, DbUserHighlight], "ApiConnection"),
  ],
  providers: [
    CommitCommentGithubEventsService,
    ContributorDevstatsService,
    CreateGithubEventsService,
    DeleteGithubEventsService,
    ForkGithubEventsService,
    GollumGithubEventsService,
    IssueCommentGithubEventsService,
    IssuesGithubEventsService,
    MemberGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewCommentGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    ReleaseGithubEventsService,
    RepoDevstatsService,
    WatchGithubEventsService,
  ],
  exports: [
    CommitCommentGithubEventsService,
    ContributorDevstatsService,
    CreateGithubEventsService,
    DeleteGithubEventsService,
    ForkGithubEventsService,
    GollumGithubEventsService,
    IssueCommentGithubEventsService,
    IssuesGithubEventsService,
    MemberGithubEventsService,
    PullRequestGithubEventsService,
    PullRequestReviewCommentGithubEventsService,
    PullRequestReviewGithubEventsService,
    PushGithubEventsService,
    ReleaseGithubEventsService,
    RepoDevstatsService,
    WatchGithubEventsService,
  ],
})
export class TimescaleModule {}
