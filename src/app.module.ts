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
} from "./config";
import { RepoModule } from "./repo/repo.module";
import { HealthModule } from "./health/health.module";
import { DbRepo } from "./repo/entities/repo.entity";
import { DbUser } from "./user/user.entity";
import { DbContribution } from "./contribution/contribution.entity";
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
import { ContributionModule } from "./contribution/contribution.module";
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
import { DbPullRequest } from "./pull-requests/entities/pull-request.entity";
import { DbUserHighlight } from "./user/entities/user-highlight.entity";
import { HighlightModule } from "./highlight/highlight.module";
import { DbUserToUserFollows } from "./user/entities/user-follows.entity";
import { DbInsightMember } from "./insight/entities/insight-member.entity";
import { DbEmoji } from "./emoji/entities/emoji.entity";
import { DbUserHighlightReaction } from "./user/entities/user-highlight-reaction.entity";
import { DbPRInsight } from "./pull-requests/entities/pull-request-insight.entity";
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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ApiConfig, DbApiConfig, DbLoggingConfig, EndpointConfig, StripeConfig, OpenAIConfig, PizzaConfig],
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
            DbContribution,
            DbRepoToUserVotes,
            DbRepoToUserStars,
            DbRepoToUserSubmissions,
            DbRepoToUserStargazers,
            DbInsight,
            DbInsightMember,
            DbInsightRepo,
            DbCustomer,
            DbSubscription,
            DbPullRequest,
            DbPRInsight,
            DbUserToUserFollows,
            DbEmoji,
            DbUserTopRepo,
            DbEndorsement,
            DbBakedRepo,
            DbCommitAuthors,
            DbCommits,
            DbUserOrganization,
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
    ContributionModule,
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
  ],
  providers: [],
})
export class AppModule {
  constructor(
    @InjectDataSource("ApiConnection")
    private readonly apiConnection: DataSource,

    @InjectDataSource("LogConnection")
    private readonly logConnection: DataSource
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes(`v1`);
  }
}
