import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, Entity } from "typeorm";

@Entity({ name: "user_list_contributors" })
export class DbContributionsProjects {
  @ApiModelProperty({
    description: "The org name of the repo",
    example: 0,
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  orgId: string;

  @ApiModelProperty({
    description: "The project name of the repo",
    example: 0,
    type: "string",
  })
  @Column({
    type: "string",
    select: false,
    insert: false,
  })
  projectId: string;

  @ApiModelProperty({
    description: "The number of contributions associated with a org/repo",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "bigint",
    select: false,
    insert: false,
  })
  contributions: number;
}
