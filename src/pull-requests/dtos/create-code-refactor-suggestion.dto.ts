import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString, Max, Min } from "class-validator";

export class GenerateCodeRefactorSuggestionDto {
  @ApiProperty({
    description: "Suggestion Length",
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
    description: "Suggestion Language",
    type: String,
    example: "english",
    default: "english",
  })
  @IsString()
  @IsIn(["english", "spanish", "french", "german", "italian", "portuguese", "dutch", "russian", "chinese", "korean"])
  language: string;

  @ApiProperty({
    description: "Code",
    type: String,
  })
  @IsString()
  code: string;
}
