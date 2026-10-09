/* 대사는 전부 창작입니다. 사료와의 구분은 게임 안의 기록 비교에서 제공합니다. */
(() => {
  const nodes = {};
  function scene(id, title, bg, lines, next) {
    lines.forEach(([who, text, face = 'neutral', focus], i) => {
      nodes[`${id}_${i}`] = { type: 'line', title, bg, who, text, face, focus,
        next: i + 1 < lines.length ? `${id}_${i + 1}` : next };
    });
  }
  // 기존 대사 ID 사이에 장면을 넣어 저장된 위치를 유지합니다.
  function after(id, lines) {
    const node = nodes[id];
    scene(`${id}_reply`, node.title, node.bg, lines, node.next);
    node.next = `${id}_reply_0`;
  }
  const cast = {
    narrator: { name: '그날의 기록', role: '', image: null },
    sukjong: { name: '숙종', role: '평상복 차림의 왕', image: 'sukjong' },
    youth: { name: '청년', role: '어젯밤 길을 알려 준 사람', image: 'youth' },
    merchant: { name: '상인', role: '포목상의 주인', image: 'merchant' },
    officer: { name: '군관', role: '왕의 신분을 아는 수행자', image: 'officer' }
  };
  scene('intro', '첫째 날 · 밤 골목', 'alley', [
    ['narrator', '1684년 음력 2월 17일. 숙종은 평소와 다름없이 정사를 마쳤다. 날이 저물자 평상복으로 갈아입고, 군관 하나를 데리고 궁을 나섰다.', 'neutral', 'sukjong'],
    ['narrator', '밤거리를 한 바퀴 돌고 궁으로 돌아가는 길이었다. 나는 같은 담 앞에서 걸음을 멈추고 군관을 돌아보았다.'],
    ['officer', '아까 갈림길에서 왼쪽으로 가셨어야 합니다.'],
    ['sukjong', '그걸 왜 이제 말하느냐.'],
    ['narrator', '나는 헛기침을 하고 앞을 보았다. 가게 처마 밑에 청년 하나가 서 있었다.', 'neutral', 'youth'],
    ['sukjong', '여보게. 큰길로 나가려면 어느 쪽인가?'],
    ['youth', '이 담을 따라가십시오. 끝에서 오른쪽으로 도시면 됩니다.'],
    ['narrator', '청년이 가게 앞에서 나와 길을 가리켰다. 나는 그쪽으로 발을 돌렸다.', 'neutral', 'youth']
  ], 'meet_0');
  scene('meet', '이튿날 · 포목상 앞', 'shop', [
    ['narrator', '이튿날 아침, 군관이 찾아왔다. 어젯밤 그 골목에서 강도질이 있었다고 했다.'],
    ['youth', '나리, 저 기억하십니까? 어젯밤에 길을…….', 'tense'],
    ['sukjong', '기억하지. 그런데 자네가 왜 잡혀 있나?'],
    ['merchant', '두 분은 아는 사이십니까?', 'tense'],
    ['sukjong', '어제 길을 좀 물었소. 이 집 주인이시오?'],
    ['merchant', '예. 저놈이 문 앞을 막고 있는 동안 가게를 털렸습니다.', 'tense'],
    ['narrator', '청년이 상인의 소매를 보더니 눈을 내렸다.', 'tense', 'youth'],
    ['youth', '저는 안에 들어가지 않았습니다.', 'tense'],
    ['narrator', '군관이 나를 보았다. 나는 곧바로 답하지 않았다.', 'neutral', 'officer']
  ], 'route');
  nodes.route = { type: 'choice', title: '누구로 물을 것인가', bg: 'shop', who: 'sukjong', thought: true,
    text: '청년은 나를 길을 묻던 나리로 여기는 눈치였다. 지금 신분을 밝힐까.',
    choices: [
      { text: '왕으로서 조사 내용을 묻는다.', next: 'official_0', route: 'official' },
      { text: '신분을 숨긴 채 청년에게 자세히 묻는다.', next: 'private_0', route: 'private' }
    ] };
  scene('official', '이튿날 · 공개 조사', 'office', [
    ['narrator', '내가 고개를 끄덕이자 군관이 허리를 굽혔다. “전하.” 그 한마디에 청년이 뒤로 반걸음 물러섰다.', 'tense', 'youth'],
    ['sukjong', '군관, 이 청년이 한 일을 먼저 말해 보아라.'],
    ['officer', '돈을 빼앗는 줄 알고 문밖을 지켰다고 했습니다.', 'tense'],
    ['youth', '밖에 있으라고 해서…… 안에는 들어가지 않았습니다.', 'tense'],
    ['sukjong', '밖에서 뭘 하라고 했느냐?'],
    ['youth', '사람이 오면 돌려보내라고 했습니다. 안에서 돈을 가져온다는 것도 알았습니다.', 'tense'],
    ['officer', '문을 지켰다는 말은 처음 조사할 때도 했습니다. 때릴 줄도 알고 있었는지는 아직 확인하지 못했습니다.']
  ], 'questions');
  scene('private', '이튿날 · 남겨 둔 이름', 'shop', [
    ['narrator', '나는 군관에게 잠시 기다리라는 뜻으로 손을 들었다. 군관이 물러서자 청년이 내 쪽으로 몸을 돌렸다.', 'neutral', 'youth'],
    ['youth', '어젯밤 보셨지 않습니까. 저는 밖에 있었습니다.'],
    ['sukjong', '봤지. 하지만 왜 거기 있었는지는 몰랐네.'],
    ['youth', '안에 들어간 적은 없습니다.', 'tense'],
    ['sukjong', '그건 들었네. 밖에서 무엇을 하라고 했나?', 'resolute'],
    ['youth', '사람이 오면 돌려보내라고 했습니다. 안에서 돈을 가져온다고 했고요.', 'tense'],
    ['sukjong', '그래서 나도 다른 길로 보냈군.', 'resolute'],
    ['youth', '예. 들키면 싸움이 날까 봐서요. 나리까지 들어오시면…….', 'tense'],
    ['merchant', '그럼 나는 어디로 나가야 했느냐. 네가 문을 막고 있는데.', 'tense']
  ], 'questions');
  nodes.questions = { type: 'questions', title: '문 안과 문밖', bg: 'route', who: 'sukjong', thought: true,
    text: '청년이 직접 때렸는지, 폭행을 미리 알고 있었는지 확인해야 한다.',
    afterAnswer: {
      awareness_2: '청년은 폭행을 예상하지 못했다고 한다. 직접 때렸는지는 상인에게 확인해 보자.',
      assault_2: '상인은 때린 자가 따로 있었다고 했다. 청년이 폭행을 미리 알았는지도 물어보자.'
    },
    choices: [
      { text: '안에서 폭행이 있을 줄도 알았느냐?', next: 'awareness_0', answer: 'awareness_2' },
      { text: '직접 때린 것도 이 청년이었느냐?', next: 'assault_0', answer: 'assault_2' }
    ] };
  scene('awareness', '문 안과 문밖', 'route', [
    ['youth', '사람을 때릴 줄은 몰랐습니다. 돈과 천만 가져온다고 들었습니다.', 'tense'],
    ['sukjong', '군관, 이 말은 다른 자들의 말과도 맞춰 보았느냐?', 'resolute'],
    ['officer', '아직 못 맞춰 봤습니다. 지금은 이 청년의 말뿐입니다.']
  ], 'questions');
  scene('assault', '문 안과 문밖', 'route', [
    ['merchant', '아닙니다. 저를 때린 자는 따로 있습니다. 이 청년은 문 앞에 있었고요.'],
    ['youth', '그러니까 저는 손을 대지 않았습니다.', 'tense'],
    ['merchant', '손만 안 대면 다냐? 네가 문을 막아서 나가지도 못했다.', 'tense']
  ], 'questions');
  scene('reveal', '관아 · 같은 사실 앞에서', 'office', [
    ['narrator', '군관이 우리를 관아로 안내했다. 방에 들어서자 그가 내게 허리를 굽혔다. “전하.” 청년이 걸음을 멈췄다.', 'tense', 'youth'],
    ['youth', '전하를 몰라뵈었습니다. 제가 아까…….', 'tense'],
    ['sukjong', '아까 하던 말 때문에 그러는가? 괜찮네. 있는 대로 말하면 되네.']
  ], 'deliberate_0');
  scene('deliberate', '관아 · 같은 사실 앞에서', 'office', [
    ['merchant', '저 청년이 때렸다는 말은 아닙니다. 그래도 문을 막은 일까지 없던 일이 되지는 않겠지요?'],
    ['youth', '그러면 제가 때리지 않았다는 말도 함께 적어 주십시오.', 'tense'],
    ['officer', '둘 다 적겠습니다. 다만 때릴 줄 알고 문을 지켰는지는 더 물어봐야 합니다.'],
    ['narrator', '군관은 두 사람의 말을 적고 붓을 멈췄다. 세 사람 모두 내 답을 기다렸다.']
  ], 'verdict');
  const endings = {
    leniency: { id: 'E01', title: '사정을 살핀다는 것', label: '가담 책임은 묻되, 사정을 살펴 감경을 검토하라.', reactions: [
      ['청년', '예. 처음부터 말씀드리겠습니다.'], ['상인', '저도 듣겠습니다. 왜 하필 제 가게였는지.'] ] },
    differentiate: { id: 'E02', title: '문 앞에 선 책임', label: '확인된 가담과 직접 폭행을 구분해 처분을 지시하라.', reactions: [
      ['청년', '주인장, 아까 말씀해 주셔서…… 고맙습니다.'], ['상인', '없는 죄를 보탤 생각은 없다.'] ] },
    defer: { id: 'E03', title: '아직 묻지 못한 말', label: '폭행을 미리 알았는지 더 조사한 뒤 처분하라.', reactions: [
      ['청년', '그럼 오늘은 못 돌아갑니까?'], ['상인', '저는 가 봐도 되겠습니까? 가게를 비워 두고 와서요.'] ] }
  };
  nodes.verdict = { type: 'verdict', title: '어떤 지시를 내릴 것인가', bg: 'office', who: 'sukjong', face: 'resolute', thought: true,
    text: '청년은 문을 지킨 일을 인정했다. 이제 어떻게 처리할지 정해야 한다.',
    facts: ['청년은 금품 강탈을 알고 문밖을 지켰다고 인정했다.', '상인은 직접 폭행한 자가 따로 있었다고 진술했다.', '청년이 폭행을 미리 알았는지, 다른 가담자들의 개별 행위는 아직 확인되지 않았다.', '상인은 돈과 천을 잃었다. 피해는 아직 회복되지 않았다.'],
    choices: Object.entries(endings).map(([verdict, e]) => ({ text: e.label, next: `${e.id}_0`, verdict })) };
  scene('E01', '관아 · 사정을 살핀다는 것', 'office', [
    ['sukjong', '군관, 이 청년의 사정을 더 들어 보아라. 벌을 줄일 만한 까닭이 있는지도 살피고.', 'resolute'],
    ['youth', endings.leniency.reactions[0][1], 'tense'],
    ['merchant', endings.leniency.reactions[1][1], 'tense'],
    ['youth', '주인장도 여기 계십니까?', 'tense'],
    ['merchant', '그럼 내가 나가 있으랴?', 'tense'],
    ['narrator', '청년이 내 눈치를 보았다. 나는 그대로 앉아 기다렸다. 청년은 상인을 향해 돌아앉더니 다시 입을 열었다.', 'tense', 'youth']
  ], 'E01_done');
  scene('E02', '관아 · 문 앞에 선 책임', 'office', [
    ['sukjong', '문을 지킨 일로 벌을 정하되, 직접 때린 자와는 구별하라.', 'resolute'],
    ['youth', endings.differentiate.reactions[0][1], 'tense'],
    ['merchant', endings.differentiate.reactions[1][1], 'tense'],
    ['merchant', '이제 제 물건도 좀 찾아 주십시오. 팔아넘기기 전에요.'],
    ['officer', '없어진 물건을 다시 짚어 주시겠습니까?'],
    ['narrator', '상인이 손가락을 하나씩 접으며 천의 종류를 댔다. 청년은 그 옆에서 고개를 들지 않았다.', 'neutral', 'merchant']
  ], 'E02_done');
  scene('E03', '관아 · 아직 묻지 못한 말', 'office', [
    ['sukjong', '다른 자들의 말도 받아 보아라. 때릴 줄 알고 있었는지는 그 말들과 맞춰 본 뒤에 판단하겠다.', 'resolute'],
    ['youth', endings.defer.reactions[0][1], 'tense'],
    ['merchant', endings.defer.reactions[1][1], 'tense'],
    ['sukjong', '가 보시오. 더 물을 게 생기면 사람을 보내겠소.'],
    ['narrator', '상인은 허리를 숙이고 나갔다. 청년은 문이 닫힐 때까지 그 뒤를 바라보았다.', 'tense', 'youth'],
    ['youth', '집에는 누가 좀 알려 주시면 안 됩니까?', 'tense']
  ], 'E03_done');
  for (const [verdict, e] of Object.entries(endings)) nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: 'office', verdict };
  after('intro_1', [
    ['sukjong', '이 담은 아까도 본 것 같은데.']
  ]);
  after('intro_3', [
    ['officer', '아까도 말씀드렸습니다.']
  ]);
  after('intro_7', [
    ['sukjong', '고맙네. 자네가 없었으면 밤새 돌 뻔했어.'],
    ['youth', '별말씀을요. 조심해서 가십시오.']
  ]);
  after('meet_0', [
    ['officer', '포목상에서 돈과 천을 빼앗아 갔습니다. 문밖에서 망을 보던 자 하나를 붙잡았습니다.'],
    ['sukjong', '우리가 지나간 곳 아니냐. 내가 가 보겠다.'],
    ['narrator', '다시 평상복을 걸치고 군관을 따라갔다. 가게 앞에 붙잡혀 서 있는 얼굴이 낯익었다.', 'tense', 'youth']
  ]);
  after('meet_2', [
    ['narrator', '청년이 입을 떼려는데, 가게 안에서 한 사내가 나왔다. 한쪽 소매가 찢어져 있었다.', 'tense', 'merchant']
  ]);
  after('meet_5', [
    ['merchant', '다른 놈들이 돈과 천을 들고 나가기에 붙잡으려다 맞았지요.'],
    ['narrator', '상인이 한쪽 소매를 쓸어내렸다. 나는 청년을 바라보았다.', 'neutral', 'merchant']
  ]);
  after('official_0', [
    ['youth', '전하를 몰라뵈었습니다.', 'tense'],
    ['sukjong', '됐네. 두 사람 다 안으로 들지.'],
    ['narrator', '관아의 작은 방에 들어가자 군관이 문서를 펼쳤다. 청년은 내 얼굴을 보다가 얼른 눈을 내렸다.', 'tense', 'youth']
  ]);
  after('private_8', [
    ['narrator', '청년이 입을 열었다가 다물었다. 나는 상인이 숨을 고를 때까지 기다렸다.', 'tense', 'youth']
  ]);
  after('awareness_0', [
    ['narrator', '나는 잠시 기다렸다. 청년은 더 말하지 않았다. 군관에게 눈을 돌렸다.', 'neutral', 'officer']
  ]);
  after('assault_1', [
    ['narrator', '상인이 청년 쪽으로 몸을 돌렸다.', 'tense', 'merchant']
  ]);
  after('assault_2', [
    ['narrator', '청년은 입술을 다물었다. 상인도 더 몰아붙이지 않았다.', 'tense', 'youth']
  ]);
  after('reveal_2', [
    ['narrator', '청년이 숙였던 고개를 들었다. 상인이 청년과 나를 번갈아 보더니 입을 열었다.', 'neutral', 'merchant']
  ]);
  after('deliberate_0', [
    ['sukjong', '그럴 일은 없소. 저 청년도 문을 지킨 일은 인정했으니.']
  ]);
  after('E01_1', [
    ['narrator', '청년이 내 쪽으로 몸을 기울였다. 상인이 의자를 당겨 앉자, 막 꺼내려던 말이 멎었다.', 'tense', 'youth']
  ]);
  after('E02_2', [
    ['narrator', '청년이 고개를 숙였다. 상인은 군관 쪽으로 돌아섰다.', 'neutral', 'merchant']
  ]);
  after('E03_1', [
    ['officer', '아직은 안 된다.']
  ]);
  after('E03_5', [
    ['officer', '어디 사는지 말해라. 사람을 보내마.']
  ]);
  window.NIGHT_STORY = { nodes, cast, endings, first: 'intro_0' };
})();
