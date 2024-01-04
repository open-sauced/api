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

export enum WorkspaceMemberRoleEnum {
  Owner = "owner",
  Editor = "editor",
  Viewer = "viewer",
}

@Entity({ name: "workspace_members" })
export class DbWorkspaceMember extends BaseEntity {
  @ApiModelProperty({
    description: "Workspace member identifier",
    example: "abc-123",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "Workspace member user identifier",
    example: 237133,
    type: "integer",
  })
  @Column()
  public user_id!: number;

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

  @ApiModelProperty({
    description: "Role for the workspace member",
    example: WorkspaceMemberRoleEnum.Owner,
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public role: WorkspaceMemberRoleEnum;

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.workspaces, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  public member: DbUser;

  @ApiHideProperty()
  @ManyToOne(() => DbWorkspace, (workspace) => workspace.members)
  @JoinColumn({
    name: "workspace_id",
    referencedColumnName: "id",
  })
  public workspace: DbWorkspace;
}
