import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

import { OrderDirectionEnum } from "../constants/order-direction.constant";

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 1000,
    default: 10,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  readonly limit?: number = 50;

  @ApiPropertyOptional({ enum: OrderDirectionEnum, enumName: "OrderDirectionEnum", default: OrderDirectionEnum.DESC })
  @IsEnum(OrderDirectionEnum)
  @IsOptional()
  readonly orderDirection?: OrderDirectionEnum = OrderDirectionEnum.DESC;

  @ApiPropertyOptional({
    description: "Range in days",
    default: 30,
    type: "integer",
  })
  @Type(() => Number)
  @IsIn([7, 30, 90])
  @IsInt()
  @IsOptional()
  readonly range?: number = 30;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 50);
  }
}
