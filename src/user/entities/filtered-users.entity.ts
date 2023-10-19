import { ApiProperty } from "@nestjs/swagger";

export class DbFilteredUser {
  @ApiProperty({
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
