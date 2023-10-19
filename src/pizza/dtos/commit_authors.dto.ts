import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CommitAuthorDto {
  @ApiProperty({
    description: "Public Commit Author Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsString()
  author_email: string;
}
