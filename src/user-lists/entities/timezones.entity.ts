import { ApiProperty } from "@nestjs/swagger";

export class DbTimezone {
  @ApiProperty({
    description: "Timezone string",
    example: "America/Los_Angeles",
  })
  public timezone: string;
}
