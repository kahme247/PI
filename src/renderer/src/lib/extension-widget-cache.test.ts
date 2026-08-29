import { describe, expect, it } from 'vitest'
import type { ExtensionWidgetEvent } from '@shared/app-events'
import type { TimelineItem } from '@renderer/stores/ui-store-types'
import {
  applyExtensionWidgetEvent,
  clearSessionWidgets,
  extractWidgetFromTimeline,
  getSessionComposerWidget,
} from './extension-widget-cache'

function event(partial: Partial<ExtensionWidgetEvent>): ExtensionWidgetEvent {
  return {
    type: 'extension_widget',
    phase: 'set',
    widgetKey: 'pi-deck-todo',
    adapterId: 'pi-deck-todo',
    protocol: 'todo-list-v1',
    seq: 1,
    workspaceId: '/w',
    sessionFile: '/a.jsonl',
    timestamp: 1,
    state: {
      adapterId: 'pi-deck-todo',
      widgetKey: 'pi-deck-todo',
      protocol: 'todo-list-v1',
      title: 'Todo',
      payload: { items: [{ id: '1', text: 'New', status: 'pending' }] },
      updatedAt: 1,
    },
    ...partial,
  }
}

describe('extension widget cache', () => {
  it('rejects stale seq and isolates sessions', () => {
    clearSessionWidgets('/a.jsonl')
    clearSessionWidgets('/b.jsonl')
    applyExtensionWidgetEvent(event({ seq: 2 }))
    applyExtensionWidgetEvent(
      event({
        seq: 1,
        state: {
          adapterId: 'pi-deck-todo',
          widgetKey: 'pi-deck-todo',
          protocol: 'todo-list-v1',
          title: 'Todo',
          payload: { items: [{ id: 'old', text: 'Old', status: 'completed' }] },
          updatedAt: 1,
        },
      }),
    )
    expect(getSessionComposerWidget('/a.jsonl')?.payload.items[0]?.text).toBe('New')

    applyExtensionWidgetEvent(event({ sessionFile: '/b.jsonl', seq: 3 }))
    expect(getSessionComposerWidget('/a.jsonl')?.payload.items[0]?.text).toBe('New')
    expect(getSessionComposerWidget('/b.jsonl')?.payload.items[0]?.text).toBe('New')
  })

  it('reconstructs widget projection from timeline tool calls', () => {
    clearSessionWidgets('/c.jsonl')
    const items: TimelineItem[] = [
      {
        id: '1',
        type: 'user-message',
        text: 'Fix the bug',
        timestamp: 100,
      },
      {
        id: '2',
        type: 'tool-call',
        toolName: 'todo',
        toolArgs: {
          todos: [
            { id: 't1', text: 'Analyze bug', done: true },
            { id: 't2', text: 'Write fix', done: false },
          ],
        },
        timestamp: 101,
      },
    ]

    const widget = extractWidgetFromTimeline(items)
    expect(widget?.protocol).toBe('todo-list-v1')
    expect(widget?.payload.items).toHaveLength(2)
    expect(widget?.payload.items[0]?.status).toBe('completed')
    expect(widget?.payload.items[1]?.status).toBe('pending')

    expect(getSessionComposerWidget('/c.jsonl', items)?.payload.items).toHaveLength(2)
    expect(getSessionComposerWidget('/c.jsonl')?.payload.items).toHaveLength(2)
  })
})
