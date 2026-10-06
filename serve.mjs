import http from 'node:http';
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const candidates = {
  bg_alley: 'assets/backgrounds/bg_alley_night.png',
  bg_shop: 'assets/backgrounds/bg_shop_day.png',
  bg_office: 'assets/backgrounds/bg_office_day.png'
};
for (const person of ['youth', 'merchant', 'officer', 'sukjong']) {
  for (const face of ['neutral', person === 'sukjong' ? 'resolute' : 'tense']) candidates[`${person}_${face}`] = `assets/characters/${person}_${face}.png`;
}
const images = {};
for (const [key, file] of Object.entries(candidates)) {
  try { await access(path.join(root, file)); images[key] = file; } catch {}
}
await writeFile(path.join(root, 'art.js'), `// 실제 존재하는 게임 이미지 목록. 서버 시작 시 갱신됩니다.\nwindow.NIGHT_ART = ${JSON.stringify(images, null, 2)};\n`, 'utf8');
if (process.argv.includes('--art-only')) { console.log(`이미지 ${Object.keys(images).length}개 연결 완료`); process.exit(0); }
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const allowed = new Set(['index.html', 'style.css', 'story.js', 'game.js', 'art.js']);
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root, name);
    if (!file.startsWith(root + path.sep) || (!allowed.has(name) && !/^assets\/(backgrounds|characters)\/[a-z_]+\.(png|webp)$/.test(name))) {
      res.writeHead(404); res.end('Not found'); return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', e => { console.error(`실행 실패: ${e.code}`); process.exitCode = 1; });
server.listen(5177, '127.0.0.1', () => console.log('숙종의 밤 — http://127.0.0.1:5177'));
