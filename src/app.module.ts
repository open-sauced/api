import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { InjectDataSource, TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";
import { LoggerModule } from "nestjs-pino";
import { DataSource } from "typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { clc } from "@nestjs/common/utils/cli-colors.util";

import { RepoModule } from "./repo/repo.module";
import apiConfig from "./config/api.config";
import DbApiConfig from "./config/db-api.config";
import DbLoggingConfig from "./config/db-logging.config";
import endpointConfig from "./config/endpoint.config";
import stripeConfig from "./config/stripe.config";
import { HealthModule } from "./health/health.module";
import { DbRepo } from "./repo/entities/repo.entity";
import { DbUser } from "./user/user.entity";
import { DbContribution } from "./contribution/contribution.entity";
import { DbRepoToUserVotes } from "./repo/entities/repo.to.user.votes.entity";
import { DbRepoToUserStars } from "./repo/entities/repo.to.user.stars.entity";
import { DbRepoToUserSubmissions } from "./repo/entities/repo.to.user.submissions.entity";
import { DbRepoToUserStargazers } from "./repo/entities/repo.to.user.stargazers.entity";
import { AuthModule } from "./auth/auth.module";
import { VoteModule } from "./vote/vote.module";
import { StarModule } from "./star/star.module";
import { StargazeModule } from "./stargaze/stargaze.module";
import { SubmitModule } from "./submit/submit.module";
import { ContributionModule } from "./contribution/contribution.module";
import { UserModule } from "./user/user.module";
import { HttpLoggerMiddleware } from "./common/middleware/http-logger.middleware";
import { version } from "../package.json";
import { DatabaseLoggerMiddleware } from "./common/middleware/database-logger.middleware";
import { InsightsModule } from "./insight/insights.module";
import { DbInsight } from "./insight/entities/insight.entity";
import { DbInsightRepo } from "./insight/entities/insight-repo.entity";
import { UserReposModule } from "./user-repo/user-repos.module";
import { DbUserRepo } from "./user-repo/user-repo.entity";
import { DbCustomer } from "./customer/customer.entity";
import { CustomerModule } from "./customer/customer.module";
import { StripeWebHookModule } from "./stripe-webhook/webhook.module";
import { StripeSubscriptionModule } from "./subscription/stripe-subscription.module";
import { DbSubscription } from "./subscription/stripe-subscription.dto";
import { DbLog } from "./log/log.entity";
import { PullRequestModule } from "./pull-requests/pull-request.module";
import { DbPullRequest } from "./pull-requests/entities/pull-request.entity";
import { DbUserHighlight } from "./user/entities/user-highlight.entity";
import { HighlightModule } from "./highlight/highlight.module";
import { DbUserToUserFollows } from "./user/entities/user-follows.entity";
import { DbInsightMember } from "./insight/entities/insight-member.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        apiConfig,
        DbApiConfig,
        DbLoggingConfig,
        endpointConfig,
        stripeConfig,
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: "ApiConnection",
      useFactory: (configService: ConfigService) => ({
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
          DbUserToUserFollows,
        ],
        synchronize: false,
        logger: new DatabaseLoggerMiddleware("OS"),
        ssl: {
          ca: configService.get("db-api.certificate"),
          rejectUnauthorized: false,
        },
        maxQueryExecutionTime: configService.get("db-api.maxQueryExecutionTime"),
      }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: "LogConnection",
      useFactory: (configService: ConfigService) => ({
        type: configService.get("db-logging.connection"),
        host: configService.get("db-logging.host"),
        port: configService.get("db-logging.port"),
        username: configService.get("db-logging.username"),
        password: configService.get("db-logging.password"),
        database: configService.get("db-logging.database"),
        autoLoadEntities: false,
        entities: [
          DbLog,
        ],
        synchronize: false,
        logger: new DatabaseLoggerMiddleware("LG"),
        ssl: {
          ca: configService.get("db-logging.certificate"),
          rejectUnauthorized: false,
        },
        maxQueryExecutionTime: configService.get("db-logging.maxQueryExecutionTime"),
      }) as TypeOrmModuleOptions,
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
    UserReposModule,
    CustomerModule,
    StripeWebHookModule,
    StripeSubscriptionModule,
    PullRequestModule,
    HighlightModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor (
    @InjectDataSource("ApiConnection")
    private readonly apiConnection: DataSource,

    @InjectDataSource("LogConnection")
    private readonly logConnection: DataSource,
  ) {}

  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes(`v${version.charAt(0)}`);
  }
}
