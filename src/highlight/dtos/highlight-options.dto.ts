import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export class HighlightOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: "Highlight Repo Filter",
    example: "open-sauced/insights"
  })
  @IsString()
  @IsOptional()
  readonly repo?: string;
}
