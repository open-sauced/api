import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "User Profile Email",
    type: String,
    example: "hello@opensauced.pizza",
  })
  @IsEmail()
    email: string;
}
