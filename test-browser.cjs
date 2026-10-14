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
const endings = ['관아 밖으로', '가담한 죄', '다시 가게 앞으로'];
const out = path.join(__dirname, 'test-output');
fs.mkdirSync(out, { recursive: true });
const wait = page => page.waitForTimeout(245);
async function step(page) { await wait(page); await page.locator('#next').click(); }
async function walk(page, route, verdict, reverse = false, inspection = 0) {
  let hops = 0;
  const prompts = await page.evaluate(() => ({
    route: window.NIGHT_STORY.nodes.route.choices[0].text,
    inspect: window.NIGHT_STORY.nodes.inspect.choices[0].text,
    verdict: window.NIGHT_STORY.nodes.verdict.choices[0].text,
    returnToShop: window.NIGHT_STORY.nodes.E03_3.text
  }));
  while (!await page.locator('.result').count()) {
    assert.ok(++hops < 200, '끝나지 않는 분기');
    if (await page.locator('#next').count()) {
      if (await page.locator('#current-text').textContent() === prompts.returnToShop)
        assert.equal(await page.locator('.scene-art.shop').count(), 1, '현장 재조사 장면의 배경');
      await step(page); continue;
    }
    const choices = page.locator('.choices button');
    const labels = await choices.allTextContents();
    assert.ok(labels.length > 0, '진행 버튼 없음');
    let index = 0;
    if (labels[0] === prompts.inspect) index = inspection;
    else if (labels[0] === prompts.route) index = route;
    else if (labels[0] === prompts.verdict) index = verdict;
    else if (reverse && labels.length === 2) index = 1;
    await wait(page); await choices.nth(index).click();
    if (labels[0] === prompts.inspect && verdict === 0) {
      const saved = await page.evaluate(k => { try { return localStorage.getItem(k); } catch { return null; } }, KEY);
      if (saved) {
        await page.reload(); await page.getByRole('button', {name: '이어하기', exact: true}).click();
        assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), saved, '직접 조사 선택이 새로고침으로 바뀜');
      }
    }
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
    await Promise.all([0, 1].flatMap(route => [0, 1, 2].filter(verdict => !routeFilter || routeFilter === `${route}:${verdict}`).flatMap(verdict => [0, 1].map(async inspection => {
      const ctx = await context(); const page = await ctx.newPage();
      await page.goto(URL); await page.getByRole('button', { name: '시작하기', exact: true }).click();
      // 새로고침이 대화 위치와 기록을 유지하는지 실제 진행 중 확인.
      await step(page); await step(page);
      const before = await page.evaluate(k => localStorage.getItem(k), KEY);
      await page.reload();
      assert.ok(await page.getByRole('button', { name: '이어하기', exact: true }).count());
      await page.getByRole('button', { name: '이어하기', exact: true }).click();
      assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), before);
      await walk(page, route, verdict, route === 1, inspection);
      assert.equal(await page.locator('.result h1').textContent(), endings[verdict]);
      const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
      assert.ok(saved.history.includes('awareness_2') && saved.history.includes('assault_2'), '필수 증언 누락');
      assert.ok(saved.history.includes(`inspect#${inspection}`), '직접 조사 선택 누락');
      assert.ok(saved.history.includes(inspection === 0 ? 'doorway_question_0' : 'counter_question_0'), '관찰한 내용에 맞는 추가 질문 누락');
      assert.ok(!saved.history.includes(inspection === 0 ? 'counter_question_0' : 'doorway_question_0'), '선택하지 않은 관찰의 질문이 섞임');
      assert.ok(saved.history.includes(route === 0 ? 'official_loss_0' : 'private_motive_0'), '조사 방식별 고유 이야기 누락');
      assert.ok(!saved.history.includes(route === 0 ? 'private_motive_0' : 'official_loss_0'), '다른 조사 방식의 이야기가 섞임');
      assert.ok(saved.history.includes('meet_7_reply_0'), '상인의 개별 장면 누락');
      assert.equal(saved.history.includes('reveal_0'), route === 1, '신분 공개 장면 중복 또는 누락');
      assert.equal(saved.sceneId, `E0${verdict + 1}_done`);
      assert.ok(saved.history.filter(id => /^E0[123]_/.test(id)).every(id => id.startsWith(`E0${verdict + 1}_`)), '다른 선택의 결말이 섞임');
      assert.ok(saved.history.includes(verdict === 2 ? 'E03_5_reply_1' : `E0${verdict + 1}_5`), '선택 뒤 행동 장면 누락');
      assert.ok(saved.history.includes(`E0${verdict + 1}_epilogue_${verdict === 1 ? 7 : 6}`), '후일담 마지막 장면 누락');
      assert.equal(await page.locator(`.scene-art.${verdict === 0 ? 'office' : 'shop'}`).count(), 1, '후일담에 이어지는 결말 배경');
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
      assert.equal(await page.locator('.history-choice').count(), 5);
      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: '처음부터 다시 하기', exact: true }).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(k => localStorage.getItem(k), KEY), savedText);
      await page.screenshot({ path: path.join(out, `ending-${route}-${verdict}-${inspection}.png`), fullPage: true });
      report.push({ case: `경로 ${route + 1} × 관찰 ${inspection + 1} × 결말 ${verdict + 1} / 새로고침·기록·초기화 취소`, result: 'PASS' });
      await ctx.close();
    }))));
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
    assert.equal(await page.locator('#current-text').textContent(), await page.evaluate(() => window.NIGHT_STORY.nodes.intro_1_reply_0.text), '더블 클릭으로 대사를 건너뜀');
    await page.screenshot({ path: path.join(out, 'mobile-dialogue.png'), fullPage: true });
    await walk(page, 1, 2, true, 1);
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
    // 직접 조사 선택이 없던 이전 저장도 새 분기에서 멈추지 않음.
    await p.evaluate(key => localStorage.setItem(key, JSON.stringify({version:1,sceneId:'official_loss_6',route:'official',verdict:null,history:['official_6']})), KEY);
    await p.reload(); await p.getByRole('button',{name:'이어하기',exact:true}).click(); await step(p);
    assert.equal(await p.evaluate(key => JSON.parse(localStorage.getItem(key)).sceneId, KEY), 'questions');
    report.push({case:'이전 저장의 조사 기록 없는 분기 복구',result:'PASS'});
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
    // 두 인물의 실제 이미지와 화자 강조를 PC/모바일에서 확인.
    for (const [width, height] of [[1366, 900], [360, 740], [390, 844]]) {
      const pairCtx = await context({ viewport: { width, height } });
      const pairPage = await pairCtx.newPage(); await pairPage.goto(URL);
      const ids = await pairPage.evaluate(() => Object.entries(window.NIGHT_STORY.nodes)
        .filter(([,n]) => n.type === 'line' && n.pair?.length === 2 && n.pair.includes(n.who))
        .slice(0, 2).map(([id]) => id));
      assert.equal(ids.length, 2, '두 인물 장면 부족');
      for (const id of ids) {
        await pairPage.evaluate(({key,id}) => localStorage.setItem(key, JSON.stringify({version:1,sceneId:id,route:null,verdict:null,history:[id]})), {key:KEY,id});
        await pairPage.reload(); await pairPage.getByRole('button', {name:'이어하기',exact:true}).click();
        await pairPage.waitForFunction(() => [...document.querySelectorAll('.stage.duet img')].every(img => img.complete && img.naturalWidth));
        assert.equal(await pairPage.locator('.stage.duet .portrait').count(), 2);
        assert.equal(await pairPage.locator('.portrait-slot.is-speaking').count(), 1);
        assert.equal(await pairPage.locator('.portrait-slot.is-speaking').getAttribute('data-character'), await pairPage.evaluate(id => window.NIGHT_STORY.nodes[id].who, id));
        const boxes = await pairPage.locator('.portrait-slot').evaluateAll(slots => slots.map(s => ({x:s.getBoundingClientRect().x,width:s.getBoundingClientRect().width,filter:getComputedStyle(s).filter})));
        assert.ok(boxes[0].x + boxes[0].width <= boxes[1].x + 1, '인물 표시 영역 겹침');
        assert.notEqual(boxes[0].filter, boxes[1].filter, '화자 강조 없음');
      }
      assert.ok(await pairPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '두 인물 화면 가로 넘침');
      const soundBox = await pairPage.locator('#sound-toggle').boundingBox();
      assert.ok(soundBox.width >= 44 && soundBox.height >= 44, '소리 버튼 터치 영역');
      await pairPage.screenshot({ path:path.join(out, `pair-${width}.png`), fullPage:true });
      report.push({case:`${width}px 두 인물 / 화자 강조 / 소리 버튼`,result:'PASS'});
      await pairCtx.close();
    }
    // 실제 Web Audio 출력 파형과 음소거를 확인. 장면 재표시에는 소리를 중복 재생하지 않음.
    const audioCtx = await context();
    await audioCtx.addInitScript(() => {
      const Native = window.AudioContext;
      window.__audio = { contexts: [], starts: 0 };
      window.AudioContext = class extends Native {
        constructor(...args) { super(...args); window.__audio.contexts.push(this); }
        createGain() {
          const gain = super.createGain();
          if (!this.outputProbe) { this.outputProbe = this.createAnalyser(); this.masterGain = gain; gain.connect(this.outputProbe); }
          return gain;
        }
        createBufferSource() {
          const source = super.createBufferSource(), start = source.start.bind(source);
          source.start = (...args) => { window.__audio.starts++; start(...args); };
          return source;
        }
      };
    });
    const audioPage = await audioCtx.newPage(); await audioPage.goto(URL);
    async function beforeCue(cue, muted) {
      await audioPage.evaluate(({key,cue,muted}) => {
        const nodes = window.NIGHT_STORY.nodes;
        const entry = Object.entries(nodes).find(([,n]) => n.type === 'line' && nodes[n.next]?.cue === cue);
        if (!entry) throw new Error(`No playable cue: ${cue}`);
        localStorage.setItem(key, JSON.stringify({version:1,sceneId:entry[0],route:'official',verdict:null,history:[entry[0]]}));
        localStorage.setItem(`${key}-sound`,muted?'off':'on');
      }, {key:KEY,cue,muted});
      await audioPage.reload(); await audioPage.getByRole('button',{name:'이어하기',exact:true}).click();
      assert.equal(await audioPage.evaluate(() => window.__audio.starts), 0, '이어하기에서 효과음 중복');
      await step(audioPage);
    }
    for (const cue of ['steps','door']) {
      await beforeCue(cue, false);
      await audioPage.waitForFunction(() => {
        const ctx = window.__audio.contexts[0]; if (!ctx?.outputProbe || ctx.state !== 'running') return false;
        const samples = new Float32Array(ctx.outputProbe.fftSize); ctx.outputProbe.getFloatTimeDomainData(samples);
        return samples.some(value => Math.abs(value) > 0.0001);
      }, null, {timeout:3000});
      await audioPage.locator('#sound-toggle').click();
      assert.equal(await audioPage.evaluate(key => localStorage.getItem(`${key}-sound`), KEY), 'off');
      await audioPage.waitForFunction(() => window.__audio.contexts[0].masterGain.gain.value < 0.0001);
      await beforeCue(cue, true);
      assert.equal(await audioPage.evaluate(() => window.__audio.starts), 0, '음소거 상태의 효과음 재생');
      assert.equal(await audioPage.locator('#sound-toggle').textContent(), '소리 켜기');
    }
    report.push({case:'발소리·문소리 실제 출력 파형 / 즉시 음소거 / 설정 유지',result:'PASS'});
    await audioCtx.close();
    assert.deepEqual(errors, [], '브라우저 오류');
    report.push({ case: '전체 브라우저 콘솔·런타임 오류 0건', result: 'PASS' });
  } finally {
    fs.writeFileSync(path.join(out, process.argv.includes('--route=0:0') ? 'results-focused.json' : 'results.json'), JSON.stringify({ results: report, errors }, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
