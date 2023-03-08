import { Module } from "@nestjs/common";

import { RepoFilterService } from "./repo-filter.service";

@Module({
  providers: [RepoFilterService],
  exports: [RepoFilterService],
})
export class RepoFilterModule {}
