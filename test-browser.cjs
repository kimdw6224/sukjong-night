// 실행: node test-browser.cjs (Playwright가 설치된 환경)
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))); }
const URL = process.env.GAME_URL || 'http://127.0.0.1:5177';
const KEY = 'sukjong-night-v1';
const report = [];
const errors = [];
const endings = ['사정을 살핀다는 것', '문 앞에 선 책임', '아직 묻지 못한 말'];
const out = path.join(__dirname, 'test-output');
fs.mkdirSync(out, { recursive: true });
const wait = page => page.waitForTimeout(245);
async function step(page) { await wait(page); await page.locator('#next').click(); }
async function walk(page, route, verdict, reverse = false) {
  let hops = 0;
  while (!await page.locator('.result').count()) {
    assert.ok(++hops < 100, '끝나지 않는 분기');
    if (await page.locator('#next').count()) { await step(page); continue; }
    const choices = page.locator('.choices button');
    const labels = await choices.allTextContents();
    assert.ok(labels.length > 0, '진행 버튼 없음');
    let index = 0;
    if (labels[0].includes('왕으로서')) index = route;
    else if (labels[0].includes('가담 책임')) index = verdict;
    else if (reverse && labels.length === 2) index = 1;
    await wait(page); await choices.nth(index).click();
  }
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    async function context(options = {}) {
      const ctx = await browser.newContext(options);
      ctx.on('page', p => {
        p.on('pageerror', e => errors.push(e.message));
        p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      });
      return ctx;
    }
    const routeFilter = process.argv.find(a => a.startsWith('--route='))?.split('=')[1];
    await Promise.all([0, 1].flatMap(route => [0, 1, 2].filter(verdict => !routeFilter || routeFilter === `${route}:${verdict}`).map(async verdict => {
      const ctx = await context(); const page = await ctx.newPage();
      await page.goto(URL); await page.getByRole('button', { name: '시작하기', exact: true }).click();
      // 새로고침이 대화 위치와 기록을 유지하는지 실제 진행 중 확인.
      await step(page); await step(page);
      const before = await page.evaluate(k => localStorage.getItem(k), KEY);
      await page.reload();
      assert.ok(await page.getByRole('button', { name: '이어하기', exact: true }).count());
      await page.getByRole('button', { name: '이어하기', exact: true }).click();
      assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), before);
      await walk(page, route, verdict, route === 1);
      assert.equal(await page.locator('.result h1').textContent(), endings[verdict]);
      const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
      assert.ok(saved.history.includes('awareness_2') && saved.history.includes('assault_2'), '필수 증언 누락');
      assert.equal(saved.history.includes('reveal_0'), route === 1, '신분 공개 장면 중복 또는 누락');
      assert.equal(saved.sceneId, `E0${verdict + 1}_done`);
      const savedText = JSON.stringify(saved);
      await page.getByRole('button', { name: '실제 기록과 비교하기', exact: true }).click();
      assert.ok(await page.getByRole('dialog').isVisible());
      assert.equal(await page.locator('dialog a').getAttribute('href'), 'https://sillok.history.go.kr/id/ksa_11002018_001');
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.textContent), '실제 기록과 비교하기');
      assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), savedText, '기록 비교가 저장을 바꿈');
      await page.reload();
      assert.equal(await page.locator('.result h1').textContent(), endings[verdict], '완료 후 새로고침이 결과로 돌아오지 않음');
      await page.locator('.topbar').getByRole('button', { name: '제목으로', exact: true }).click();
      assert.ok(await page.getByRole('button', { name: '마지막 결과 보기', exact: true }).count());
      await page.getByRole('button', { name: '마지막 결과 보기', exact: true }).click();
      assert.equal(await page.locator('.result h1').textContent(), endings[verdict]);
      await page.getByRole('button', { name: '대화 기록', exact: true }).click();
      assert.ok((await page.locator('.history-entry').count()) > 25);
      assert.equal(await page.locator('.history-choice').count(), 4);
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: '처음부터 다시 하기', exact: true }).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), savedText);
      await page.screenshot({ path: path.join(out, `ending-${route}-${verdict}.png`), fullPage: true });
      report.push({ case: `경로 ${route + 1} × 결말 ${verdict + 1} / 새로고침·기록·초기화 취소`, result: 'PASS' });
      await ctx.close();
    })));
    // 모바일에서 전체 플레이, 키보드 진행, 저장 차단 및 중복 입력.
    const ctx = await context({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const page = await ctx.newPage(); await page.goto(URL);
    await page.screenshot({ path: path.join(out, 'mobile-title.png'), fullPage: true });
    await page.getByRole('button', { name: '시작하기', exact: true }).click();
    assert.ok((await page.locator('#notice').textContent()).includes('저장되지 않습니다'));
    await page.locator('#next').focus(); await page.keyboard.press('Enter');
    assert.ok((await page.locator('#current-text').textContent()).includes('돌아가는 길'));
    await wait(page);
    await page.locator('#next').dblclick({ delay: 30 });
    assert.equal(await page.locator('#current-text').textContent(), await page.evaluate(() => window.NIGHT_STORY.nodes.intro_2.text), '더블 클릭으로 대사를 건너뜀');
    await page.screenshot({ path: path.join(out, 'mobile-dialogue.png'), fullPage: true });
    await walk(page, 1, 2, true);
    assert.equal(await page.locator('.result h1').textContent(), endings[2]);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '모바일 가로 넘침');
    await page.getByRole('button', { name: '실제 기록과 비교하기', exact: true }).click();
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)));
    await page.keyboard.press('Escape');
    await page.screenshot({ path: path.join(out, 'mobile-ending.png'), fullPage: true });
    report.push({ case: '360px 모바일 / 저장 차단 / 키보드 / 중복 입력 / 끝까지 플레이', result: 'PASS' });
    await ctx.close();
    const recovery = await context(); const p = await recovery.newPage(); await p.goto(URL);
    await p.evaluate(k => { localStorage.setItem(k, '{bad json'); localStorage.setItem('unrelated-save', 'keep'); }, KEY);
    await p.reload(); assert.ok(await p.getByRole('button', { name: '시작하기', exact: true }).count());
    await p.getByRole('button', { name: '시작하기', exact: true }).click();
    await p.getByRole('button', { name: '제목으로', exact: true }).click();
    await p.getByRole('button', { name: '처음부터', exact: true }).click();
    await p.getByRole('button', { name: '처음부터 시작', exact: true }).click();
    assert.equal(await p.evaluate(k => JSON.parse(localStorage.getItem(k)).sceneId, KEY), 'intro_0');
    assert.equal(await p.evaluate(() => localStorage.getItem('unrelated-save')), 'keep');
    report.push({ case: '손상된 저장 복구 / 재시작 / 다른 저장 보존', result: 'PASS' });
    await recovery.close();
    // 준비한 이미지 목록이 실제 화면에 적용되는지 CSS와 로딩까지 확인.
    const assetCtx = await context();
    const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
    await assetCtx.route('**/art.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.NIGHT_ART=${JSON.stringify({ bg_shop: pixel, bg_office: pixel, sukjong_neutral: pixel })};` }));
    const assetPage = await assetCtx.newPage(); await assetPage.goto(URL);
    await assetPage.getByRole('button', { name: '시작하기', exact: true }).click();
    await assetPage.locator('.portrait').waitFor();
    assert.ok(await assetPage.locator('.portrait').evaluate(img => img.complete && img.naturalWidth > 0));
    for (const sceneId of ['meet_0', 'E01_done']) {
      await assetPage.evaluate(({k, id}) => localStorage.setItem(k, JSON.stringify({version:1, sceneId:id, route:'official', verdict:id.endsWith('done')?'leniency':null, history:[]})), { k:KEY, id:sceneId });
      await assetPage.reload();
      if (!sceneId.endsWith('done')) await assetPage.getByRole('button', { name:'이어하기', exact:true }).click();
      assert.ok((await assetPage.locator('.scene-art').evaluate(e => getComputedStyle(e).backgroundImage)).includes('data:image/png'), '배경 이미지가 CSS에 덮임');
    }
    report.push({ case: '외부 배경 2종·캐릭터 이미지 연결', result:'PASS' });
    await assetCtx.close();
    assert.deepEqual(errors, [], '브라우저 오류');
    report.push({ case: '전체 브라우저 콘솔·런타임 오류 0건', result: 'PASS' });
  } finally {
    fs.writeFileSync(path.join(out, process.argv.includes('--route=0:0') ? 'results-focused.json' : 'results.json'), JSON.stringify({ results: report, errors }, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
