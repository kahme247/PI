import { useTranslation } from 'react-i18next'
import { formatTokens } from '@renderer/lib/format-tokens'
import type { useComposerMetrics } from './use-composer-metrics'

type Metrics = ReturnType<typeof useComposerMetrics>

/** Inline toolbar: context usage, TPS */
export function ComposerMetricsInline({ metrics, isRunning }: { metrics: Metrics; isRunning?: boolean }) {
  const { t } = useTranslation()
  const showCtx = metrics.contextWindow != null || metrics.estContextTokens != null

  const tokPerSec =
    metrics.tps != null && metrics.tps > 0
      ? `${Math.round(metrics.tps / 4)} tok/s`
      : isRunning
        ? '…'
        : null

  if (!showCtx && !tokPerSec) return null

  const ctxPct = metrics.ctxPct ?? 0
  const ctxColorCls =
    ctxPct > 80
      ? 'text-red-500 font-semibold'
      : ctxPct > 50
        ? 'text-amber-500'
        : 'text-foreground-secondary/70'

  return (
    <div className="composer-metrics-inline flex min-w-0 shrink items-center gap-2 text-[11px] tabular-nums leading-none text-foreground-secondary/60">
      {showCtx && (
        <span className="truncate" title={t('composer:contextHint')}>
          <span className="opacity-75">{t('composer:contextLabel')}</span>{' '}
          <span className={ctxColorCls}>
            {formatTokens(metrics.estContextTokens ?? 0)}
            {metrics.contextWindow != null && <span className="text-foreground-secondary/40 font-normal"> / {formatTokens(metrics.contextWindow)}</span>}
            {metrics.ctxPct != null && <span> ({metrics.ctxPct.toFixed(1)}%)</span>}
          </span>
        </span>
      )}
      {tokPerSec && (
        <span className="shrink-0 rounded-sm bg-[var(--bg-2)]/60 px-1 py-0.5 text-[10px] font-medium text-foreground-secondary/75" title={t('composer:tpsHint')}>
          {tokPerSec}
        </span>
      )}
    </div>
  )
}