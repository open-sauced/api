import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserCollaborationDto {
  @ApiProperty({
    description: "Collaboration Recipient Username",
    type: String,
    example: "bdougie",
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "Collaboration Request Message",
    type: String,
    example: "Come collaborate on a cool project",
  })
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  message: string;
}
