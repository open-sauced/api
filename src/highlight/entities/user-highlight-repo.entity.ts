import { ApiProperty } from "@nestjs/swagger";

export class DbUserHighlightRepo {
  @ApiProperty({
    description: "Highlight Repo Full Name",
    example: "open-sauced/insights",
  })
  public full_name?: string;
}
