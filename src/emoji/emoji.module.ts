import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmojiController } from "./emoji.controller";
import { DbEmoji } from "./entities/emoji.entity";
import { EmojiService } from "./emoji.service";

@Module({
  imports: [TypeOrmModule.forFeature([DbEmoji], "ApiConnection")],
  controllers: [EmojiController],
  providers: [EmojiService],
})
export class EmojiModule {}
