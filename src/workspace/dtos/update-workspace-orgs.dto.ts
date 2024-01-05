import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class NewWorkspaceOrg {
  id: number;
}

export class UpdateWorkspaceOrgsDto {
  @ApiProperty({
    description: "An array of org objects to be added to the workspace",
    isArray: true,
    example: [{ id: 12345 }],
  })
  @IsArray()
  @Type(() => NewWorkspaceOrg)
  orgs: { id: number }[];
}
