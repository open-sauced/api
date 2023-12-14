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
} from "typeorm";

import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { ApiHideProperty } from "@nestjs/swagger";
import { DbWorkspaceMember } from "./workspace-member.entity";
import { DbWorkspaceOrg } from "./workspace-org.entity";
import { DbWorkspaceRepo } from "./workspace-repos.entity";
import { DbWorkspaceInsight } from "./workspace-insights.entity";

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
}
