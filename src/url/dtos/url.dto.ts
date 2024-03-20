import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UrlShortenerDto {
  @ApiProperty({
    description: "URL to shorten",
    example: "https://app.opensauced.pizza",
    type: "string",
  })
  @IsString()
  readonly url: string;
}
