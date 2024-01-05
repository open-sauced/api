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
import { DbUser } from "../../user/user.entity";
import { DbWorkspace } from "./workspace.entity";

@Entity({ name: "workspace_orgs" })
export class DbWorkspaceOrg extends BaseEntity {
  @ApiModelProperty({
    description: "Workspace org identifier",
    example: "abc-123",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Org identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public org_id!: number;

  @ApiModelProperty({
    description: "Workspace identifier",
    example: "abc-123",
  })
  @Column()
  public workspace_id!: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace org creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace org last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace org deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.workspaces, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "org_id",
    referencedColumnName: "id",
  })
  public org: DbUser;

  @ApiHideProperty()
  @ManyToOne(() => DbWorkspace, (workspace) => workspace.members)
  @JoinColumn({
    name: "workspace_id",
    referencedColumnName: "id",
  })
  public workspace: DbWorkspace;
}
