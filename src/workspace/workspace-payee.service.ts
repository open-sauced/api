import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DbWorkspace } from "./entities/workspace.entity";

@Injectable()
export class WorkspacePayeeService {
  constructor(
    @InjectRepository(DbWorkspace, "ApiConnection")
    private workspaceRepository: Repository<DbWorkspace>
  ) {}

  async addWorkspacePayee(id: string, userId: number) {
    return this.workspaceRepository.update(id, {
      payee_user_id: userId,
    });
  }

  async removeWorkspacePayee(id: string) {
    return this.workspaceRepository.update(id, {
      payee_user_id: null,
    });
  }
}
