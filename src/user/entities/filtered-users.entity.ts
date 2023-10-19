import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class DbFilteredUser {
  @ApiPropertyOptional({
    description: "User Login",
    example: "bdougie",
  })
  public login?: string;

  @ApiProperty({
    description: "Users fullname",
    example: "Brian Douglas",
  })
  public full_name: string;
}
