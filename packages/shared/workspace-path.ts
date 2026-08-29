/**
 * Normalize and compare workspace / project directory paths across main and renderer.
 * Handles mixed Windows backslashes, redundant slashes, drive letter casing,
 * and trailing separators to prevent list reordering / deduplication bugs.
 */

export function normalizeWorkspacePath(path: string | null | undefined): string {
  const raw = String(path || '').trim()
  if (!raw) return ''
  let key = raw.replace(/\\/g, '/')
  if (key.startsWith('//')) {
    key = `//${key.slice(2).replace(/\/+/g, '/')}`
  } else {
    key = key.replace(/\/+/g, '/')
  }
  if (/^[a-zA-Z]:\//.test(key)) {
    key = key.charAt(0).toUpperCase() + key.slice(1)
  }
  if (key.length > 1 && !/^[a-zA-Z]:\/$/.test(key)) {
    key = key.replace(/\/+$/, '')
  }
  return key
}

export function workspacePathsEqual(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  const na = normalizeWorkspacePath(a)
  const nb = normalizeWorkspacePath(b)
  if (!na || !nb) return false
  return na === nb
}

export function dedupeWorkspacePaths(paths: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of paths) {
    const norm = normalizeWorkspacePath(p)
    if (norm && !seen.has(norm)) {
      seen.add(norm)
      out.push(p)
    }
  }
  return out
}
