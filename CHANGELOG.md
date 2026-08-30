# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

When cutting a release, `scripts/generate-release-notes.mjs` generates the **GitHub Release body**
(user-facing release notes shown in the in-app update dialog) from the corresponding version section.
See [doc/RELEASE.md](doc/RELEASE.md) for the release and update workflow.

## [Unreleased]

## [0.0.2] - 2026-08-30

### Fixed
- **Updater Target Repository**: Fixed background update check querying upstream repository (`justhil/pi-app`) which triggered false `v0.5.7` update dialogs with Chinese release notes. The app now properly targets `kahme247/PI`.
- **GitHub Release Links**: Settings and updater links now point directly to `https://github.com/kahme247/PI`.

### Added
- **UI/UX Overhaul (Phase 1–3)**:
  - **Tabs & Navigation**: Implemented WAI-ARIA tablist pattern with roving tabIndex and keyboard arrow navigation on right-panel tabs and settings navigation.
  - **Composer Ergonomics**: Refined model and thinking pills with active border highlights, subtle elevation shadows, and dynamic color-coded context consumption thresholds (<50% normal, 50–80% amber, >80% red).
  - **Floating Accessory Controls**: Upgraded floating session reload and right panel toggle into a clean glassmorphic accessory strip with backdrop blur.
  - **Popovers & Modals**: Standardized `/` slash command popover, `@` file search popover, and thinking depth selector with `backdrop-blur-md`, refined border contrast, and smooth transitions.
  - **Sidebar & Workspaces**: Polished active workspace rows and ephemeral sandbox cards with distinct elevation and focus rings.
  - **Review & Files**: Unified review scope switchers (`turn`, `session`, `git`) and workspace file preview tab transitions.

### Changed
- All release notes and updater prompts are now strictly in English.

## [0.0.1] - 2026-08-30

### Added
- Initial public release — fresh baseline forked from `pi Desktop`.
- Desktop shell for the `pi` coding agent: streaming timeline, session tree, composer with file attachments and slash commands.
- Workspace file preview (multi-tab, line-gutter source view) and draggable right panels.
- Extension adapter layer — all terminal `pi` extensions run in the desktop app without changes to npm packages.
- Bilingual UI (English / Chinese) with English as the default language.
- Voice input support via `codex-asr` (optional local transcription).
- Cross-platform builds: Windows (NSIS + Portable), macOS (dmg + zip, x64 & arm64), Linux (AppImage + deb) — published via the `Release` workflow.
- Release automation: SBOM (`sbom.cdx.json`), `SHA256SUMS.txt`, and build provenance attestations on every GitHub Release.
- Proper CI: `Quality` workflow (typecheck, lint, unit/E2E, build matrix) and `Release` workflow (validated builds → artifacts → GitHub Release from `CHANGELOG.md`).

### Changed
- Default language is now English; Chinese remains available as a secondary option.
- Documentation and workflows translated to English; release notes generation uses English templates.

### Fixed
- N/A — baseline release.

[Unreleased]: https://github.com/kahme247/PI/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/kahme247/PI/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/kahme247/PI/releases/tag/v0.0.1
