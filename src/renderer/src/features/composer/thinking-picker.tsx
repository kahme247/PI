// Thinking level picker: shows all levels with descriptions, /thinking opens this.

import { useEffect } from 'react'
import { ipcClient } from '@renderer/lib/ipc-client'
import { useUIStore } from '@renderer/stores/ui-store'
import { cn } from '@renderer/lib/utils'
import { X, Brain, Check } from '@renderer/components/icons'
import { toast } from 'sonner'
import { normalizeThinkingLevel } from '@renderer/lib/format-run-display'
import { useTranslation } from 'react-i18next'

const LEVELS: { key: string; label: string; desc: string }[] = [
  { key: 'off', label: 'Off', desc: 'No thinking, answer directly' },
  { key: 'minimal', label: 'Minimal', desc: 'Minimal thinking' },
  { key: 'low', label: 'Low', desc: 'Light thinking' },
  { key: 'medium', label: 'Medium', desc: 'Moderate thinking (default)' },
  { key: 'high', label: 'High', desc: 'Deep thinking' },
  { key: 'xhigh', label: 'XHigh', desc: 'Extreme thinking (slow / more tokens)' },
]

export function ThinkingPicker() {
  const { t } = useTranslation()
  const open = useUIStore((s) => s.thinkingPickerOpen)
  const setOpen = useUIStore((s) => s.setThinkingPickerOpen)
  const current = normalizeThinkingLevel(useUIStore((s) => s.runState.thinkingLevel)) ?? 'medium'
  const sessionFile = useUIStore((s) => s.historySessionFile)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [open, setOpen])

  if (!open) return null

  const pick = async (level: string) => {
    const previous = useUIStore.getState().runState.thinkingLevel
    useUIStore.getState().setRunState({ thinkingLevel: level })
    setOpen(false)
    try {
      await ipcClient.invoke('thinkingLevel.set', {
        sessionId: '',
        sessionFile: sessionFile ?? undefined,
        level,
      })
      toast.success(t('composer:thinkingLevelSet', { defaultValue: `Thinking: ${level}` }))
    } catch (e) {
      const isWorkerNotStarted =
        e instanceof Error && e.message.toLowerCase().includes('worker not started')
      if (isWorkerNotStarted) {
        return
      }
      console.error('thinkingLevel.set failed:', e)
      useUIStore.getState().setRunState({ thinkingLevel: previous })
      toast.error(t('composer:switchFailed', { defaultValue: 'Switch failed' }))
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="thinking-picker-title"
      className="picker-backdrop backdrop-motion fixed inset-0 z-[110] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 pb-28 sm:items-start sm:pt-20"
      onClick={() => setOpen(false)}
    >
      <div
        className="picker-panel w-full max-w-md overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl"
        style={{ boxShadow: '0 16px 48px color-mix(in srgb, var(--foreground) 12%, transparent)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary/80" />
            <div id="thinking-picker-title" className="text-[13px] font-semibold text-foreground">{t('composer:thinkingTitle', { defaultValue: 'Thinking level' })}</div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="row-hover rounded-lg p-1.5 text-foreground-secondary hover:text-foreground transition-all duration-motion-fast">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-1">
          {LEVELS.map((lv) => {
            const active = current === lv.key
            return (
              <button
                key={lv.key}
                onClick={() => pick(lv.key)}
                className={cn(
                  'picker-row flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-motion-fast ease-motion-ease',
                  active ? 'bg-[var(--bg-active)] font-medium text-foreground' : 'text-foreground-secondary hover:text-foreground hover:bg-[var(--bg-hover)]',
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] uppercase font-semibold">{lv.label}</span>
                  </div>
                  <div className="text-[11px] text-foreground-secondary/75">{lv.desc}</div>
                </div>
                {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}