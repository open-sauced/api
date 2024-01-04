import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import { NewWorkspaceOrg } from "./update-workspace-orgs.dto";

export class DeleteWorkspaceOrgsDto {
  @ApiProperty({
    description: "An array of org objects to delete from the workspace",
    isArray: true,
    example: [{ id: 12345 }],
  })
  @IsArray()
  @Type(() => NewWorkspaceOrg)
  orgs: { id: number }[];
}
