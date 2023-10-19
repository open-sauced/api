import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GeneratePullRequestDescriptionDto {
  @ApiProperty({
    description: "Description Length",
    type: "integer",
    example: 250,
  })
  @IsNumber()
  @Min(100)
  @Max(500)
  descriptionLength: number;

  @ApiProperty({
    description: "Description Temperature",
    type: "integer",
    example: 7,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  temperature: number;

  @ApiProperty({
    description: "Description Tone",
    type: String,
    example: "formal",
  })
  @IsString()
  @IsIn(["exciting", "persuasive", "informative", "humorous", "formal"])
  tone: string;

  @ApiProperty({
    description: "Description Language",
    type: String,
    example: "english",
    default: "english",
  })
  @IsString()
  @IsIn(["english", "spanish", "french", "german", "italian", "portuguese", "dutch", "russian", "chinese", "korean"])
  language: string;

  @ApiPropertyOptional({
    description: "PR Diff",
    type: String,
  })
  @IsString()
  @IsOptional()
  diff?: string;

  @ApiPropertyOptional({
    description: "PR Commit Messages",
    type: String,
    isArray: true,
    example: ["chore: fixed a bug with the UI", "style: added some rounded corners to some boxes"],
  })
  @IsOptional()
  commitMessages?: string[];
}
