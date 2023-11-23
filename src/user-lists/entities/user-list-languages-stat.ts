import { Column, Entity } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

@Entity({ name: "user_list_languages" })
export class DbUserListLanguageStat {
  @ApiModelProperty({
    description: "A programming language",
    example: "TypeScript",
  })
  @Column({
    type: "text",
    select: false,
    insert: false,
  })
  public name: string;

  @ApiModelProperty({
    description: "Percentage of use of a programming language",
    example: 0,
    type: "integer",
  })
  @Column({
    type: "int",
    select: false,
    insert: false,
  })
  value: number;
}
