import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PageMetaDto } from "../../common/dtos/page-meta.dto";

export class ContributionsPageDto<T> {
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
