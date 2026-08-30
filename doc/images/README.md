# Screenshots

Captured from the current build (`out/main/index.js`) via Playwright Electron.

- `overview.png` — main window (1440x900) — captured 2026-08-30 for v0.0.1

To regenerate:
```bash
npm run build
NODE_PATH=node_modules node -e "
const { _electron } = require('playwright');
const path = require('path');
const appRoot = __dirname;
const main = path.join(appRoot, 'out/main/index.js');
const electron = require('electron');
(async()=>{
  const app = await _electron.launch({ executablePath: electron, args: [main], env: {...process.env, PI_E2E:'1'}});
  const w = await app.firstWindow(); await w.waitForTimeout(4000);
  await w.screenshot({path: 'doc/images/overview.png'});
  await app.close();
})();
"
```
Or run `npx playwright test` smoke and save via code.
