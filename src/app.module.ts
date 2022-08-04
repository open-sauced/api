import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { DataSource } from "typeorm";

import { RepoModule } from "./repo/repo.module";
import apiConfig from "./config/api.config";
import dbConfig from "./config/database.config";
import endpointConfig from "./config/endpoint.config";
import { HealthModule } from "./health/health.module";
import { Repo } from "./repo/repo.entity";
import { User } from "./user/user.entity";
import { Contribution } from "./contribution/contribution.entity";
import { RepoToUserVotes } from "./repo/repo.to.user.votes.entity";
import { RepoToUserStars } from "./repo/repo.to.user.stars.entity";
import { RepoToUserSubmissions } from "./repo/repo.to.user.submissions.entity";
import { RepoToUserStargazers } from "./repo/repo.to.user.stargazers.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        apiConfig,
        dbConfig,
        endpointConfig
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => <TypeOrmModuleOptions>({
        type: configService.get("db.connection"),
        host: configService.get("db.host"),
        port: configService.get("db.port"),
        username: configService.get("db.username"),
        password: configService.get("db.password"),
        database: configService.get("db.database"),
        autoLoadEntities: false,
        entities: [
          User,
          Repo,
          Contribution,
          RepoToUserVotes,
          RepoToUserStars,
          RepoToUserSubmissions,
          RepoToUserStargazers,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TerminusModule,
    HttpModule,
    HealthModule,
    RepoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
