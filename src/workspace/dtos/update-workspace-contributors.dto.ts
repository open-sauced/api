import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class NewWorkspaceContributor {
  id: number;
}

export class UpdateWorkspaceContributorsDto {
  @ApiProperty({
    description: "An array of contributor objects to be added to the workspace",
    isArray: true,
    example: [{ id: 12345, login: "jpmcb" }],
  })
  @IsArray()
  @Type(() => NewWorkspaceContributor)
  contributors: { id?: number; login?: string }[];
}
