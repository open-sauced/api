import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";
import { LoggerModule } from "nestjs-pino";
import { DataSource } from "typeorm";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { clc } from "@nestjs/common/utils/cli-colors.util";

import { RepoModule } from "./repo/repo.module";
import apiConfig from "./config/api.config";
import dbConfig from "./config/database.config";
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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        apiConfig,
        dbConfig,
        endpointConfig,
        stripeConfig,
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get("db.connection"),
        host: configService.get("db.host"),
        port: configService.get("db.port"),
        username: configService.get("db.username"),
        password: configService.get("db.password"),
        database: configService.get("db.database"),
        autoLoadEntities: false,
        entities: [
          DbUser,
          DbUserRepo,
          DbRepo,
          DbContribution,
          DbRepoToUserVotes,
          DbRepoToUserStars,
          DbRepoToUserSubmissions,
          DbRepoToUserStargazers,
          DbInsight,
          DbInsightRepo,
          DbCustomer,
          DbSubscription,
        ],
        synchronize: false,
        logger: (new DatabaseLoggerMiddleware),
        maxQueryExecutionTime: configService.get("db.maxQueryExecutionTime"),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor (private dataSource: DataSource) {}
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes(`v${version.charAt(0)}`);
  }
}
