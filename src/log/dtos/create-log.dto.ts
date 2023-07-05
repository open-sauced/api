import { IsOptional, IsString } from "class-validator";

export class CreateLogDto {
  @IsOptional()
  @IsString()
  readonly context?: string;

  @IsOptional()
  @IsString()
  readonly message?: string;

  @IsOptional()
  @IsString()
  readonly level?: string;
}
