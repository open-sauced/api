import { ApiPropertyOptional } from "@nestjs/swagger";

export class DbTopUser {
  @ApiPropertyOptional({
    description: "Top User Login",
    example: "bdougie",
  })
  public login?: string;
}
