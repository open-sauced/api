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
import { DbUserList } from "../../user-lists/entities/user-list.entity";
import { DbWorkspace } from "./workspace.entity";

@Entity({ name: "workspace_user_lists" })
export class DbWorkspaceUserLists extends BaseEntity {
  @ApiModelProperty({
    description: "Workspace user list identifier",
    example: "abc-123",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelProperty({
    description: "User list UUID identifier",
    example: "abc-123",
    type: "string",
  })
  @Column()
  public user_list_id!: string;

  @ApiModelProperty({
    description: "Workspace identifier",
    example: "abc-123",
  })
  @Column()
  public workspace_id!: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace user list creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace user list last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace user list deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiHideProperty()
  @ManyToOne(() => DbUserList, (userList) => userList.workspaces, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "user_list_id",
    referencedColumnName: "id",
  })
  public user_list: DbUserList;

  @ApiHideProperty()
  @ManyToOne(() => DbWorkspace, (workspace) => workspace.user_lists)
  @JoinColumn({
    name: "workspace_id",
    referencedColumnName: "id",
  })
  public workspace: DbWorkspace;
}
