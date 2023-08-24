import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "endorsements" })
export class DbEndorsement {
  @ApiModelProperty({
    description: "Endorsement identifier",
    example: "uuid-v4",
  })
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Endorsement Creator User ID",
    example: 237133,
    type: "integer",
  })
  @Column({ type: "integer" })
  public creator_user_id?: number;

  @ApiModelProperty({
    description: "Endorsement Recipient User ID",
    example: 31333,
    type: "integer",
  })
  @Column({ type: "integer" })
  public recipient_user_id?: number;

  @ApiModelProperty({
    description: "Repository ID",
    example: 78133,
    type: "integer",
  })
  @Column({ type: "integer" })
  public repo_id: number;

  @ApiModelProperty({ description: "Endorsement Source Comment URL" })
  @Column({
    type: "character varying",
    length: 500,
  })
  public source_comment_url?: string;

  @ApiModelProperty({ description: "Endorsement Source Context URL" })
  @Column({
    type: "character varying",
    length: 20,
  })
  public source_context_url: string;

  @ApiModelProperty({
    description: "Endorsement Type",
    example: "doc",
  })
  @Column({
    type: "character varying",
    length: 20,
  })
  public type: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing endorsement creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;
}
