import { describe, expect, it } from 'vitest'
import {
  dedupeWorkspacePaths,
  normalizeWorkspacePath,
  workspacePathsEqual,
} from './workspace-path'

describe('workspace-path', () => {
  it('normalizes slashes and Windows drive casing', () => {
    expect(normalizeWorkspacePath('d:\\projects\\alpha')).toBe('D:/projects/alpha')
    expect(normalizeWorkspacePath('d:/projects/alpha/')).toBe('D:/projects/alpha')
    expect(normalizeWorkspacePath('D:\\projects\\\\alpha//beta/')).toBe('D:/projects/alpha/beta')
    expect(normalizeWorkspacePath('/unix/path/to/project/')).toBe('/unix/path/to/project')
    expect(normalizeWorkspacePath('')).toBe('')
    expect(normalizeWorkspacePath(null)).toBe('')
  })

  it('correctly tests equality across format differences', () => {
    expect(workspacePathsEqual('d:\\projects\\alpha', 'D:/projects/alpha')).toBe(true)
    expect(workspacePathsEqual('D:/projects/alpha/', 'D:\\projects\\alpha')).toBe(true)
    expect(workspacePathsEqual('D:/projects/alpha', 'D:/projects/beta')).toBe(false)
    expect(workspacePathsEqual('', 'D:/projects/alpha')).toBe(false)
    expect(workspacePathsEqual(null, null)).toBe(false)
  })

  it('deduplicates paths preserving the first occurrence', () => {
    const raw = ['D:\\projects\\alpha', 'D:/projects/beta', 'D:/projects/alpha/', 'd:\\projects\\beta']
    expect(dedupeWorkspacePaths(raw)).toEqual(['D:\\projects\\alpha', 'D:/projects/beta'])
  })
})
