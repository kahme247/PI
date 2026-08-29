import { dedupeWorkspacePaths, normalizeWorkspacePath } from '@shared/workspace-path'

/** 侧栏项目文件夹的显示顺序：始终按存储顺序，当前项目不置顶。 */
export function projectFolderOrder(
  recentProjects: string[],
  currentWorkspace: string | null | undefined,
  _fixedOrder?: boolean,
): string[] {
  const merged = [...recentProjects]
  if (currentWorkspace) merged.push(currentWorkspace)
  return dedupeWorkspacePaths(merged.filter((p) => Boolean(normalizeWorkspacePath(p))))
}
