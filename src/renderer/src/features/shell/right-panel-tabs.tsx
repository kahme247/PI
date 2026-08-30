import { cn } from '@renderer/lib/utils'

export function RightPanelTabs({
  panels,
  activePanel,
  setActivePanel,
}: {
  panels: { key: string; label: string }[]
  activePanel: string
  setActivePanel: (p: string) => void
}) {
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = (index + 1) % panels.length
      setActivePanel(panels[nextIndex].key)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex = (index - 1 + panels.length) % panels.length
      setActivePanel(panels[prevIndex].key)
    }
  }

  return (
    <div className="right-panel-tabs-wrap flex h-10 shrink-0 items-center border-b border-border/40 px-2.5 bg-[var(--surface-sidebar)]/60 backdrop-blur-sm">
      <div className="right-panel-tabs-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto no-scrollbar" role="tablist">
        {panels.map((panel, idx) => {
          const active = activePanel === panel.key
          return (
            <button
              key={panel.key}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, idx)}
              onClick={() => setActivePanel(panel.key)}
              className={cn(
                'relative h-7 min-w-10 shrink-0 rounded-md px-2.5 text-[12px] font-medium whitespace-nowrap transition-all duration-motion-fast ease-motion-ease select-none',
                active
                  ? 'bg-background text-foreground shadow-xs border border-border/50 font-semibold'
                  : 'text-foreground-secondary hover:bg-[var(--bg-hover)] hover:text-foreground',
              )}
            >
              {panel.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
