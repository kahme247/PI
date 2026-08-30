import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PanelRight, RefreshCw } from '@renderer/components/icons'
import { cn } from '@renderer/lib/utils'
import { useUIStore } from '@renderer/stores/ui-store'
import { useRightPanelHidden } from '@renderer/lib/use-right-panel-hidden'
import { reloadCurrentSessionData } from '@renderer/lib/reload-current-session-data'
import { toast } from 'sonner'

/**
 * 浮在对话区右上角。
 * Cursor UI 实验：右栏收起时由窄轨承担展开入口，此处只保留「刷新」；展开时仍显示收起按钮。
 */
export function MainColRightPanelToggle() {
  const { t } = useTranslation()
  const collapsed = useRightPanelHidden()
  const toggle = useUIStore((s) => s.toggleRightPanel)
  const [reloading, setReloading] = useState(false)

  const onReload = async () => {
    if (reloading) return
    setReloading(true)
    try {
      const r = await reloadCurrentSessionData()
      if (r.ok) toast.success(t('common:sessionReload.success'))
      else toast.error(r.error || t('common:sessionReload.failed'))
    } finally {
      setReloading(false)
    }
  }

  const btnBase =
    'electron-no-drag chrome-icon-btn flex h-7 w-7 items-center justify-center rounded-lg border border-border/50 shadow-xs text-foreground-secondary hover:text-foreground backdrop-blur-md transition-all duration-motion-fast ease-motion-ease active:scale-[0.93] disabled:opacity-50'

  return (
    <div
      className="absolute right-3 top-2.5 z-20 flex items-center gap-1.5 p-0.5 rounded-lg border border-border/30 bg-background/80 backdrop-blur-md shadow-xs"
    >
      <button
        type="button"
        onClick={() => void onReload()}
        disabled={reloading}
        title={t('common:sessionReload.title')}
        className={cn(btnBase, 'hover:bg-[var(--bg-hover)] border-0 shadow-none')}
      >
        <RefreshCw className={cn('h-3.5 w-3.5', reloading && 'animate-spin')} />
      </button>
      {!collapsed && (
        <button
          type="button"
          onClick={toggle}
          title={t('common:topbar.collapseRightPanel')}
          className={cn(btnBase, 'hover:bg-[var(--bg-hover)] border-0 shadow-none')}
        >
          <PanelRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
