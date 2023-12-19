import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";
import { DbInsight } from "../../insight/entities/insight.entity";
import { DbWorkspace } from "./workspace.entity";

@Entity({ name: "workspace_insights" })
export class DbWorkspaceInsight extends BaseEntity {
  @ApiModelProperty({
    description: "Workspace insight identifier",
    example: "abc-123",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Insight identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public insight_id!: number;

  @ApiModelProperty({
    description: "Workspace identifier",
    example: "abc-123",
  })
  @Column()
  public workspace_id!: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace member creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace member last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace member deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbInsight, (insight) => insight.workspaces, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public insight: DbInsight;

  @ApiHideProperty()
  @ManyToOne(() => DbWorkspace, (workspace) => workspace.members)
  @JoinColumn({
    name: "workspace_id",
    referencedColumnName: "id",
  })
  public workspace: DbWorkspace;
}
