import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogService } from "./log.service";
import { DbLog } from "./log.entity";
import CustomLogger from "./custom-logger";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([DbLog], "LogConnection")],
  providers: [CustomLogger, LogService],
  exports: [CustomLogger],
})
export class LogModule {}
