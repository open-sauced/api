import { ApiProperty } from "@nestjs/swagger";
import { PageMetaParameters } from "../../common/dtos/page-meta-parameters.dto";
import { PageMetaDto } from "../../common/dtos/page-meta.dto";

export class ContributionPageMetaDto extends PageMetaDto {
  @ApiProperty({
    description: "The number of all contributions",
    example: 100,
    type: "integer",
  })
  readonly allContributionsCount: number;

  constructor({ pageOptionsDto, itemCount }: PageMetaParameters, allContributionsCount: number) {
    super({ pageOptionsDto, itemCount });

    this.allContributionsCount = allContributionsCount;
  }
}
