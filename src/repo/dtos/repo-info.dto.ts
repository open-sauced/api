import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class RepoInfo {
  @ApiProperty({
    description: "Repo ID",
    type: "integer",
    example: 234343,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "Repo Full Name",
    type: String,
    example: "open-sauced/insights",
  })
  @IsString()
  fullName: string;
}
