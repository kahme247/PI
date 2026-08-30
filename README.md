<div align="center">

<img src="resources/icon.svg" alt="pi Desktop logo" width="80" height="80" />

# pi Desktop

The desktop app for the [pi](https://github.com/jvm/pi-mono) coding agent — same agent you run in the terminal, now with a timeline, side panels, and a real window.

[![Version](https://img.shields.io/badge/version-0.0.1-blue?style=flat-square)](https://github.com/kahme247/PI/releases/tag/v0.0.1)
[![Release](https://img.shields.io/github/v/release/kahme247/PI?label=release&style=flat-square&logo=github)](https://github.com/kahme247/PI/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/kahme247/PI/Release?label=release&logo=github&style=flat-square)](https://github.com/kahme247/PI/actions)
[![Quality](https://img.shields.io/github/actions/workflow/status/kahme247/PI/Quality?label=quality&style=flat-square)](https://github.com/kahme247/PI/actions)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Changelog](https://img.shields.io/badge/changelog-0.0.1-informational?style=flat-square)](CHANGELOG.md)

[简体中文](./README.zh-CN.md) · [Getting started](./doc/guide/getting-started.md) · [Adapters](./doc/guide/adapters.en.md) · [Changelog](./CHANGELOG.md) · [Release guide](./doc/RELEASE.md)

</div>

> [!NOTE]
> pi Desktop is **not** a separate AI — it's a desktop shell around the pi SDK you already use. Your conversations, model logins, and extension settings live in the same `~/.pi/agent` files. Open a project and keep chatting from where you left off in the terminal.

![pi Desktop v0.0.1 overview](doc/images/overview.png)

*Main window — v0.0.1, English default, streaming timeline + session tree + file preview (1440×900, captured 2026-08-30)*

## Why

If you use pi in the terminal, you've probably wished for: a real diff view instead of scrolling raw output, the ability to queue a follow-up while the agent is still running, and a session tree you can click through instead of typing `/tree`. pi Desktop gives you all of that, plus native windows for extension pop-ups — **without forking pi or touching your installed extensions**.

## Features

- **Streaming timeline** — markdown, code blocks, KaTeX math, and foldable tool steps (read, edit, bash) with line-level diffs
- **Session tree** — branch and rewind like `pi /tree`, but clickable; with git, optionally restore files on jump
- **Composer** — inline file attachments, image paste, model & thinking-level pills, slash command menu; **Files** panel tree supports **drag files into composer** or right-click attach
- **Workspace file preview** — multi-tab (`Ctrl`/`⌘`+click or right-click **Open in new tab**), line-gutter source view, **expand preview** into the chat column for wide reading
- **Queue messages** — keep typing while the agent runs; messages execute when the current turn ends
- **Full pi package ecosystem** — every extension you installed for terminal pi works here: dialogs, tool cards, side panels, and `/commands` are translated to native UI by per-extension **adapters**, with **no changes to the npm packages** (see [Extensions](#extensions))
- **English by default, bilingual when you need it** — ships in English; switch to 中文 in **Settings → General** at any time
- **Voice input** — optional mic → local transcription via [codex-asr](https://github.com/Wangnov/codex-asr) (bundled binary, ChatGPT/Codex token auth)
- **Shared everything** — sessions, auth, `settings.json`, extensions: all in `~/.pi/agent`, shared with CLI pi
- **Cross-platform installers** — Windows (NSIS Setup + Portable), macOS (dmg + zip, x64 & arm64), Linux (AppImage + deb) built by the [`Release` workflow](.github/workflows/release.yml) with SBOM, checksums, and provenance attestations

## Get the app

**Releases:** [kahme247/PI Releases](https://github.com/kahme247/PI/releases/latest) — download the installer for your platform (or grab `SHA256SUMS.txt` + `sbom.cdx.json` for verification).

> [!TIP]
> You need pi set up once on the machine (model login, the way you already use for terminal pi). After that, just open a project folder in pi Desktop and you're in.

**Build from source** (developers):

```bash
git clone https://github.com/kahme247/PI.git
cd PI
npm install
npm run dev
```

> Upstream is [justhil/pi-app](https://github.com/justhil/pi-app) — this fork is maintained at `kahme247/PI` with its own versioning starting at `v0.0.1`.

## First steps

1. **Open a folder** — your repo becomes the agent's working directory (or use a sandbox under "chat partitions" to experiment safely).
2. **Pick a session** — old chats from terminal pi show up here; or start fresh with `+`.
3. **Send a message** — `Enter` to send, `Shift+Enter` for a new line.
4. **Check the right panel** — review, run, context, session tree, or **Files** (tabbed preview + explorer; expand preview across the chat column).
5. **Jump back** — hover a message and undo, or double-tap `Esc` with an empty input to open the session tree.

## Shortcuts

| Action | Keys |
|--------|------|
| Send | `Enter` |
| New line | `Shift+Enter` |
| Browse sent messages | `↑` / `↓` (empty input) |
| Pull back queued message | `Alt+↑` |
| Stop generation | `Esc` |
| Session tree | `Esc` `Esc` (empty input) |
| Commands | `/` |
| Attach file | Drag, `+`, or `Ctrl+V`; **Files** panel — drag files onto composer (files only) |
| Multi-tab preview | **Files** → `Ctrl`/`⌘`+click a file, or right-click **Open in new tab** |
| Wide preview | **Files** toolbar **Expand preview** (fills chat column; click again to collapse) |

## Extensions

pi has a growing ecosystem of npm packages — subagents, image generation, search, hash-anchored edits, MCP servers, and more. pi Desktop makes all of them work on the desktop **without forking pi or patching the packages**.

### How it works

Each extension ships a terminal TUI (select, confirm, surveys, tool cards, `/commands`). pi Desktop ships a **compatibility layer** plus per-extension **adapters** — small JSON descriptions that map that TUI onto native windows, timeline cards, and settings forms. You install and enable extensions exactly as you do for terminal pi; pi Desktop renders them.

### Install & enable

1. Install in terminal pi: `pi install npm:<name>` or `pi install git:github.com/...`
2. Enable in `~/.pi/agent/settings.json` → `packages`
3. Open **Settings → Extensions** in pi Desktop to confirm tools are loaded for the current session
4. If something's missing, **start a fresh session** after enabling the package

Extension pop-ups (questions, image approval, confirm dialogs) appear as native windows. Per-extension desktop options live under **Settings → Desktop adapters**. Advanced users can override builtin adapters with JSON in `~/.pi/desktop/adapters/`.

Full list of 34 built-in desktop adapters: [doc/guide/adapters.en.md](./doc/guide/adapters.en.md) · Author your own: [doc/adapter-authoring-guide.md](./doc/adapter-authoring-guide.md)

## Voice input

The composer mic records audio and transcribes it locally using [codex-asr](https://github.com/Wangnov/codex-asr). It's optional — typing always works without it.

### Setup

Open **Settings → Voice**:

- **Provider** — defaults to the **bundled `codex-asr serve`** binary (shipped in `resources/codex-asr/`); falls back to `codex-asr` on your `PATH`, or an external serve URL.
- **Auth** — paste a ChatGPT/Codex `access_token`, or click **import from `~/.codex/auth.json`** (written by the [Codex CLI](https://github.com/openai/codex) or ChatGPT desktop after sign-in). Tokens are JWTs and expire — refresh by signing in again.
- **Connectivity test** — a one-click check reports whether the serve process started and the token is valid.

> [!TIP]
> Easiest path: install the Codex CLI, run `codex login`, then in pi Desktop use **import from auth.json**. No manual token pasting needed.

Bundled binaries come from [codex-asr releases](https://github.com/Wangnov/codex-asr/releases). If absent, the app falls back to any `codex-asr` found on your system `PATH`.

## Changelog & Releases

- **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md) — Keep a Changelog format, `v0.0.1` is the current baseline.
- **Release guide:** [`doc/RELEASE.md`](./doc/RELEASE.md) — how to cut a release (bump `CHANGELOG.md` + `package.json`, push tag `v*`, CI builds installers and writes release notes from the changelog).
- **CI:** [`Quality` workflow](.github/workflows/quality.yml) runs typecheck, lint, unit/E2E and build matrix on every push/PR. [`Release` workflow](.github/workflows/release.yml) builds Windows/macOS/Linux on tags and publishes the GitHub Release with SBOM + SHA256SUMS + provenance attestation.

## FAQ

| Problem | Try this |
|---------|----------|
| Blank or frozen window after dev changes | Delete `node_modules/.vite`, run `npm run dev` again |
| Extension listed in settings but not in chat | Enable it in pi `packages`, then **restart the session** |
| Switching sessions feels slow at first | Only recent messages load immediately; the rest loads when you send or use the tree |
| Voice doesn't work | Open Settings → Voice; check the token or run `codex login` to refresh — typing still works |
| Closed an extension popup | Use **Continue** on the timeline |
| Screenshot looks outdated | Regenerate `doc/images/overview.png` via `npm run build` + Playwright capture (see `doc/images/README.md`) |

## Sponsor

If pi Desktop has been useful to you, you can support its continued maintenance using the QR code below.

<img src="doc/assets/sponsor-qr.png" alt="Sponsor QR code" width="320" />

## Community

Questions and feedback: **[LinuxDo](https://linux.do/)**

If pi Desktop saves you from staring at a terminal all day, a **[star on GitHub](https://github.com/kahme247/PI/stargazers)** helps others find it.

---

<details>
<summary>For developers & extension authors</summary>

- User docs: [`doc/`](./doc/README.md) — getting started, adapter list, screenshots (`doc/images/overview.png`)
- Adapter authoring (for AI): [adapter-authoring-guide.md](./doc/adapter-authoring-guide.md)
- Tech: Electron 43 · React 18 · TypeScript 5.7 · Vite 8 · Tailwind · shadcn · Zustand · i18next · `@earendil-works/pi-coding-agent` 0.83
- Scripts: `npm run dev` (HMR), `npm run build` (production), `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`
- Release: tag `v*` triggers `.github/workflows/release.yml` → Windows, macOS, Linux builds + GitHub Release with assets from `dist/`

</details>
