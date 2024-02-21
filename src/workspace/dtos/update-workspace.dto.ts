import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsString } from "class-validator";

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

  @ApiProperty({
    description: "A boolean to make the workspace public: the authenticated user must be a paid customer",
    type: String,
    example: false,
  })
  @IsBooleanString()
  is_public: string;
}
