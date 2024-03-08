import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MoveWorkspaceUserListDto {
  @ApiProperty({
    description: "List Page ID",
    example: "abc123",
    type: "string",
  })
  @IsString()
  id: string;
}
