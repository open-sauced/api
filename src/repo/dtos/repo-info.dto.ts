import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class RepoInfo {
  @ApiPropertyOptional({
    description: "Repo ID",
    type: "integer",
    example: 234343,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({
    description: "Repo Full Name",
    type: String,
    example: "open-sauced/insights",
  })
  @IsString()
  @IsOptional()
  fullName?: string;
}
