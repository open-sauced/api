import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserHighlightDto {
  @ApiProperty({
    description: "Highlight PR URL",
    type: String,
    example: "github.com/open-sauced/insights/pull/1",
  })
  @IsString()
  public url: string;

  @ApiProperty({
    description: "Highlight Text",
    type: String,
    example: `My first PR to Open Sauced!`,
  })
  @IsString()
  public highlight: string;
}
