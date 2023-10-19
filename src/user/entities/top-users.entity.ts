import { ApiProperty } from "@nestjs/swagger";

export class DbTopUser {
  @ApiProperty({
    description: "Top User Login",
    example: "bdougie",
  })
  public login?: string;
}
