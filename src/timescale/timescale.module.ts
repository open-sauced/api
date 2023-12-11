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
import { DbPullRequestGitHubEvents } from "./entities/pull_request_github_event";

@Module({
  imports: [
    RepoModule,
    UserListModule,
    TypeOrmModule.forFeature([DbPullRequestGitHubEvents], "TimescaleConnection"),
    TypeOrmModule.forFeature([DbRepo, DbUser, DbUserList, DbUserListContributor, DbUserHighlight], "ApiConnection"),
  ],
  providers: [PullRequestGithubEventsService],
  exports: [PullRequestGithubEventsService],
})
export class TimescaleModule {}
