import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { OrderDirectionEnum } from "../../common/constants/order-direction.constant";

export class BaseHistogramDto {
  @ApiProperty({
    description: "Range in days",
    default: 30,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([7, 30, 90])
  @IsInt()
  readonly range: number = 30;

  @ApiPropertyOptional({
    description: "Number of days in the past to start range block",
    default: 0,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([0, 7, 30, 90])
  @IsInt()
  @IsOptional()
  readonly prev_days_start_date?: number = 0;

  @ApiPropertyOptional({
    description: "Day width of histogram buckets",
    default: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly width?: number = 1;

  @ApiPropertyOptional({
    description: "Repo name",
    type: "string",
    example: "open-sauced/app",
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly repo?: string;

  @ApiPropertyOptional({
    type: "string",
    example: "bdougie",
  })
  @IsString()
  @IsOptional()
  readonly contributor?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly repoIds?: string;

  @ApiPropertyOptional({ enum: OrderDirectionEnum, enumName: "OrderDirectionEnum", default: OrderDirectionEnum.DESC })
  @IsEnum(OrderDirectionEnum)
  @IsOptional()
  readonly orderDirection?: OrderDirectionEnum = OrderDirectionEnum.DESC;
}
