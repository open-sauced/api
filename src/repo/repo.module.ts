import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { TimescaleModule } from "../timescale/timescale.module";
import { RepoFilterModule } from "../common/filters/repo-filter.module";
import { DbRepo } from "./entities/repo.entity";
import { RepoService } from "./repo.service";
import { RepoController } from "./repo.controller";

@Module({
  imports: [
    forwardRef(() => TimescaleModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([DbRepo], "ApiConnection"),
    RepoFilterModule,
  ],
  controllers: [RepoController],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
