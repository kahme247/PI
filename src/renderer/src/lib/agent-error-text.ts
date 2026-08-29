/** 将 SDK / 上游返回的原始错误整理为时间线可读文案 */

export function formatAgentErrorForTimeline(raw: string): string {
  const trimmed = (raw || '').trim()
  if (!trimmed) return 'Unknown error'

  if (/^Request was aborted\.?$/i.test(trimmed)) {
    return 'Request aborted'
  }

  const jsonStart = trimmed.indexOf('{')
  if (jsonStart >= 0) {
    const maybeJson = trimmed.slice(jsonStart)
    try {
      const parsed = JSON.parse(maybeJson) as {
        error?: { message?: string; type?: string }
        message?: string
        type?: string
      }
      const inner =
        parsed?.error?.message ||
        parsed?.message ||
        (typeof parsed?.error === 'string' ? parsed.error : '')
      if (inner && String(inner).trim()) {
        const prefix = trimmed.slice(0, jsonStart).replace(/\s*Error:\s*\d+\s*$/i, '').trim()
        const type = parsed?.error?.type || parsed?.type
        const head = prefix || (type ? String(type) : 'Error')
        return `${head}\n${String(inner).trim()}`
      }
    } catch (e) {
      /* keep raw */
    }
  }

  if (/Aborted after \d+ retry attempt/i.test(trimmed)) {
    return trimmed.replace(
      /Aborted after (\d+) retry attempt/i,
      'Failed after $1 retries',
    )
  }

  if (/empty_stream|upstream stream closed/i.test(trimmed)) {
    return `Upstream model stream ended unexpectedly (empty_stream)\n${trimmed}`
  }

  return trimmed
}

export function agentErrorKind(
  raw: string,
): 'error' | 'aborted' | 'retry' {
  const t = (raw || '').toLowerCase()
  if (/aborted|request was aborted/.test(t)) return 'aborted'
  if (/retry attempt|auto.?retry/.test(t)) return 'retry'
  return 'error'
}