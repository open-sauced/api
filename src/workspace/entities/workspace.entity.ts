import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";
import { DbUser } from "../../user/user.entity";
import { DbWorkspaceMember } from "./workspace-member.entity";
import { DbWorkspaceOrg } from "./workspace-org.entity";
import { DbWorkspaceRepo } from "./workspace-repos.entity";
import { DbWorkspaceInsight } from "./workspace-insights.entity";
import { DbWorkspaceUserLists } from "./workspace-user-list.entity";

@Entity({ name: "workspaces" })
export class DbWorkspace extends BaseEntity {
  @ApiModelProperty({
    description: "Workspace identifier",
    example: "abc-123",
  })
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  public id!: string;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace creation",
    example: "2022-10-19 13:24:51.000000",
  })
  @CreateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public created_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace last updated",
    example: "2022-10-19 13:24:51.000000",
  })
  @UpdateDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public updated_at?: Date;

  @ApiModelPropertyOptional({
    description: "Timestamp representing workspace deletion",
    example: "2022-10-19 13:24:51.000000",
  })
  @DeleteDateColumn({
    type: "timestamp without time zone",
    default: () => "now()",
  })
  public deleted_at?: Date;

  @ApiModelProperty({
    description: "Name of workspace",
    example: "OpenSauced's workspace",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public name: string;

  @ApiModelProperty({
    description: "User defined description of the workspace",
    example: "A workspace for OpenSauced employees",
  })
  @Column({
    type: "character varying",
    length: 255,
  })
  public description: string;

  @ApiModelProperty({
    description: "Flag indicating public workspace visibility",
    example: true,
  })
  @Column({ default: true })
  public is_public: boolean;

  @ApiModelProperty({
    description: "User ID of the payee for a paid workspace",
    example: 12345,
    type: "number",
  })
  @Column({
    default: null,
    type: "bigint",
    select: true,
  })
  public payee_user_id: number | null;

  @ApiHideProperty()
  @OneToMany(() => DbWorkspaceMember, (workspaceMember) => workspaceMember.workspace, { onDelete: "CASCADE" })
  public members: DbWorkspaceMember[];

  @ApiHideProperty()
  @OneToMany(() => DbWorkspaceOrg, (workspaceOrg) => workspaceOrg.workspace, { onDelete: "CASCADE" })
  public orgs: DbWorkspaceOrg[];

  @ApiHideProperty()
  @OneToMany(() => DbWorkspaceRepo, (workspaceRepo) => workspaceRepo.workspace, { onDelete: "CASCADE" })
  public repos: DbWorkspaceRepo[];

  @ApiHideProperty()
  @OneToMany(() => DbWorkspaceInsight, (workspaceInsight) => workspaceInsight.workspace, { onDelete: "CASCADE" })
  public insights: DbWorkspaceInsight[];

  @ApiHideProperty()
  @OneToMany(() => DbWorkspaceUserLists, (workspaceUserList) => workspaceUserList.workspace, { onDelete: "CASCADE" })
  public user_lists: DbWorkspaceUserLists[];

  @ApiHideProperty()
  @ManyToOne(() => DbUser, (user) => user.paid_workspaces, { onDelete: "CASCADE" })
  @JoinColumn({
    name: "payee_user_id",
    referencedColumnName: "id",
  })
  public payee_user: DbUser;
}
