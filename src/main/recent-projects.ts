/** 项目 MRU 列表上限（与 config-store 历史行为一致）。 */
export const RECENT_PROJECTS_CAP = 10

/**
 * 计算 addRecentProject 之后的新列表。
 * 已在列表中的项目永不移动（切换会话/项目不得把该项目置顶）。
 * 新项目：fixedOrder=true 追加到末尾；fixedOrder=false 插到最前。
 */
export function nextRecentProjects(recent: string[], path: string, fixedOrder: boolean): string[] {
  if (recent.includes(path)) return recent
  if (fixedOrder) return [...recent, path].slice(-RECENT_PROJECTS_CAP)
  return [path, ...recent].slice(0, RECENT_PROJECTS_CAP)
}
