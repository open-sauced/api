import { ApiProperty } from "@nestjs/swagger";
import { PageMetaParameters } from "./page-meta-parameters.dto";

export class PageMetaDto {
  @ApiProperty({
    description: "The current page",
    example: 1,
    type: "integer",
  })
  readonly page: number;

  @ApiProperty({
    description: "The number of items per page",
    example: 10,
    type: "integer",
  })
  readonly limit: number;

  @ApiProperty({
    description: "The number of items in the collection",
    example: 100,
    type: "integer",
  })
  readonly itemCount: number;

  @ApiProperty({
    description: "The number of pages in the collection",
    example: 10,
    type: "integer",
  })
  readonly pageCount: number;

  @ApiProperty({
    description: "Flag indicating if there is a previous page",
    example: false,
  })
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: "Flag indicating if there is a next page",
    example: true,
  })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaParameters) {
    this.page = pageOptionsDto.page ?? 1;
    this.limit = pageOptionsDto.limit ?? 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
