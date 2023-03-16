import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class RepoInfo {
  @ApiProperty({
    description: "Repo ID",
    type: Number,
    example: 234343,
  })
  @IsNumber()
    id: number;

  @ApiProperty({
    description: "Repo Full Name",
    type: String,
    example: "open-sauced/open-sauced",
  })
  @IsString()
    fullName: string;
}
