import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class BakeRepoDto {
  @ApiProperty({
    description: "Repo clone URL",
    type: String,
    example: "https://github.com/open-sauced/insights",
  })
  @IsString()
  cloneURL: string;
}
