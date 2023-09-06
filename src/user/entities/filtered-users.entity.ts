import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class DbFilteredUser {
  @ApiModelProperty({
    description: "User Login",
    example: "bdougie",
  })
  public login?: string;

  @ApiModelProperty({
    description: "Users fullname",
    example: "Brian Douglas",
  })
  public full_name: string;
}
