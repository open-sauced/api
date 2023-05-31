import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateEndorsementDto {
  @ApiProperty({
    description: "Endorsement Creator User ID",
    type: Number,
    example: 42211,
  })
  @IsNumber()
  public creator_user_id: number;

  @ApiProperty({
    description: "Endorsement Recipient User ID",
    type: Number,
    example: 5736810,
  })
  @IsNumber()
  public recipient_user_id: number;

  @ApiProperty({
    description: "Repository ID",
    example: 78133,
  })
  @IsNumber()
  public repo_id: number;

  @ApiPropertyOptional({
    description: "Endorsement Source Comment URL",
    default: "",
  })
  @IsString()
  @IsOptional()
  public source_comment_url?: string;

  @ApiProperty({
    description: "Endorsement Source Context URL",
    example: "https://github.com/open-sauced/insights/pulls",
  })
  @IsString()
  public source_context_url: string;

  @ApiProperty({
    description: "Endorsement Type",
    example: "doc",
  })
  @IsString()
  public type: string;
}
