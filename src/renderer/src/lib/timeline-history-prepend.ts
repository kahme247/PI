import type { TimelineItem } from '@renderer/stores/ui-store-types'
import { projectTimelineItems } from '@shared/timeline-projection'
import { sanitizeHistoryTimeline } from '@renderer/lib/timeline-dedupe'
import { fetchTimelineHistoryPage } from '@renderer/lib/session-timeline-sync'
import { getSessionTimelineView, patchSessionTimelineView } from '@renderer/lib/session-timeline-views'
import { useUIStore } from '@renderer/stores/ui-store'
import { SESSION_HISTORY_PAGE } from '@renderer/lib/session-history'

/** Older JSONL page → SessionTimelineView.head + ui-store (offset = historyLoadedCount). */
export async function prependOlderTimelinePage(
  sessionFile: string,
  offset: number,
  limit = SESSION_HISTORY_PAGE,
): Promise<{ items: TimelineItem[]; sourceCount: number; totalCount: number; error?: string }> {
  const page = await fetchTimelineHistoryPage(sessionFile, offset, limit)
  if (page.error) {
    return {
      items: [],
      sourceCount: 0,
      totalCount: page.totalCount,
      error: page.error,
    }
  }

  const store = useUIStore.getState()
  // 用户可能在抓取期间切换会话：旧会话的整页数据不得污染当前时间线。
  if (store.historySessionFile && store.historySessionFile !== sessionFile) {
    return {
      items: [],
      sourceCount: 0,
      totalCount: page.totalCount,
    }
  }
  if (page.items.length > 0) {
    const view = getSessionTimelineView(sessionFile)
    const previousHead = view?.head ?? []
    patchSessionTimelineView(sessionFile, { head: [...page.items, ...previousHead] })

    const merged = sanitizeHistoryTimeline([...page.items, ...store.timelineItems])
    const displayed = projectTimelineItems(merged) as TimelineItem[]
    useUIStore.setState({ timelineItems: displayed })
  }

  useUIStore.setState({
    historyLoadedCount: Math.min(
      Math.max(store.historyTotalCount, page.totalCount),
      store.historyLoadedCount + page.sourceCount,
    ),
    historyTotalCount: Math.max(store.historyTotalCount, page.totalCount),
  })

  return {
    items: page.items,
    sourceCount: page.sourceCount,
    totalCount: page.totalCount,
  }
}