# Release Guide

## Release process (maintainers)

1. Add a complete version entry at the top of `CHANGELOG.md` (user-visible changes first).
2. Bump the version in `package.json` / `package-lock.json`.
3. **GitHub Release body** (user-facing "Release Notes" shown in the in-app update dialog):
   - Draft: `node scripts/generate-release-notes.mjs [version]`
   - Use short entries for fixes / new features / notes.
   - **Do not** leave placeholder links to CHANGELOG / RELEASE docs only.
4. Commit `release: vX.Y.Z — …` and push tag `vX.Y.Z`; CI builds installers and writes the Release body via `generate-release-notes.mjs`.
5. If the CI body is not ideal, edit it manually on the GitHub Release page.

## In-app updates

- On startup, check `releases/latest` in the background (can be disabled in Settings -> Auto-check for updates; failures are silent, no popup).
- When a new version exists and is not "ignored", show a dialog: release notes (Release body) + **Dismiss** / **Ignore this version** / **Update**.
- **Dismiss**: close once; **Ignore this version**: remember version locally, do not auto-show again for that version.
- **Update**: download the current platform installer and open it (Windows Setup / macOS dmg / Linux AppImage, etc.).
- Therefore **Release body must be user-readable**, placeholder CHANGELOG links are forbidden (old template deprecated).

## Related docs

- Local collaboration notes (optional, not in repo): root `AGENTS.md` (gitignored)
- Repo changelog: `CHANGELOG.md`
