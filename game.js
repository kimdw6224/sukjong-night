(() => {
  'use strict';
  const { nodes, cast, endings, first } = window.NIGHT_STORY;
  const art = window.NIGHT_ART || {};
  const KEY = 'sukjong-night-v1';
  const app = document.querySelector('#app');
  const dialog = document.querySelector('#dialog');
  const dialogBody = document.querySelector('#dialog-body');
  const dialogTitle = document.querySelector('#dialog-title');
  const closeButton = document.querySelector('#dialog-close');
  let view = 'title', lockUntil = 0, restoreFocus = null, confirmAction = null;
  let state = null, noticeTimer, storageWritable = true;
  function notify(text) {
    const el = document.querySelector('#notice'); el.textContent = text; el.hidden = false;
    clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { el.hidden = true; }, 5000);
  }
  function validHistoryId(id) {
    if (typeof id !== 'string') return false;
    const [nodeId, option] = id.split('#');
    return !!nodes[nodeId] && (option === undefined || !!nodes[nodeId].choices?.[Number(option)]);
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.version !== 1 || !nodes[saved.sceneId] || !Array.isArray(saved.history) || saved.history.length > 250 || !saved.history.every(validHistoryId)
        || ![null, 'official', 'private'].includes(saved.route) || ![null, ...Object.keys(endings)].includes(saved.verdict)
        || (nodes[saved.sceneId].type === 'end' && nodes[saved.sceneId].verdict !== saved.verdict)) throw new Error('invalid save');
      state = saved;
    }
  } catch { notify('저장된 진행을 불러오지 못했습니다. 새로 시작할 수 있습니다.'); }
  if (state && nodes[state.sceneId].type === 'end') view = 'game';
  function save() {
    if (!storageWritable) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch { storageWritable = false; notify('이 환경에서는 진행이 저장되지 않습니다. 지금 플레이는 계속할 수 있습니다.'); }
  }
  function el(tag, className, text) { const e = document.createElement(tag); if (className) e.className = className; if (text !== undefined) e.textContent = text; return e; }
  function button(text, action, className = '') { const b = el('button', className, text); b.type = 'button'; b.addEventListener('click', action); return b; }
  function record(id) { if (state.history.at(-1) !== id) state.history.push(id); }
  function availableQuestions() { return nodes.questions.choices.filter(c => !state.history.includes(c.answer)); }
  function go(id) {
    if (id === 'questions' && !availableQuestions().length) id = state.route === 'private' ? 'reveal_0' : 'deliberate_0';
    state.sceneId = id;
    if (nodes[id].type === 'line') record(id);
    save(); view = 'game'; render(true);
  }
  function act(fn) { if (performance.now() < lockUntil || dialog.open) return; lockUntil = performance.now() + 230; fn(); }
  function start() { state = { version: 1, sceneId: first, route: null, verdict: null, history: [] }; go(first); }
  function restart() {
    if (!state) { start(); return; }
    openDialog('처음부터 시작할까요?', [el('p', '', '지금까지의 진행과 마지막 결과가 새 이야기로 바뀝니다.')], '취소');
    const actions = el('div', 'modal-actions');
    actions.append(button('취소', () => dialog.close()), button('처음부터 시작', () => { confirmAction = start; dialog.close(); }, 'primary'));
    dialogBody.append(actions);
  }
  function background(bg) {
    const back = el('div', `scene-art ${bg}`); back.setAttribute('aria-hidden', 'true');
    const image = art[`bg_${bg}`];
    if (image) { back.classList.add('has-art'); back.style.backgroundImage = `url("${image}")`; }
    const shapes = el('div', 'scenery');
    for (const c of ['moon', 'wall', 'wall right', 'roof', 'roof right', 'lantern']) shapes.append(el('div', c));
    back.append(shapes); return back;
  }
  function header() {
    const h = el('header', 'topbar');
    if (view !== 'title') h.append(el('span', 'brand', '숙종의 밤'));
    const actions = el('nav', 'top-actions'); actions.setAttribute('aria-label', '게임 메뉴');
    if (state?.history.length) actions.append(button('대화 기록', showHistory, 'quiet'));
    if (view !== 'title') actions.append(button('제목으로', () => { view = 'title'; render(); }, 'quiet'));
    h.append(actions); return h;
  }
  function title(shell) {
    const layout = el('main', 'title-layout');
    const copy = el('div', 'title-copy');
    const h = el('h1'); h.append(el('span', '', '숙종의'), el('span', '', '밤'));
    copy.append(h);
    const menu = el('div', 'title-menu');
    if (state) {
      const done = nodes[state.sceneId].type === 'end';
      menu.append(button(done ? '마지막 결과 보기' : '이어하기', () => { view = 'game'; render(true); }, 'primary'));
      menu.append(button('처음부터', restart));
    } else menu.append(button('시작하기', start, 'primary'));
    copy.append(menu);
    layout.append(copy); shell.append(layout);
  }
  function portrait(node) {
    const stage = el('div', 'stage'); stage.setAttribute('aria-hidden', 'true');
    const person = cast[node.focus || node.who];
    if (!person?.image) return stage;
    const path = art[`${person.image}_${node.face || 'neutral'}`] || art[`${person.image}_neutral`];
    if (path) {
      const image = el('img', 'portrait'); image.alt = ''; image.src = path;
      image.addEventListener('error', () => { image.replaceWith(silhouette(person.image)); }, { once: true });
      stage.append(image);
    } else stage.append(silhouette(person.image));
    return stage;
  }
  function silhouette(person) { const shape = el('div', `shadow-person ${person}`); shape.append(el('div', 'hat')); return shape; }
  function play(shell, node) {
    const main = el('main'); main.append(portrait(node));
    const wrap = el('div', 'dialogue-wrap'), box = el('section', 'dialogue-box');
    const label = el('div', 'speaker-line');
    label.append(el('h1', 'speaker', cast[node.who]?.name || '숙종'));
    const answered = node.type === 'questions' ? node.choices.find(c => state.history.includes(c.answer)) : null;
    const text = el('p', 'dialogue-text', answered ? node.afterAnswer[answered.answer] : node.text); text.id = 'current-text'; text.setAttribute('aria-live', 'polite');
    if (node.who !== 'narrator' && !node.thought) box.append(label);
    box.append(text);
    if (node.facts) { const facts = el('ul', 'facts'); node.facts.forEach(f => facts.append(el('li', '', f))); box.append(facts); }
    if (node.choices) {
      const list = el('div', 'choices');
      node.choices.forEach((c, index) => {
        if (node.type === 'questions' && state.history.includes(c.answer)) return;
        list.append(button(c.text, () => act(() => {
          record(`${state.sceneId}#${index}`);
          if (c.route) state.route = c.route;
          if (c.verdict) state.verdict = c.verdict;
          go(c.next);
        })));
      });
      box.append(list);
    } else {
      const foot = el('div', 'dialogue-footer');
      const next = button('다음', () => act(() => go(node.next)), 'next'); next.id = 'next'; foot.append(next); box.append(foot);
    }
    wrap.append(box); main.append(wrap); shell.append(main);
  }
  function result(shell, node) {
    const e = endings[node.verdict], main = el('main', 'result'), inner = el('div', 'result-inner fade-in');
    inner.append(el('h1', '', e.title), el('p', 'verdict-text', e.label));
    const reactions = el('div', 'reactions');
    e.reactions.forEach(([name, text]) => { const row = el('div', 'reaction'); row.append(el('strong', '', name), el('p', '', `“${text}”`)); reactions.append(row); });
    inner.append(reactions);
    const actions = el('div', 'result-actions');
    actions.append(button('실제 기록과 비교하기', showSource, 'primary'), button('처음부터 다시 하기', restart), button('제목으로', () => { view = 'title'; render(); }));
    inner.append(actions);
    main.append(inner); shell.append(main);
  }
  function render(focus = false) {
    const node = view === 'game' && state ? nodes[state.sceneId] : null;
    const bg = !node ? 'alley' : node.bg === 'route' ? (state.route === 'official' ? 'office' : 'shop') : node.bg;
    const shell = el('div', 'shell'); shell.append(background(bg), header());
    if (!node) title(shell); else if (node.type === 'end') result(shell, node); else play(shell, node);
    app.replaceChildren(shell);
    if (focus) app.querySelector('main button')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function openDialog(title, content, closeText = '닫기') {
    restoreFocus = document.activeElement; dialogTitle.textContent = title; closeButton.textContent = closeText;
    dialogBody.replaceChildren(...content); dialog.showModal(); dialogTitle.focus();
  }
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (confirmAction) { const action = confirmAction; confirmAction = null; action(); }
    else restoreFocus?.isConnected && restoreFocus.focus();
  });
  document.addEventListener('keydown', event => { if (event.repeat && (event.key === 'Enter' || event.key === ' ')) event.preventDefault(); });
  function showHistory() {
    const content = state.history.map(id => {
      const [nodeId, option] = id.split('#'), node = nodes[nodeId];
      if (option !== undefined) return el('p', 'history-choice', `선택 · ${node.choices[Number(option)].text}`);
      const entry = el('div', 'history-entry');
      entry.append(el('strong', '', cast[node.who]?.name || '기록'), el('p', '', node.text)); return entry;
    });
    openDialog('대화 기록', content.length ? content : [el('p', '', '아직 나눈 대화가 없습니다.')]);
  }
  function showSource() {
    const parts = [
      el('h3', '', '실록에 있는 내용'),
      el('p', '', '『숙종실록』 15권, 숙종 10년(1684) 2월 18일(음력) 1번째 기사에는 포청에 갇힌 검계 구성원들의 죄를 구분하고, 관련자들의 구금이 지체되지 않도록 하자는 논의가 나옵니다. 숙종은 경중을 가려 보고하도록 했습니다.'),
      el('h3', '', '게임이 만든 내용'),
      el('p', '', '숙종의 암행과 길 안내, 청년·상인·군관의 구체적인 사건과 대사, 두 조사 경로와 세 결말은 창작입니다. 숙종의 가벼운 말투와 성격 역시 이 작품을 위한 각색입니다. 이 기사는 숙종이 직접 암행 수사를 했다는 기록이 아닙니다.')
    ];
    const link = el('a', '', '실록 원문·국역 열기'); link.href = 'https://sillok.history.go.kr/id/ksa_11002018_001'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    parts.push(link); openDialog('실제 기록과 비교하기', parts, '결말로 돌아가기');
  }
  render();
})();
