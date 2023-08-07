import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbUserHighlight } from "../user/entities/user-highlight.entity";
import { UserModule } from "../user/user.module";
import { HighlightController } from "./highlight.controller";

@Module({
  controllers: [HighlightController],
  imports: [TypeOrmModule.forFeature([DbUserHighlight], "ApiConnection"), UserModule],
})
export class HighlightModule {}
