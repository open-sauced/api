import { ApiPropertyOptional } from "@nestjs/swagger";

export class DbUserHighlightRepo {
  @ApiPropertyOptional({
    description: "Highlight Repo Full Name",
    example: "open-sauced/insights",
  })
  public full_name?: string;
}
