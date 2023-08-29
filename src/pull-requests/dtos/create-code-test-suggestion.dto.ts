import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class GenerateCodeTestSuggestionDto {
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
    description: "Code",
    type: String,
  })
  @IsString()
  code: string;
}
