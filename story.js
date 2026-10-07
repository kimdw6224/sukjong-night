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
    ['sukjong', '오늘은 내 이름을 모르는 사람과 말을 섞어 보고 싶었다.'],
    ['narrator', '돌아가는 길이었다. 나는 같은 담 앞에 다시 섰다. 몇 걸음 뒤에서 군관도 걸음을 멈췄다.'],
    ['sukjong', '큰길은 저쪽이냐? 아까도 이 담을 본 듯한데.'],
    ['youth', '저쪽 말고 이 담을 따라가십시오. 끝에서 큰길이 나옵니다.'],
    ['sukjong', '하마터면 또 돌아갈 뻔했구나.'],
    ['youth', '네. 여기서부터는 갈림길이 없습니다.'],
    ['sukjong', '더 걷기 전에 물어보길 잘했네. 고맙다.'],
    ['narrator', '청년이 길을 비켜 주었다. 나는 그가 가리킨 담길로 들어섰다.']
  ], 'meet_0');
  scene('meet', '이튿날 · 포목상 앞', 'shop', [
    ['narrator', '이튿날 군관이 포목상에서 돈과 천을 빼앗긴 일을 보고했다. 문밖을 지키던 자를 붙잡았다고 했다. 어젯밤 내가 지나온 골목이었다.'],
    ['youth', '길은 잘 찾으셨습니까?'],
    ['sukjong', '찾았네. 금방이더군. 그런데 자네가 여기에…….'],
    ['merchant', '두 분은 아는 사이십니까?', 'tense'],
    ['sukjong', '어젯밤 길을 물었소. 그뿐이오. 주인장은 이 청년을 어떻게 아시오?'],
    ['merchant', '어젯밤 제 가게 문 앞을 막고 있던 자입니다.'],
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
      ['청년', '제 사정도 말씀드려도 됩니까?'], ['상인', '그 말만 듣고 풀어 주시는 건 아니겠지요?'] ] },
    differentiate: { id: 'E02', title: '문 앞에 선 책임', label: '확인된 가담과 직접 폭행을 구분해 처분을 지시하라.', reactions: [
      ['청년', '그럼 제가 직접 때렸다고 적히지는 않는 거지요?'], ['상인', '그건 내가 아니라고 했잖느냐. 문을 지킨 일도 빼지 말라는 거다.'] ] },
    defer: { id: 'E03', title: '아직 묻지 못한 말', label: '폭행을 미리 알았는지 더 조사한 뒤 처분하라.', reactions: [
      ['청년', '그럼 저는 또 기다려야 합니까?'], ['상인', '저도 다시 와야 합니까? 가게를 계속 비워 둘 수는 없습니다.'] ] }
  };
  nodes.verdict = { type: 'verdict', title: '어떤 지시를 내릴 것인가', bg: 'office', who: 'sukjong', face: 'resolute', thought: true,
    text: '청년은 문을 지킨 일을 인정했다. 이제 어떻게 처리할지 정해야 한다.',
    facts: ['청년은 금품 강탈을 알고 문밖을 지켰다고 인정했다.', '상인은 직접 폭행한 자가 따로 있었다고 진술했다.', '청년이 폭행을 미리 알았는지, 다른 가담자들의 개별 행위는 아직 확인되지 않았다.', '상인은 돈과 천을 잃었다. 피해는 아직 회복되지 않았다.'],
    choices: Object.entries(endings).map(([verdict, e]) => ({ text: e.label, next: `${e.id}_0`, verdict })) };
  scene('E01', '관아 · 사정을 살핀다는 것', 'office', [
    ['sukjong', '문을 지킨 책임은 물어라. 다만 사정을 더 듣고, 벌을 줄일 만한 이유가 있는지 아뢰어라.', 'resolute'],
    ['youth', endings.leniency.reactions[0][1], 'tense'],
    ['merchant', endings.leniency.reactions[1][1], 'tense'],
    ['officer', '인정한 가담은 그대로 적겠습니다. 사정을 듣는다고 지우지는 않습니다.'],
    ['sukjong', '주인장의 피해도 함께 적어라. 사정만 듣고 끝낼 일은 아니니.', 'resolute'],
    ['narrator', '군관이 새 종이를 펴고 청년을 불렀다. 상인은 그 옆에 자리를 잡았다. 나는 두 사람의 말을 군관에게 맡기고 방을 나섰다.']
  ], 'E01_done');
  scene('E02', '관아 · 문 앞에 선 책임', 'office', [
    ['sukjong', '문밖을 지킨 일과 직접 때린 일을 한데 묶지 마라. 확인한 가담부터 구분해 처리하라.', 'resolute'],
    ['youth', endings.differentiate.reactions[0][1], 'tense'],
    ['merchant', endings.differentiate.reactions[1][1], 'tense'],
    ['officer', '문을 지킨 일은 따로 적었습니다. 때린 자에게 물을 일과 섞지 않겠습니다.'],
    ['sukjong', '그렇게 하라. 적은 내용은 두 사람에게도 다시 읽어 주어라.', 'resolute'],
    ['narrator', '군관이 기록을 읽었다. 청년과 상인이 나란히 듣는 동안 나는 방을 나섰다.']
  ], 'E02_done');
  scene('E03', '관아 · 아직 묻지 못한 말', 'office', [
    ['sukjong', '때릴 줄도 알고 문을 지켰는지는 아직 모르겠구나. 그 대목을 더 확인한 뒤에 청년의 처분을 아뢰어라.', 'resolute'],
    ['youth', endings.defer.reactions[0][1], 'tense'],
    ['merchant', endings.defer.reactions[1][1], 'tense'],
    ['officer', '다른 자들의 말부터 맞춰 보겠습니다. 주인장께 더 물을 일이 있으면 따로 알리겠습니다.'],
    ['sukjong', '그렇게 하라. 기다리게 하더라도 까닭 없이 오래 묶어 두지는 마라.', 'resolute'],
    ['narrator', '군관은 다시 물을 대목에 표시했다. 상인은 일어서면서도 청년을 돌아보았다. 청년은 제 앞에 놓인 종이만 보고 있었다. 나는 군관에게 고개를 끄덕이고 나왔다.']
  ], 'E03_done');
  for (const [verdict, e] of Object.entries(endings)) nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: 'office', verdict };
  after('intro_3', [
    ['narrator', '청년이 내가 향하던 골목 앞에 서서 옆길을 가리켰다.', 'neutral', 'youth']
  ]);
  after('meet_0', [
    ['narrator', '상점에 도착하자 청년이 군관 곁에 서 있었다. 내가 다가가자 청년이 먼저 고개를 들었다.', 'neutral', 'youth']
  ]);
  after('meet_2', [
    ['narrator', '청년이 대답하려는데 상인이 내 앞으로 반걸음 나섰다.', 'tense', 'merchant']
  ]);
  after('meet_5', [
    ['merchant', '다른 놈들은 안에서 돈과 천을 가져갔습니다. 제가 붙잡으려다 맞았고요.'],
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
    ['sukjong', '군관에게 말하게. 가담한 일을 빼놓지는 말고.']
  ]);
  after('E02_2', [
    ['narrator', '청년이 상인을 올려다보았다. 상인은 더 말하지 않고 군관을 보았다.', 'neutral', 'officer']
  ]);
  after('E03_1', [
    ['sukjong', '그 말이 맞는지 확인은 해야겠네. 자네 말만으로 단정할 수는 없으니.']
  ]);
  nodes.intro_0.thought = true;
  window.NIGHT_STORY = { nodes, cast, endings, first: 'intro_0' };
})();
