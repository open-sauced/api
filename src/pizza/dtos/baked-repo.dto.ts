import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class BakeRepoDto {
  @ApiProperty({
    description: "Repo clone URL",
    type: String,
    example: "https://github.com/open-sauced/insights",
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: "Option to wait for Pizza service to finish baking repo",
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  wait: boolean;
}
