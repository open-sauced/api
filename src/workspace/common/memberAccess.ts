import { WorkspaceMemberRoleEnum } from "../entities/workspace-member.entity";
import { DbWorkspace } from "../entities/workspace.entity";

/*
 * canUserManageWorkspace is a convenience function for checking an array of access
 * roles against a given workspace / member ID
 */
export const canUserManageWorkspace = (
  workspace: DbWorkspace,
  userId: number,
  accessRoles: WorkspaceMemberRoleEnum[]
): boolean => {
  const membership = workspace.members.find((member) => member.user_id === userId);
  const canManage = membership && accessRoles.includes(membership.role);

  if (!canManage) {
    return false;
  }

  return true;
};
