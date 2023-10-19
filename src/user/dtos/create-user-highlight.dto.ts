import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
  @IsOptional()
  public shipped_at?: string;

  @ApiProperty({
    description: "Highlight type",
    type: String,
    example: "pull_request",
  })
  @IsString()
  @IsIn(["pull_request", "blog_post", "issue", "milestone"])
  public type = "pull_request";

  @ApiProperty({
    description: "An array of full-names of tagged repositories",
    example: ["open-sauced/insights", "open-sauced/ai"],
    type: "string",
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  public taggedRepos: string[];
}
