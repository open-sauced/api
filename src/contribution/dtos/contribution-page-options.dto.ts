import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PageOptionsDto } from "../../common/dtos/page-options.dto";

export enum ContributionOrderFieldsEnum {
  count = "count",
  last_merged_at = "last_merged_at",
  created_at = "created_at",
  updated_at = "updated_at",
  contributor = "contributor",
}

export class ContributionPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: ContributionOrderFieldsEnum,
    enumName: "RepoOrderFieldsEnum",
    default: ContributionOrderFieldsEnum.count,
  })
  @IsEnum(ContributionOrderFieldsEnum)
  @IsOptional()
  readonly orderBy?: ContributionOrderFieldsEnum = ContributionOrderFieldsEnum.count;
}
