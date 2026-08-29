/** 侧栏项目文件夹的显示顺序：始终按存储顺序，当前项目不置顶。 */
export function projectFolderOrder(
  recentProjects: string[],
  currentWorkspace: string | null | undefined,
  _fixedOrder?: boolean,
): string[] {
  const out: string[] = []
  const add = (p: string) => {
    if (p && !out.includes(p)) out.push(p)
  }
  for (const p of recentProjects) add(p)
  if (currentWorkspace) add(currentWorkspace)
  return out
}
