import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowUp, CornerDownLeft, File, Folder } from '@renderer/components/icons'
import type { WorkspaceFsSearchEntry } from '@shared/ipc-contract'
import { OverlayScrollHost } from '@renderer/components/ui/overlay-scrollbar'
import { cn } from '@renderer/lib/utils'

interface ComposerFilePopoverProps {
  show: boolean
  loading: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  entries: WorkspaceFsSearchEntry[]
  selectedIdx: number
  setSelectedIdx: (fn: (index: number) => number) => void
  onAccept: (entry: WorkspaceFsSearchEntry) => void
}

export function ComposerFilePopover({
  show,
  loading,
  anchorRef,
  entries,
  selectedIdx,
  setSelectedIdx,
  onAccept,
}: ComposerFilePopoverProps) {
  const { t } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{
    left: number
    width: number
    bottom: number
    listMaxPx: number
  } | null>(null)

  useEffect(() => {
    if (!show) {
      setLayout(null)
      return
    }
    const sync = () => {
      const el = anchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const insetX = 16
      const gap = 8
      const footerPx = 36
      setLayout({
        left: rect.left + insetX,
        width: Math.max(200, rect.width - insetX * 2),
        bottom: Math.max(8, window.innerHeight - rect.top + gap),
        listMaxPx: Math.max(120, Math.min(320, rect.top - gap - footerPx - 16)),
      })
    }
    sync()
    const observer = new ResizeObserver(sync)
    const anchor = anchorRef.current
    if (anchor) observer.observe(anchor)
    window.addEventListener('resize', sync)
    window.addEventListener('scroll', sync, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sync)
      window.removeEventListener('scroll', sync, true)
    }
  }, [anchorRef, show])

  useEffect(() => {
    if (!show) return
    const row = scrollRef.current?.querySelector(
      `[data-file-search-idx="${selectedIdx}"]`,
    ) as HTMLElement | null
    row?.scrollIntoView({ block: 'nearest' })
  }, [entries.length, selectedIdx, show])

  if (!show || !layout) return null

  return createPortal(
    <div
      data-file-popover
      className="popover-motion flex flex-col overflow-hidden rounded-xl border border-border/70 bg-popover/95 backdrop-blur-md shadow-xl"
      style={{
        position: 'fixed',
        left: layout.left,
        width: layout.width,
        bottom: layout.bottom,
        zIndex: 10000,
        maxHeight: layout.listMaxPx + 40,
      }}
    >
      <div className="relative min-h-0 shrink-0" style={{ height: layout.listMaxPx }}>
        <OverlayScrollHost
          className="h-full"
          showRailOnHostHover
          scrollRef={scrollRef}
          scrollClassName="composer-file-popover-pane py-1 overscroll-contain"
        >
          {loading && entries.length === 0 ? (
            <div className="px-3 py-3 text-[11px] text-foreground-secondary">
              {t('composer:fileSearchLoading')}
            </div>
          ) : entries.length === 0 ? (
            <div className="px-3 py-3 text-[11px] text-foreground-secondary">
              {t('composer:fileSearchEmpty')}
            </div>
          ) : (
            entries.map((entry, index) => {
              const Icon = entry.isDirectory ? Folder : File
              return (
                <button
                  key={`${entry.isDirectory ? 'dir' : 'file'}:${entry.path}`}
                  type="button"
                  data-file-search-idx={index}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setSelectedIdx(() => index)}
                  onClick={() => onAccept(entry)}
                  className={cn(
                    'picker-row flex min-h-[40px] w-full items-center gap-2 px-3 py-1.5 text-left',
                    index === selectedIdx && 'bg-[var(--bg-active)]',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-foreground-secondary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium text-foreground">
                      {entry.name}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-foreground-secondary">
                      {entry.path}
                    </span>
                  </span>
                </button>
              )
            })
          )}
        </OverlayScrollHost>
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-border/40 px-3 py-1.5 text-[10px] text-foreground-secondary">
        <span className="flex items-center gap-1">
          <ArrowUp className="h-2.5 w-2.5" />
          <ArrowDown className="h-2.5 w-2.5" /> {t('composer:select')}
        </span>
        <span className="flex items-center gap-1">
          <CornerDownLeft className="h-2.5 w-2.5" /> {t('composer:fileSearchConfirm')}
        </span>
        <span>{t('composer:tabComplete')}</span>
        <span>{t('composer:escClose')}</span>
      </div>
    </div>,
    document.body,
  )
}
