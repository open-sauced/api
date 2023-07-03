import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateInsightMemberDto {
  @ApiProperty({
    description: "Insight Team Member Invite Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
  email: string;
}
