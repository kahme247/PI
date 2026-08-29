import { describe, expect, it } from 'vitest'
import { projectFolderOrder } from './project-folder-order'

describe('projectFolderOrder', () => {
  it('keeps the stored order and never pins the current workspace', () => {
    expect(projectFolderOrder(['a', 'b', 'c'], 'b', false)).toEqual(['a', 'b', 'c'])
    expect(projectFolderOrder(['a', 'b', 'c'], 'b', true)).toEqual(['a', 'b', 'c'])
    expect(projectFolderOrder(['a', 'c'], 'b', false)).toEqual(['a', 'c', 'b'])
    expect(projectFolderOrder(['a', 'c'], 'b', true)).toEqual(['a', 'c', 'b'])
    expect(projectFolderOrder([], 'b', false)).toEqual(['b'])
    expect(projectFolderOrder(['D:\\proj\\a', 'D:\\proj\\b'], 'D:/proj/b', false)).toEqual([
      'D:\\proj\\a',
      'D:\\proj\\b',
    ])
  })

  it('dedupes and ignores falsy entries', () => {
    expect(projectFolderOrder(['a', 'a', 'b'], 'a', false)).toEqual(['a', 'b'])
    expect(projectFolderOrder(['a', 'b'], null, false)).toEqual(['a', 'b'])
    expect(projectFolderOrder(['', 'a'], null, true)).toEqual(['a'])
  })
})
