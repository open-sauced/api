import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";
import { NewMember } from "./create-workspace.dto";

export class DeleteWorkspaceMembersDto {
  @ApiProperty({
    description: "An array of member objects to delete from the workspace",
    isArray: true,
    example: [{ id: 12345 }],
  })
  @IsArray()
  @Type(() => NewMember)
  members: { id: number }[];
}
