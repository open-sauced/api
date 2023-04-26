import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiProperty({
    description: "Highlight Text",
    type: String,
    example: `My first PR to Open Sauced!`,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  public highlight: string;

  @ApiPropertyOptional({
    description: "Shipped Date",
    type: String,
    example: `2023-01-19 13:24:51.000000`,
  })
  @IsDateString()
  public shipped_at?: string;
}
