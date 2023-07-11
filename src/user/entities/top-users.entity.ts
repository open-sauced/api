import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class DbTopUser {
  @ApiModelProperty({
    description: "Top User Login",
    example: "bdougie",
  })
  public login?: string;
}
