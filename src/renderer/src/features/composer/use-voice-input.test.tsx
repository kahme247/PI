import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVoiceInput } from './use-voice-input'

const mocks = vi.hoisted(() => ({
  invoke: vi.fn<(method: string, request?: unknown) => Promise<unknown>>(async () => ({})),
  toastError: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => mocks.toastError(...args) },
}))

vi.mock('@renderer/lib/ipc-client', () => ({
  ipcClient: { invoke: (method: string, request?: unknown) => mocks.invoke(method, request) },
}))

vi.mock('@renderer/lib/asr-config-effective', () => ({
  getAsrConfigForComposer: () => ({ provider: 'codex-asr-builtin' }),
  isAsrVoiceReady: () => true,
}))

const transcribeResolvers: Array<(value: unknown) => void> = []

function installMediaMocks(): void {
  vi.stubGlobal('MediaRecorder', class {
    static isTypeSupported = () => true
    state = 'inactive'
    ondataavailable: ((e: { data: { size: number } }) => void) | null = null
    onstop: (() => void) | null = null
    constructor() {}
    start() {
      this.state = 'recording'
      this.ondataavailable?.({ data: { size: 1 } })
    }
    stop() {
      this.state = 'inactive'
      this.onstop?.()
    }
  })
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [] })) },
  })
}

beforeEach(() => {
  transcribeResolvers.length = 0
  mocks.invoke.mockReset()
  mocks.toastError.mockReset()
  installMediaMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('useVoiceInput transcribe timeout', () => {
  it('recovers to error when the transcribe IPC never resolves', async () => {
    vi.useFakeTimers()
    mocks.invoke.mockImplementation(async (method) => {
      if (method === 'settings.get') return { settings: {} }
      if (method === 'asr.probeCodexAuth') return { ok: true }
      if (method === 'asr.transcribe') {
        return new Promise<unknown>((resolve) => transcribeResolvers.push(resolve))
      }
      return {}
    })

    const { result } = renderHook(() => useVoiceInput(true, () => {}))
    await act(async () => {
      result.current.toggle()
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(result.current.voiceState).toBe('recording')

    await act(async () => {
      result.current.toggle()
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(result.current.voiceState).toBe('transcribing')

    // The transcribe IPC never resolves; the timeout must still recover the composer.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(16_000)
    })
    expect(result.current.voiceState).toBe('error')
    expect(mocks.toastError).toHaveBeenCalledWith('composer:voice.errorTimeout')
  })

  it('keeps idle when the transcribe IPC resolves in time', async () => {
    vi.useFakeTimers()
    mocks.invoke.mockImplementation(async (method) => {
      if (method === 'settings.get') return { settings: {} }
      if (method === 'asr.probeCodexAuth') return { ok: true }
      if (method === 'asr.transcribe') {
        return new Promise<unknown>((resolve) => transcribeResolvers.push(resolve))
      }
      return {}
    })

    const { result } = renderHook(() => useVoiceInput(true, () => {}))
    await act(async () => {
      result.current.toggle()
      await vi.advanceTimersByTimeAsync(0)
    })
    await act(async () => {
      result.current.toggle()
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(result.current.voiceState).toBe('transcribing')

    await act(async () => {
      // Let FileReader finish so the transcribe invoke is actually created.
      await vi.advanceTimersByTimeAsync(100)
      await Promise.resolve()
    })
    await act(async () => {
      transcribeResolvers[0]?.({ ok: true, text: 'hello' })
      await vi.advanceTimersByTimeAsync(0)
      await Promise.resolve()
    })
    expect(result.current.voiceState).toBe('idle')
  })
})
