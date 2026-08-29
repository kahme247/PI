import type { AdapterWidgetProjection } from '@shared/adapter-widget'
import type { ExtensionWidgetEvent } from '@shared/app-events'
import { normalizeSessionFileKey } from '@renderer/lib/session-file-key'
import type { TimelineItem } from '@renderer/stores/ui-store-types'
import { extractTodoItems } from '@shared/todo-list'

type Cached = { seq: number; state: AdapterWidgetProjection | null }

const cache = new Map<string, Map<string, Cached>>()

function sessionKey(file: string | null | undefined): string {
  return normalizeSessionFileKey(file)
}

const KNOWN_TODO_TOOLS: Record<string, { adapterId: string; widgetKey: string; title: string; icon: string }> = {
  todo: { adapterId: 'pi-deck-todo', widgetKey: 'pi-deck-todo', title: 'Todo', icon: 'ListTodo' },
  todowrite: { adapterId: 'magic-context-todo', widgetKey: 'magic-context-todos', title: 'Todo', icon: 'ListTodo' },
  'rpiv-todos': { adapterId: '@juicesharp/rpiv-todo', widgetKey: 'rpiv-todos', title: 'Todos', icon: 'ListTodo' },
}

export function extractWidgetFromTimeline(items: TimelineItem[]): AdapterWidgetProjection | null {
  if (!Array.isArray(items) || items.length === 0) return null
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    if (item.type === 'tool-call' && item.toolName) {
      const toolName = item.toolName.toLowerCase()
      const meta =
        KNOWN_TODO_TOOLS[toolName] ??
        (toolName.includes('todo')
          ? {
              adapterId: 'pi-deck-todo',
              widgetKey: 'pi-deck-todo',
              title: 'Todo',
              icon: 'ListTodo',
            }
          : null)
      if (meta) {
        const payload = item.toolDetails ?? item.toolDetail ?? item.toolArgs ?? item.toolOutput
        const todoItems = extractTodoItems(payload)
        if (todoItems == null) continue
        if (todoItems.length === 0) return null
        return {
          adapterId: meta.adapterId,
          widgetKey: meta.widgetKey,
          protocol: 'todo-list-v1',
          title: meta.title,
          icon: meta.icon,
          payload: { items: todoItems },
          updatedAt: item.timestamp || Date.now(),
        }
      }
    }
  }
  return null
}

export function syncSessionComposerWidgetFromTimeline(
  sessionFile: string | null | undefined,
  items: TimelineItem[],
): AdapterWidgetProjection | null {
  const file = sessionKey(sessionFile)
  if (!file) return null
  const byKey = cache.get(file)
  if (byKey) {
    for (const item of byKey.values()) {
      if (item.state) return item.state
    }
  }
  const extracted = extractWidgetFromTimeline(items)
  if (extracted) {
    const map = byKey ?? new Map<string, Cached>()
    map.set(extracted.widgetKey, { seq: 0, state: extracted })
    cache.set(file, map)
    return extracted
  }
  return null
}

export function applyExtensionWidgetEvent(event: ExtensionWidgetEvent): AdapterWidgetProjection | null | undefined {
  const file = sessionKey(event.sessionFile)
  if (!file || !event.widgetKey) return undefined
  const byKey = cache.get(file) ?? new Map<string, Cached>()
  const prev = byKey.get(event.widgetKey)
  if (prev && event.seq < prev.seq) return prev.state
  const next = event.phase === 'clear' ? null : event.state ?? null
  byKey.set(event.widgetKey, { seq: event.seq, state: next })
  cache.set(file, byKey)
  return next
}

export function getSessionComposerWidget(
  sessionFile: string | null | undefined,
  timelineItems?: TimelineItem[],
): AdapterWidgetProjection | null {
  const file = sessionKey(sessionFile)
  if (!file) return null
  const byKey = cache.get(file)
  if (byKey) {
    for (const item of byKey.values()) {
      if (item.state) return item.state
    }
  }
  if (timelineItems && timelineItems.length > 0) {
    return syncSessionComposerWidgetFromTimeline(file, timelineItems)
  }
  return null
}

export function clearSessionWidgets(sessionFile: string | null | undefined): void {
  const file = sessionKey(sessionFile)
  if (file) cache.delete(file)
}
