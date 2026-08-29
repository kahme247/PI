import { useEffect, useState } from 'react'
import { ipcClient } from '@renderer/lib/ipc-client'
import { useUIStore } from '@renderer/stores/ui-store'

export function McpDiagnostics() {
  const workspace = useUIStore((s) => s.currentWorkspace)
  const [exts, setExts] = useState<Array<{ id?: string; packageName?: string; name?: string; compatibility?: string }>>([])

  useEffect(() => {
    if (!workspace) return
    ipcClient.invoke('extensions.list', { workspaceId: workspace }).then((r) => {
      const list = r?.extensions || []
      setExts((list as Array<{ id?: string; packageName?: string; name?: string; compatibility?: string }>).filter((e) => (e.packageName || e.name || '').includes('mcp')))
    })
  }, [workspace])

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border/60 bg-muted/15 p-4 text-[12px]">
      <div className="font-medium text-foreground/90">MCP adapter diagnostics (read-only)</div>
      <ul className="list-disc space-y-1 pl-4 text-muted-foreground/80">
        <li>MCP connections and server lists are managed by pi-mcp-adapter inside the pi runtime; the desktop does not write config.</li>
        <li>After connecting via pi's MCP slash commands/settings in the terminal, the tools appear in the Agent tool list.</li>
        <li>Environment variables and MCP config under ~/.pi/agent follow the extension docs.</li>
      </ul>
      {exts.length > 0 && (
        <div>
          <div className="text-[10px] uppercase text-muted-foreground/50">Detected packages</div>
          {exts.map((e) => (
            <div key={e.id} className="font-mono text-[11px]">
              {e.packageName || e.name} — {e.compatibility}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}