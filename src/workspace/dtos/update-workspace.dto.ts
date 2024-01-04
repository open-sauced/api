import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateWorkspaceDto {
  @ApiProperty({
    description: "Workspace name",
    type: String,
    example: "My Workspace",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Workspace description",
    type: String,
    example: "A workspace for my OSS collaborators",
  })
  @IsString()
  description: string;
}
