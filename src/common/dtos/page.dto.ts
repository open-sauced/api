import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";
import { Type } from "class-transformer";

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  @ValidateNested({ each: true })
  @Type(() => Array)
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  @ValidateNested()
  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
