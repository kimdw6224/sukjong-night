import { execFileSync } from 'node:child_process';
import { mkdir, copyFile, cp, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
execFileSync(process.execPath, [path.join(root, 'serve.mjs'), '--art-only'], { stdio: 'inherit' });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'style.css', 'game.js', 'story.js', 'art.js']) {
  await copyFile(path.join(root, name), path.join(output, name));
}
const assets = path.join(root, 'assets');
let hasAssets = false;
try { await access(assets); hasAssets = true; } catch {}
if (hasAssets) await cp(assets, path.join(output, 'assets'), { recursive: true });
console.log('정적 배포 파일 준비 완료: dist/');
