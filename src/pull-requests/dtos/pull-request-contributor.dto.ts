import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class DbPullRequestContributor {
  @ApiModelProperty({
    description: "Pull request author username",
    example: "Th3nn3ss",
  })
  public author_login: string;

  @ApiModelProperty({
    description: "Timestamp representing pr last update",
    example: "2022-08-28 22:04:29.000000",
  })
  public updated_at?: Date;
}
