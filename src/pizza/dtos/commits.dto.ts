import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CommitsDto {
  @ApiProperty({
    description: "Hash for a specific commit",
    type: String,
    example: "5e7c6c7af42d38c57f363c564c58007da448c443",
  })
  @IsString()
  commit_hash: string;
}
