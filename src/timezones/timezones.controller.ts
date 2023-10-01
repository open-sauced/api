import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TimezoneService } from "./timezones.service";
import { DbTimezone } from "./entities/timezones.entity";

@Controller("timezones")
@ApiTags("timezones service")
export class TimezoneController {
  constructor(private timezoneService: TimezoneService) {}

  @Get("/")
  @ApiOperation({
    operationId: "findAllTimezones",
    summary: "Listing all timezones",
  })
  @ApiOkResponse({ type: DbTimezone })
  async findAllTimezones(): Promise<DbTimezone[]> {
    return this.timezoneService.findAll();
  }
}
