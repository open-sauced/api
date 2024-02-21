import { WorkspaceMemberRoleEnum } from "../entities/workspace-member.entity";
import { DbWorkspace } from "../entities/workspace.entity";

/*
 * canUserManageWorkspace is a convenience function for checking if a given user
 * and an associated workspace with its members can manage the workspace.
 * only owners can fully manage a workspace.
 */
export const canUserManageWorkspace = (workspace: DbWorkspace, userId: number): boolean =>
  workspaceAccessControl(workspace, userId, [WorkspaceMemberRoleEnum.Owner]);

/*
 * canUserEditWorkspace is a convenience function for checking if a given user
 * and an associated workspace with its members can edit the workspace.
 * only editors and owners can edit a workspace.
 */
export const canUserEditWorkspace = (workspace: DbWorkspace, userId: number): boolean =>
  workspaceAccessControl(workspace, userId, [WorkspaceMemberRoleEnum.Editor, WorkspaceMemberRoleEnum.Owner]);

/*
 * canUserViewWorkspace is a convenience function for checking if a given user
 * and an associated workspace with its members can view the workspace.
 * only viewers, editors, and owners can all view a workspace.
 *
 * WARNING!!! If a workspace has the "is_public" flag set to true, this will short
 * circuit and return true regardless of "userId" being a valid user ID or undefined.
 */
export const canUserViewWorkspace = (workspace: DbWorkspace, userId: number | undefined): boolean => {
  if (workspace.is_public) {
    return true;
  }

  return workspaceAccessControl(workspace, userId, [
    WorkspaceMemberRoleEnum.Viewer,
    WorkspaceMemberRoleEnum.Editor,
    WorkspaceMemberRoleEnum.Owner,
  ]);
};

const workspaceAccessControl = (
  workspace: DbWorkspace,
  userId: number | undefined,
  accessRoles: WorkspaceMemberRoleEnum[]
): boolean => {
  if (!userId) {
    return false;
  }

  const membership = workspace.members.find((member) => member.user_id === userId);
  const canManage = membership && accessRoles.includes(membership.role);

  if (!canManage) {
    return false;
  }

  return true;
};
