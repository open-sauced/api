import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { PageMetaDto } from "../common/dtos/page-meta.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { UserService } from "../user/services/user.service";
import { DbWorkspaceOrg } from "./entities/workspace-org.entity";
import { DbWorkspace } from "./entities/workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { canUserManageWorkspace, canUserViewWorkspace } from "./common/memberAccess";
import { UpdateWorkspaceOrgsDto } from "./dtos/update-workspace-orgs.dto";
import { DeleteWorkspaceOrgsDto } from "./dtos/delete-workspace-orgs.dto";

@Injectable()
export class WorkspaceOrgsService {
  constructor(
    @InjectRepository(DbWorkspaceOrg, "ApiConnection")
    private workspaceOrgRepository: Repository<DbWorkspaceOrg>,
    private workspaceService: WorkspaceService,
    private userService: UserService
  ) {}

  baseQueryBuilder(): SelectQueryBuilder<DbWorkspaceOrg> {
    const builder = this.workspaceOrgRepository.createQueryBuilder("workspace_orgs");

    return builder;
  }

  async findAllOrgsByWorkspaceIdForUserId(
    pageOptionsDto: PageOptionsDto,
    id: string,
    userId: number | undefined
  ): Promise<PageDto<DbWorkspaceOrg>> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * viewers, editors, and owners can see what orgs belongs to a workspace
     */

    const canView = canUserViewWorkspace(workspace, userId);

    if (!canView) {
      throw new NotFoundException();
    }

    const queryBuilder = this.baseQueryBuilder();

    queryBuilder
      .leftJoinAndSelect("workspace_orgs.org", "workspace_orgs_org", "workspace_orgs.org_id = workspace_orgs_org.id")
      .where("workspace_orgs.workspace_id = :id", { id });

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async addOneWorkspaceOrg(id: string, orgUserId: number, userId: number): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can update the workspace orgs
     */

    const canUpdate = canUserManageWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const existingOrg = await this.workspaceOrgRepository.findOne({
      where: {
        org_id: orgUserId,
        workspace_id: id,
      },
      withDeleted: true,
    });

    if (existingOrg) {
      await this.workspaceOrgRepository.restore(existingOrg.id);
    } else {
      const user = await this.userService.findOneById(orgUserId);

      if (user.type.toLowerCase() !== "organization") {
        throw new NotFoundException("not an org");
      }

      const newOrg = new DbWorkspaceOrg();

      newOrg.workspace = workspace;
      newOrg.org = user;

      await this.workspaceOrgRepository.save(newOrg);
    }

    return this.workspaceService.findOneById(id);
  }

  async addWorkspaceOrgs(dto: UpdateWorkspaceOrgsDto, id: string, userId: number): Promise<DbWorkspace> {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can update the workspace orgs
     */

    const canUpdate = canUserManageWorkspace(workspace, userId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    const promises = dto.orgs.map(async (org) => {
      const existingOrg = await this.workspaceOrgRepository.findOne({
        where: {
          workspace_id: id,
          org_id: org.id,
        },
        withDeleted: true,
      });

      if (existingOrg) {
        await this.workspaceOrgRepository.restore(existingOrg.id);
      } else {
        const user = await this.userService.findOneById(org.id);

        if (user.type.toLowerCase() !== "organization") {
          throw new NotFoundException("not an org");
        }

        const newOrg = new DbWorkspaceOrg();

        newOrg.workspace = workspace;
        newOrg.org = user;

        await this.workspaceOrgRepository.save(newOrg);
      }
    });

    await Promise.all(promises);
    return this.workspaceService.findOneById(id);
  }

  async deleteWorkspaceOrgs(dto: DeleteWorkspaceOrgsDto, id: string, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can delete the workspace orgs
     */

    const canDelete = canUserManageWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const promises = dto.orgs.map(async (org) => {
      const existingOrg = await this.workspaceOrgRepository.findOne({
        where: {
          workspace_id: id,
          org_id: org.id,
        },
      });

      if (!existingOrg) {
        throw new NotFoundException();
      }

      return this.workspaceOrgRepository.softDelete(existingOrg.id);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      dto.orgs.forEach(async (org) => {
        // restore the members who may have been soft deleted
        const existingOrg = await this.workspaceOrgRepository.findOne({
          where: {
            workspace_id: id,
            org_id: org.id,
          },
          withDeleted: true,
        });

        if (existingOrg) {
          await this.workspaceOrgRepository.restore(existingOrg.id);
        }
      });

      // throws the original error
      throw error;
    }

    return this.workspaceService.findOneById(id);
  }

  async deleteOneWorkspaceOrg(id: string, orgUserId: number, userId: number) {
    const workspace = await this.workspaceService.findOneById(id);

    /*
     * owners can delete the workspace orgs
     */

    const canDelete = canUserManageWorkspace(workspace, userId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    const existingOrg = await this.workspaceOrgRepository.findOne({
      where: {
        workspace_id: id,
        org_id: orgUserId,
      },
    });

    if (!existingOrg) {
      throw new NotFoundException();
    }

    await this.workspaceOrgRepository.softDelete(existingOrg.id);

    return this.workspaceService.findOneById(id);
  }
}
