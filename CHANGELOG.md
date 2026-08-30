# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

When cutting a release, `scripts/generate-release-notes.mjs` generates the **GitHub Release body**
(user-facing release notes shown in the in-app update dialog) from the corresponding version section.
See [doc/RELEASE.md](doc/RELEASE.md) for the release and update workflow.

## [Unreleased]

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

[Unreleased]: https://github.com/kahme247/PI/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/kahme247/PI/releases/tag/v0.0.1
