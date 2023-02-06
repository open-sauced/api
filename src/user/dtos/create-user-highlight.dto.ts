import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserHighlightDto {
  @ApiProperty({
    description: "Highlight PR URL",
    type: String,
    example: "github.com/open-sauced/insights/pull/1",
  })
  @IsString()
  public url: string;

  @ApiPropertyOptional({
    description: "Highlight Title",
    type: String,
    example: `My first PR!`,
  })
  @IsString()
  public title?: string;

  @ApiProperty({
    description: "Highlight Text",
    type: String,
    example: `My first PR to Open Sauced!`,
  })
  @IsString()
  public highlight: string;
}
