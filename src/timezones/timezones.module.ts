import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DbTimezone } from "./entities/timezones.entity";
import { TimezoneService } from "./timezones.service";
import { TimezoneController } from "./timezones.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DbTimezone], "ApiConnection")],
  controllers: [TimezoneController],
  providers: [TimezoneService],
  exports: [TimezoneService],
})
export class TimezoneModule {}
