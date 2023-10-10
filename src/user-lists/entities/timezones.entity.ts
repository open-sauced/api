import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class DbTimezone {
  @ApiModelProperty({
    description: "Timezone string",
    example: "America/Los_Angeles",
  })
  public timezone: string;
}
