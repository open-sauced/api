import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsInt, IsString } from "class-validator";

export class CreateInsightMemberDto {
  @ApiPropertyOptional({
    description: "Insight Team Member User ID",
    type: Number,
    example: 1337331,
  })
  @IsInt()
    user_id?: number;

  @ApiPropertyOptional({
    description: "Insight Team Member Invite Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
    email?: string;

  @ApiProperty({
    description: "Insight Member Access",
    type: String,
    example: "view",
  })
  @IsString()
  @IsIn(["view", "edit", "admin", "pending"])
    access: string;
}
