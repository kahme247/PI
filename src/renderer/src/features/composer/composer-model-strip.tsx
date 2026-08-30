import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@renderer/lib/utils'
import { formatModelChip, formatThinkingChip } from '@renderer/lib/format-run-display'

/** Bottom-right of input: model / thinking */
function ComposerModelStripImpl({
  model,
  thinkingLevel,
  modelPickerOpen,
  thinkingPickerOpen,
  onModelClick,
  onThinkingClick,
}: {
  model?: string
  thinkingLevel?: string
  modelPickerOpen?: boolean
  thinkingPickerOpen?: boolean
  onModelClick: () => void
  onThinkingClick: () => void
}) {
  const { t } = useTranslation()
  const modelLabel = formatModelChip(model)
  const thinkLabel = formatThinkingChip(thinkingLevel)

  const btn = cn(
    'max-w-[min(160px,38vw)] truncate rounded-md border border-border/40 bg-[var(--bg-1)]/60 px-1.5 py-0.5 text-[11px] font-medium tabular-nums shadow-xs',
    'text-foreground-secondary hover:text-foreground hover:bg-[var(--bg-hover)] hover:border-border/70 transition-all duration-motion-fast ease-motion-ease',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/35 active:scale-[0.96]',
  )

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onModelClick}
        title={modelLabel === t('composer:selectModel') ? t('composer:selectModelHint') : t('composer:modelLabel', { name: model ?? modelLabel })}
        className={cn(btn, modelPickerOpen && 'border-primary/50 text-foreground bg-primary/[0.08]')}
      >
        {modelLabel}
      </button>
      <button
        type="button"
        onClick={onThinkingClick}
        title={t('composer:thinkingLevel', { level: thinkLabel })}
        className={cn(btn, 'max-w-[92px]', thinkingPickerOpen && 'border-primary/50 text-foreground bg-primary/[0.08]')}
      >
        {thinkLabel}
      </button>
    </div>
  )
}

export const ComposerModelStrip = memo(ComposerModelStripImpl)