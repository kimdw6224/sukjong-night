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
  ], 'inspect');
  nodes.inspect = { type: 'choice', title: '이튿날 · 포목상 앞', bg: 'shop', who: 'sukjong', thought: true,
    text: '묻기 전에 가게부터 보고 싶다. 어디부터 볼까.',
    choices: [
      { text: '청년이 서 있던 문 앞에 서 본다.', next: 'doorway_look_0' },
      { text: '상인이 쫓아간 길을 따라 들어가 본다.', next: 'counter_look_0' }
    ] };
  scene('doorway_look', '이튿날 · 포목상 앞', 'shop', [
    ['narrator', '나는 청년에게 어젯밤 서 있던 자리를 물었다. 청년이 문 왼쪽 기둥 옆을 가리켰다.', 'neutral', 'youth'],
    ['narrator', '그 자리에 가서 서 보았다. 담길이 끝까지 한눈에 들어왔다.'],
    ['sukjong', '여기 서 있으면 누가 오는지 다 보이는군.'],
    ['merchant', '안에서는 안 보입니다. 문을 닫아 두면 바깥 기척도 잘 모르고요.', 'tense'],
    ['sukjong', '그럼 어젯밤 내가 이 앞을 몇 번 지나갔는지도 자네는 다 봤겠군.'],
    ['youth', '……두 번 지나가셨습니다.', 'tense'],
    ['officer', '세 번입니다.'],
    ['narrator', '나는 기둥 옆에서 물러났다. 군관이 내 다음 말을 기다렸다.', 'neutral', 'officer']
  ], 'route');
  scene('counter_look', '이튿날 · 포목상 안', 'shop', [
    ['narrator', '상인이 문을 열고 안으로 앞장섰다.', 'neutral', 'merchant'],
    ['merchant', '저는 여기 계산대에 앉아 있었습니다. 문이 열리더니 놈들이 한꺼번에 들어왔지요.'],
    ['narrator', '계산대 서랍이 빠진 채 바닥에 놓여 있었다. 뒤쪽 선반은 두 칸이 비어 있었다.'],
    ['merchant', '돈은 저 서랍에서, 천은 저 선반에서 가져갔습니다. 저는 문 쪽으로 쫓아가다 여기서 맞았고요.', 'tense'],
    ['narrator', '상인이 선 자리에서 문까지는 대여섯 걸음이었다.', 'neutral', 'merchant'],
    ['narrator', '나는 상인을 따라 다시 문밖으로 나왔다. 청년은 군관 옆에서 기다리고 있었다.', 'tense', 'youth']
  ], 'route');
  nodes.route = { type: 'choice', title: '누구로 물을 것인가', bg: 'shop', who: 'sukjong', thought: true,
    text: '청년은 나를 길을 묻던 나리로 여기는 눈치였다. 지금 신분을 밝힐까.',
    choices: [
      { text: '신분을 밝히고, 관아에서 조사한다.', next: 'official_0', route: 'official' },
      { text: '신분을 숨기고, 가게 앞에서 직접 묻는다.', next: 'private_0', route: 'private' }
    ] };
  scene('official', '이튿날 · 공개 조사', 'office', [
    ['narrator', '내가 고개를 끄덕이자 군관이 허리를 굽혔다. “전하.” 그 한마디에 청년이 뒤로 반걸음 물러섰다.', 'tense', 'youth'],
    ['sukjong', '군관, 이 청년이 한 일을 먼저 말해 보아라.'],
    ['officer', '돈을 빼앗는 줄 알고 문밖을 지켰다고 했습니다.', 'tense'],
    ['youth', '밖에 있으라고 해서…… 안에는 들어가지 않았습니다.', 'tense'],
    ['sukjong', '밖에서 뭘 하라고 했느냐?'],
    ['youth', '사람이 오면 돌려보내라고 했습니다. 안에서 돈을 가져온다는 것도 알았습니다.', 'tense'],
    ['officer', '문을 지켰다는 말은 처음 조사할 때도 했습니다. 때릴 줄도 알고 있었는지는 아직 확인하지 못했습니다.']
  ], 'official_loss_0');
  scene('official_loss', '이튿날 · 공개 조사', 'office', [
    ['sukjong', '주인장, 잃은 것을 하나씩 말해 보시오.'],
    ['merchant', '엽전 꾸러미 둘, 무명 세 필, 명주 두 필입니다.'],
    ['merchant', '명주는 혼사를 앞둔 댁에서 맞춰 둔 겁니다. 보름 뒤에 보내기로 했고요.'],
    ['sukjong', '보름이면 다시 떼어 올 수는 있겠소?'],
    ['merchant', '그 돈도 가게 서랍에 두었는데 같이 가져갔습니다.', 'tense'],
    ['officer', '명주 빛깔과 폭을 적어 두겠습니다. 시장에 나오면 알아보게요.'],
    ['merchant', '빛깔은 제가 보면 압니다.']
  ], 'followup');
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
  ], 'private_motive_0');
  scene('private_motive', '이튿날 · 남겨 둔 이름', 'shop', [
    ['sukjong', '그자들하고는 어떻게 아는 사인가?'],
    ['youth', '장터에서 같이 짐을 나릅니다. 다 저보다 나이가 많습니다.'],
    ['sukjong', '문 앞에 서 있으면 뭘 준다던가?'],
    ['youth', '몫을 떼어 준다고 했습니다.', 'tense'],
    ['sukjong', '싫다고는 안 했나?'],
    ['youth', '그 사람들한테 싫다고 해 본 적이 없습니다.', 'tense'],
    ['sukjong', '몫은 받았고?'],
    ['youth', '아직요. 끝나고 장터에서 준다고 했는데, 그 전에 잡혔습니다.'],
    ['merchant', '그 몫이 내 돈이다.', 'tense'],
    ['youth', '……압니다.', 'tense']
  ], 'followup');
  // 가게에서 직접 본 곳에 따라 추가 질문이 달라집니다. 조사 기록이 없는 예전 저장은 바로 질문으로 갑니다.
  nodes.followup = { type: 'branch', title: '문 안과 문밖', bg: 'route',
    paths: [{ seen: 'inspect#0', next: 'doorway_question_0' }, { seen: 'inspect#1', next: 'counter_question_0' }],
    next: 'questions' };
  scene('doorway_question', '문 안과 문밖', 'route', [
    ['sukjong', '그 자리에 서 있을 때 문은 닫혀 있었나?'],
    ['youth', '예. 그 사람들이 들어가고 나서 닫았습니다.'],
    ['sukjong', '안에서 무슨 소리는 안 났나?'],
    ['youth', '뭐가 넘어지는 소리는 들렸습니다.', 'tense'],
    ['sukjong', '그래서 어떻게 했나?'],
    ['youth', '……그냥 서 있었습니다. 금방 나온다고 했으니까요.', 'tense'],
    ['merchant', '넘어진 게 나다.', 'tense']
  ], 'questions');
  scene('counter_question', '문 안과 문밖', 'route', [
    ['sukjong', '주인장, 맞고 일어났을 때 그자들은 어디 있었소?'],
    ['merchant', '벌써 문밖이었습니다. 따라 나가 보니 저 녀석만 문 앞에 서 있더군요.'],
    ['sukjong', '자네는 왜 같이 안 갔나?'],
    ['youth', '……발이 안 떨어졌습니다.', 'tense'],
    ['merchant', '그래서 내가 붙잡았지.', 'tense'],
    ['youth', '도망칠 생각은 없었습니다.', 'tense'],
    ['merchant', '그 말은 붙잡히고 나서 했고.']
  ], 'questions');
  nodes.questions = { type: 'questions', title: '문 안과 문밖', bg: 'route', who: 'sukjong', thought: true,
    text: '청년이 직접 때렸는지, 폭행을 미리 알고 있었는지 확인해야 한다.',
    afterAnswer: {
      awareness_2: '다른 자들에게도 물어봐야겠군. 우선 주인장이 본 것부터 듣자.',
      assault_2: '직접 때린 자는 따로 있었군. 청년은 그런 일이 벌어질 줄 알았을까.'
    },
    choices: [
      { text: '사람을 때릴 줄도 알고 있었나?', next: 'awareness_0', answer: 'awareness_2' },
      { text: '주인장을 때린 자가 이 청년이오?', next: 'assault_0', answer: 'assault_2' }
    ] };
  scene('awareness', '문 안과 문밖', 'route', [
    ['youth', '몰랐습니다. 돈과 천만 가져온다고 했습니다.', 'tense'],
    ['sukjong', '군관, 그자들에게도 물었나?', 'resolute'],
    ['officer', '그 대목은 아직 못 물었습니다.']
  ], 'questions');
  scene('assault', '문 안과 문밖', 'route', [
    ['merchant', '아닙니다. 저를 때린 놈은 따로 있습니다.'],
    ['youth', '들으셨지요? 저는 손 안 댔습니다.', 'tense'],
    ['narrator', '청년이 나를 보았다. 나는 상인에게 말을 계속하라고 손짓했다.', 'neutral', 'merchant']
  ], 'questions');
  scene('reveal', '관아 · 같은 사실 앞에서', 'office', [
    ['narrator', '군관이 우리를 관아로 안내했다. 방에 들어서자 그가 내게 허리를 굽혔다. “전하.” 청년이 걸음을 멈췄다.', 'tense', 'youth'],
    ['youth', '전하를 몰라뵈었습니다. 제가 아까…….', 'tense'],
    ['sukjong', '아까 하던 말 때문에 그러는가? 괜찮네. 있는 대로 말하면 되네.']
  ], 'deliberate_0');
  scene('deliberate', '관아 · 같은 사실 앞에서', 'office', [
    ['merchant', '제 말은 다 했습니다.'],
    ['youth', '전하, 한 번만 봐주십시오.', 'tense'],
    ['merchant', '저는 처분까지 듣고 가겠습니다.', 'tense'],
    ['sukjong', '둘 다 잠시 기다리게.', 'resolute']
  ], 'verdict');
  const endings = {
    leniency: { id: 'E01', title: '관아 밖으로', label: '오늘은 집으로 돌려보내고, 다시 부르면 오게 한다.', reactions: [
      ['청년', '제가…… 집에 가도 됩니까?'], ['상인', '다시 안 나오면 어쩌시려고요?'] ] },
    differentiate: { id: 'E02', title: '가담한 죄', bg: 'shop', label: '문을 지킨 죄부터 처벌한다.', reactions: [
      ['청년', '집에 사람을 보내 주실 수 있습니까?'], ['상인', '저는 이제 가 봐도 되겠습니까?'] ] },
    defer: { id: 'E03', title: '다시 가게 앞으로', bg: 'shop', label: '처분을 미루고, 가게로 돌아가 다시 조사한다.', reactions: [
      ['청년', '지금 다시 가는 겁니까?'], ['상인', '그럼 제가 앞장서겠습니다.'] ] }
  };
  nodes.verdict = { type: 'verdict', title: '어떤 지시를 내릴 것인가', bg: 'office', who: 'sukjong', face: 'resolute', thought: true,
    text: '청년은 문을 지킨 일을 인정했다. 이제 어떻게 처리할지 정해야 한다.',
    facts: ['청년은 금품 강탈을 알고 문밖을 지켰다고 인정했다.', '상인은 직접 폭행한 자가 따로 있었다고 진술했다.', '청년이 폭행을 미리 알았는지, 다른 가담자들의 개별 행위는 아직 확인되지 않았다.', '상인은 돈과 천을 잃었다. 피해는 아직 회복되지 않았다.'],
    choices: Object.entries(endings).map(([verdict, e]) => ({ text: e.label, next: `${e.id}_0`, verdict })) };
  scene('E01', '관아 밖으로', 'office', [
    ['sukjong', '사는 곳을 확인하고 오늘은 돌려보내라. 다시 부르면 반드시 나와야 한다.', 'resolute'],
    ['youth', endings.leniency.reactions[0][1], 'tense'],
    ['merchant', endings.leniency.reactions[1][1], 'tense'],
    ['sukjong', '주소를 확인하고 사람을 보내게 하겠소. 물건 찾는 일도 계속할 것이오.'],
    ['youth', '부르시면 오겠습니다.'],
    ['narrator', '군관이 주소를 받아 적고 문을 열어 주었다. 청년이 나간 뒤에도 상인은 자리를 뜨지 않았다.', 'tense', 'merchant']
  ], 'E01_epilogue_0');
  scene('E01_epilogue', '관아 밖으로', 'office', [
    ['narrator', '이틀 뒤 아침, 청년이 관아 문 앞에 와 있었다. 군관이 그를 데리고 들어왔다.', 'neutral', 'youth'],
    ['sukjong', '부르러 사람을 보냈는데 벌써 왔나?'],
    ['youth', '기다리고 있기가 그래서 먼저 나왔습니다.'],
    ['sukjong', '왔으면 됐네. 기억나는 이름부터 대 보게.'],
    ['officer', '여기 앉아라. 장터에서 어디서 만났는지도 말하고.'],
    ['youth', '어제 집에 가서 생각해 봤습니다. 말씀드릴 게 더 있습니다.'],
    ['narrator', '청년이 장터에서 만난 사람들의 이름을 댔다. 군관은 하나씩 받아 적으며 다시 물었다.', 'neutral', 'youth']
  ], 'E01_done');
  scene('E02', '가담한 죄', 'office', [
    ['sukjong', '문을 지킨 죄부터 다스려라. 직접 때린 자와 같은 벌을 주지는 말고.', 'resolute'],
    ['youth', endings.differentiate.reactions[0][1], 'tense'],
    ['merchant', endings.differentiate.reactions[1][1], 'tense'],
    ['officer', '자, 일어나라. 집에는 내가 전해 주마.'],
    ['narrator', '청년이 천천히 일어났다. 군관이 그의 팔을 잡았다.', 'tense', 'youth'],
    ['narrator', '청년은 군관에게 이끌려 안쪽 문으로 들어갔다. 상인은 반대쪽 마당으로 나갔다.']
  ], 'E02_epilogue_0');
  scene('E02_epilogue', '사흘 뒤 · 포목상 앞', 'shop', [
    ['narrator', '사흘 뒤, 나는 군관과 함께 포목상에 들렀다.'],
    ['narrator', '포목상은 문을 열어 두고 있었다. 상인이 천을 접다가 나를 보고 일어섰다.', 'neutral', 'merchant'],
    ['merchant', '여기까지 어쩐 일이십니까?'],
    ['sukjong', '지나가던 길이오.'],
    ['officer', '일부러 오셨습니다.'],
    ['merchant', '단골들이 소문 듣고 하나씩 팔아 주고 갔습니다. 그래도 빈 칸은 아직 그대로입니다.'],
    ['officer', '청년이 댄 이름으로 둘을 찾아갔습니다. 아직 잡지는 못했습니다.'],
    ['merchant', '잡히면 저도 불러 주십시오.']
  ], 'E02_done');
  scene('E03', '다시 가게 앞으로', 'office', [
    ['sukjong', '처분은 미루겠다. 가게로 돌아가서 어디에 있었는지 다시 짚어 보자.', 'resolute'],
    ['youth', endings.defer.reactions[0][1], 'tense'],
    ['merchant', endings.defer.reactions[1][1], 'tense'],
    ['narrator', '가게 앞에 도착하자 상인이 문을 열었다. 청년은 문틀 옆에서 멈췄다.', 'tense', 'youth'],
    ['youth', '저는 여기 있었습니다.', 'tense'],
    ['merchant', '나는 이 안쪽에 있었고.']
  ], 'E03_epilogue_0');
  scene('E03_epilogue', '다시 가게 앞으로', 'shop', [
    ['narrator', '문을 반쯤 닫자 계산대가 가려졌다. 활짝 열어야 안쪽까지 보였다.'],
    ['officer', '전하, 빈 서랍과 선반 칸을 주인장과 맞춰 적었습니다.'],
    ['merchant', '맞은 자리도 짚어 드렸습니다. 문에서 대여섯 걸음 안쪽입니다.'],
    ['sukjong', '문이 닫혀 있었다면 문 앞에선 그게 안 보였겠군.'],
    ['officer', '안 보였을 수는 있습니다. 때릴 줄 미리 알았는지는 남은 자들을 잡아 물어야 합니다.'],
    ['sukjong', '그럼 잡으러 가세.'],
    ['officer', '그건 저희가 하겠습니다. 전하는 궁으로 드십시오. 길은 제가 안내하겠습니다.']
  ], 'E03_done');
  for (const id of ['E03_3', 'E03_4', 'E03_5']) nodes[id].bg = 'shop';
  for (const [verdict, e] of Object.entries(endings)) nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: e.bg || 'office', verdict };
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
  after('meet_7', [
    ['narrator', '상인은 바닥에 떨어진 천을 주워 접었다. 찢어진 소매가 걸리자 손을 멈추고 팔부터 빼냈다.', 'tense', 'merchant'],
    ['sukjong', '팔은 괜찮소?'],
    ['merchant', '접는 건 됩니다. 펼칠 때가 좀…….', 'tense'],
    ['narrator', '상인이 다 접지 못한 천을 계산대 위에 올려놓았다.', 'neutral', 'merchant']
  ]);
  after('official_6', [
    ['officer', '청년은 몫을 나눠 받기로 했다고도 말했습니다.'],
    ['sukjong', '얼마나 받기로 했느냐?'],
    ['youth', '얼마인지는 정해 주지 않았습니다.', 'tense']
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
    ['sukjong', '누구한테 들었나?'],
    ['youth', '안에 들어간 자들에게 직접 들었습니다.', 'tense']
  ]);
  after('assault_1', [
    ['merchant', '가만있어라. 내게 묻고 계시잖느냐.', 'tense']
  ]);
  after('assault_2', [
    ['merchant', '저 청년은 문 앞에 있었습니다. 제가 본 건 거기까지입니다.']
  ]);
  after('reveal_2', [
    ['narrator', '청년이 숙였던 고개를 들었다. 상인이 청년과 나를 번갈아 보더니 입을 열었다.', 'neutral', 'merchant']
  ]);
  after('deliberate_0', [
    ['narrator', '상인이 뒤로 물러서자 청년이 급히 내 앞으로 나왔다.', 'tense', 'youth']
  ]);
  after('E01_1', [
    ['officer', '사는 곳부터 대라. 부르면 바로 나와야 한다.']
  ]);
  after('E02_2', [
    ['sukjong', '주인장은 돌아가시오. 물건은 계속 찾게 하겠소.']
  ]);
  after('E03_1', [
    ['sukjong', '그래. 자네가 서 있던 자리를 보여 주게.']
  ]);
  after('E03_5', [
    ['sukjong', '군관은 주인장과 안으로 들어가 보아라.'],
    ['narrator', '군관과 상인이 가게 안으로 들어갔다. 나는 청년 옆에 서서 안이 얼마나 보이는지 살폈다.']
  ]);
  // 두 사람이 주고받는 장면은 함께 세웁니다. 짝에 없는 인물이 말하는 줄은 기본 표시를 따릅니다.
  function pair(ids, ...prefixes) {
    for (const [id, node] of Object.entries(nodes)) {
      if (node.type !== 'line' || !prefixes.some(p => id === p || id.startsWith(`${p}_`))) continue;
      if (node.who === 'narrator' ? !node.focus || ids.includes(node.focus) : ids.includes(node.who)) node.pair = ids;
    }
  }
  pair(['sukjong', 'officer'], 'intro_0', 'intro_1', 'intro_2', 'intro_3');
  pair(['sukjong', 'youth'], 'intro_4', 'intro_5', 'intro_6', 'intro_7', 'meet_1', 'meet_2', 'doorway_look', 'private', 'private_motive',
    'doorway_question', 'awareness', 'reveal', 'E01_0', 'E01_1', 'E03_epilogue_0');
  pair(['sukjong', 'merchant'], 'meet_3', 'meet_4', 'meet_5', 'counter_look', 'official_loss', 'counter_question',
    'E02_epilogue_1', 'E02_epilogue_2', 'E02_epilogue_3');
  pair(['sukjong', 'youth'], 'E01_epilogue_0', 'E01_epilogue_1', 'E01_epilogue_2', 'E01_epilogue_3');
  pair(['youth', 'merchant'], 'meet_6', 'meet_7', 'assault', 'deliberate', 'E03_3', 'E03_4', 'E03_5');
  pair(['sukjong', 'merchant'], 'meet_7_reply');
  for (const id of ['meet_0_reply_2', 'doorway_look_1', 'E02_epilogue_0']) nodes[id].cue = 'steps';
  for (const id of ['counter_look_0', 'official_0_reply_2', 'reveal_0', 'E01_5', 'E03_3']) nodes[id].cue = 'door';
  window.NIGHT_STORY = { nodes, cast, endings, first: 'intro_0' };
})();
