import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { InjectDataSource, TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";
import { LoggerModule } from "nestjs-pino";
import { DataSource } from "typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { clc } from "@nestjs/common/utils/cli-colors.util";

import {
  ApiConfig,
  DbApiConfig,
  DbLoggingConfig,
  EndpointConfig,
  StripeConfig,
  OpenAIConfig,
  PizzaConfig,
  DbTimescaleConfig,
  GitHubConfig,
  DubConfig,
} from "./config";
import { RepoModule } from "./repo/repo.module";
import { HealthModule } from "./health/health.module";
import { DbRepo } from "./repo/entities/repo.entity";
import { DbUser } from "./user/user.entity";
import { DbRepoToUserVotes } from "./repo/entities/repo.to.user.votes.entity";
import { DbRepoToUserStars } from "./repo/entities/repo.to.user.stars.entity";
import { DbRepoToUserSubmissions } from "./repo/entities/repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "./repo/entities/repo.to.user.stargazers.entity";
import { DbBakedRepo } from "./pizza/entities/baked-repo.entity";
import { DbCommitAuthors } from "./pizza/entities/commit_authors.entity";
import { DbCommits } from "./pizza/entities/commits.entity";
import { AuthModule } from "./auth/auth.module";
import { VoteModule } from "./vote/vote.module";
import { StarModule } from "./star/star.module";
import { StargazeModule } from "./stargaze/stargaze.module";
import { SubmitModule } from "./submit/submit.module";
import { UserModule } from "./user/user.module";
import { HttpLoggerMiddleware } from "./common/middleware/http-logger.middleware";
import { DatabaseLoggerMiddleware } from "./common/middleware/database-logger.middleware";
import { InsightsModule } from "./insight/insights.module";
import { DbInsight } from "./insight/entities/insight.entity";
import { DbInsightRepo } from "./insight/entities/insight-repo.entity";
import { UserReposModule } from "./user-repo/user-repos.module";
import { DbUserRepo } from "./user-repo/user-repo.entity";
import { DbCustomer } from "./customer/customer.entity";
import { CustomerModule } from "./customer/customer.module";
import { StripeWebHookModule } from "./stripe-webhook/webhook.module";
import { EmojiModule } from "./emoji/emoji.module";
import { StripeSubscriptionModule } from "./subscription/stripe-subscription.module";
import { DbSubscription } from "./subscription/stripe-subscription.dto";
import { DbLog } from "./log/log.entity";
import { PullRequestModule } from "./pull-requests/pull-request.module";
import { DbUserHighlight } from "./user/entities/user-highlight.entity";
import { HighlightModule } from "./highlight/highlight.module";
import { DbUserToUserFollows } from "./user/entities/user-follows.entity";
import { DbInsightMember } from "./insight/entities/insight-member.entity";
import { DbEmoji } from "./emoji/entities/emoji.entity";
import { DbUserHighlightReaction } from "./user/entities/user-highlight-reaction.entity";
import { DbUserTopRepo } from "./user/entities/user-top-repo.entity";
import { DbUserNotification } from "./user/entities/user-notification.entity";
import { DbUserCollaboration } from "./user/entities/user-collaboration.entity";
import { DbUserOrganization } from "./user/entities/user-organization.entity";
import { EndorsementModule } from "./endorsement/endorsement.module";
import { DbEndorsement } from "./endorsement/entities/endorsement.entity";
import { ContributorModule } from "./contributor/contributor.module";
import { OpenAiModule } from "./open-ai/open-ai.module";
import { IssueSummaryModule } from "./issues/issue-summary.module";
import { BlogSummaryModule } from "./blogs/issue-summary.module";
import { PizzaOvenModule } from "./pizza/pizza-oven.module";
import { UserListModule } from "./user-lists/user-list.module";
import { CouponModule } from "./coupon/coupon.module";
import { DbUserList } from "./user-lists/entities/user-list.entity";
import { DbUserListContributor } from "./user-lists/entities/user-list-contributor.entity";
import { DbCoupon } from "./coupon/entities/coupon.entity";
import { LogModule } from "./log/log.module";
import { TimescaleModule } from "./timescale/timescale.module";
import { DbPullRequestGitHubEvents } from "./timescale/entities/pull_request_github_event.entity";
import { DbPullRequestReviewGitHubEvents } from "./timescale/entities/pull_request_review_github_event.entity";
import { DbWorkspace } from "./workspace/entities/workspace.entity";
import { DbWorkspaceMember } from "./workspace/entities/workspace-member.entity";
import { DbWorkspaceOrg } from "./workspace/entities/workspace-org.entity";
import { DbWorkspaceRepo } from "./workspace/entities/workspace-repos.entity";
import { DbWorkspaceInsight } from "./workspace/entities/workspace-insights.entity";
import { WorkspaceModule } from "./workspace/workspace.module";
import { HistogramModule } from "./histogram/histogram.module";
import { DbWorkspaceContributor } from "./workspace/entities/workspace-contributors.entity";
import { DbIssuesGitHubEvents } from "./timescale/entities/issues_github_event.entity";
import { DbPushGitHubEvents } from "./timescale/entities/push_github_events.entity";
import { DbWorkspaceUserLists } from "./workspace/entities/workspace-user-list.entity";
import { UrlModule } from "./url/url.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        ApiConfig,
        DbApiConfig,
        DbLoggingConfig,
        EndpointConfig,
        StripeConfig,
        OpenAIConfig,
        PizzaConfig,
        DbTimescaleConfig,
        GitHubConfig,
        DubConfig,
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: "ApiConnection",
      useFactory: (configService: ConfigService) =>
        ({
          parseInt8: true,
          type: configService.get("db-api.connection"),
          host: configService.get("db-api.host"),
          port: configService.get("db-api.port"),
          username: configService.get("db-api.username"),
          password: configService.get("db-api.password"),
          database: configService.get("db-api.database"),
          autoLoadEntities: false,
          entities: [
            DbUser,
            DbUserRepo,
            DbUserHighlight,
            DbUserHighlightReaction,
            DbUserNotification,
            DbUserCollaboration,
            DbRepo,
            DbRepoToUserVotes,
            DbRepoToUserStars,
            DbRepoToUserSubmissions,
            DbRepoToUserStargazers,
            DbInsight,
            DbInsightMember,
            DbInsightRepo,
            DbCustomer,
            DbSubscription,
            DbUserToUserFollows,
            DbEmoji,
            DbUserTopRepo,
            DbEndorsement,
            DbBakedRepo,
            DbCommitAuthors,
            DbCommits,
            DbUserOrganization,
            DbUserList,
            DbUserListContributor,
            DbCoupon,
            DbWorkspace,
            DbWorkspaceMember,
            DbWorkspaceOrg,
            DbWorkspaceRepo,
            DbWorkspaceInsight,
            DbWorkspaceUserLists,
            DbWorkspaceContributor,
          ],
          synchronize: false,
          logger: new DatabaseLoggerMiddleware("OS"),
          ssl: {
            ca: configService.get("db-api.certificate"),
            rejectUnauthorized: false,
          },
          maxQueryExecutionTime: configService.get("db-api.maxQueryExecutionTime"),
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: "TimescaleConnection",
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get("db-timescale.connection"),
          host: configService.get("db-timescale.host"),
          port: configService.get("db-timescale.port"),
          username: configService.get("db-timescale.username"),
          password: configService.get("db-timescale.password"),
          database: configService.get("db-timescale.database"),
          autoLoadEntities: false,
          entities: [
            DbPushGitHubEvents,
            DbPullRequestGitHubEvents,
            DbIssuesGitHubEvents,
            DbPullRequestReviewGitHubEvents,
          ],
          synchronize: false,
          logger: new DatabaseLoggerMiddleware("OS"),
          ssl: {
            ca: configService.get("db-timescale.certificate"),
            rejectUnauthorized: false,
          },
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: "LogConnection",
      useFactory: (configService: ConfigService) =>
        ({
          parseInt8: true,
          type: configService.get("db-logging.connection"),
          host: configService.get("db-logging.host"),
          port: configService.get("db-logging.port"),
          username: configService.get("db-logging.username"),
          password: configService.get("db-logging.password"),
          database: configService.get("db-logging.database"),
          autoLoadEntities: false,
          entities: [DbLog],
          synchronize: false,
          logger: new DatabaseLoggerMiddleware("LG"),
          ssl: {
            ca: configService.get("db-logging.certificate"),
            rejectUnauthorized: false,
          },
          maxQueryExecutionTime: configService.get("db-logging.maxQueryExecutionTime"),
        } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          name: `os.${String(config.get("api.codename")).toLowerCase()}`,
          level: config.get("api.logging"),
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: "UTC:hh:MM:ss.l",
              singleLine: true,
              messageFormat: `${clc.yellow(`[{context}]`)} ${clc.green(`{msg}`)}`,
              ignore: "pid,hostname,context",
            },
          },
          customProps: () => ({ context: "HTTP" }),
        },
        exclude: [{ method: RequestMethod.ALL, path: "check" }],
      }),
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
    HealthModule,
    RepoModule,
    VoteModule,
    StarModule,
    StargazeModule,
    SubmitModule,
    UserModule,
    InsightsModule,
    IssueSummaryModule,
    BlogSummaryModule,
    UserReposModule,
    CustomerModule,
    StripeWebHookModule,
    StripeSubscriptionModule,
    PullRequestModule,
    HighlightModule,
    EmojiModule,
    EndorsementModule,
    ContributorModule,
    OpenAiModule,
    PizzaOvenModule,
    UserListModule,
    CouponModule,
    LogModule,
    TimescaleModule,
    WorkspaceModule,
    HistogramModule,
    UrlModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(
    @InjectDataSource("ApiConnection")
    private readonly apiConnection: DataSource,

    @InjectDataSource("TimescaleConnection")
    private readonly timescaleConnection: DataSource,

    @InjectDataSource("LogConnection")
    private readonly logConnection: DataSource
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes(`v1`);
    consumer.apply(HttpLoggerMiddleware).forRoutes(`v2`);
  }
}
