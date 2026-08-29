import {
  dedupeWorkspacePaths,
  normalizeWorkspacePath,
  workspacePathsEqual,
} from '@shared/workspace-path'

/** 项目 MRU 列表上限（与 config-store 历史行为一致）。 */
export const RECENT_PROJECTS_CAP = 10

/**
 * 计算 addRecentProject 之后的新列表。
 * 已在列表中的项目永不移动（切换会话/项目不得把该项目置顶）。
 * 新项目：fixedOrder=true 追加到末尾；fixedOrder=false 插到最前。
 */
export function nextRecentProjects(recent: string[], path: string, fixedOrder: boolean): string[] {
  const normPath = normalizeWorkspacePath(path)
  if (!normPath) return recent
  const deduped = dedupeWorkspacePaths(recent)
  const existing = deduped.some((p) => workspacePathsEqual(p, normPath))
  if (existing) return deduped
  if (fixedOrder) return dedupeWorkspacePaths([...deduped, path]).slice(-RECENT_PROJECTS_CAP)
  return dedupeWorkspacePaths([path, ...deduped]).slice(0, RECENT_PROJECTS_CAP)
}
