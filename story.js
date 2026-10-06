/* 대사는 전부 창작입니다. 사료와의 구분은 게임 안의 기록 비교에서 제공합니다. */
(() => {
  const nodes = {};
  function scene(id, title, bg, lines, next) {
    lines.forEach(([who, text, face = 'neutral'], i) => {
      nodes[`${id}_${i}`] = { type: 'line', title, bg, who, text, face,
        next: i + 1 < lines.length ? `${id}_${i + 1}` : next };
    });
  }
  const cast = {
    narrator: { name: '그날의 기록', role: '', image: null },
    sukjong: { name: '숙종', role: '평상복 차림의 왕', image: 'sukjong' },
    youth: { name: '청년', role: '어젯밤 길을 알려 준 사람', image: 'youth' },
    merchant: { name: '상인', role: '포목상의 주인', image: 'merchant' },
    officer: { name: '군관', role: '왕의 신분을 아는 수행자', image: 'officer' }
  };
  scene('intro', '첫째 날 · 밤 골목', 'alley', [
    ['sukjong', '궁에서 전해 듣던 사정을, 오늘은 직접 듣고 싶었다.'],
    ['narrator', '돌아가는 길이었다. 군관은 내 뜻을 알고 거리를 두어 뒤따랐다.'],
    ['sukjong', '큰길은 저쪽이냐. 아까도 이 담을 본 듯한데.'],
    ['youth', '이 담을 따라가십시오. 끝에서 큰길이 나옵니다.'],
    ['sukjong', '담이 아니라 내가 빙빙 돌았구나.'],
    ['youth', '처음 오시면 그럴 수 있습니다. 이제 갈림길은 없습니다.'],
    ['sukjong', '말까지 고맙게 하는군. 잘 가 보마.'],
    ['narrator', '나는 그가 알려 준 길로 돌아갔다. 그 문 안에서 무슨 일이 벌어지는지는 알지 못했다.']
  ], 'meet_0');
  scene('meet', '이튿날 · 포목상 앞', 'shop', [
    ['narrator', '이튿날, 군관은 어젯밤 그 골목의 포목상이 습격당했다고 보고했다. 붙잡힌 청년은 문밖을 지켰다고 했다. 나는 현장 확인에 동행했다.'],
    ['youth', '어젯밤 길을 물으셨던 분이군요.'],
    ['sukjong', '어제 덕분에 길은 찾았네. 그런데 자네가…….'],
    ['merchant', '저는 그 문으로 나가지도 못했습니다.', 'tense'],
    ['sukjong', '……내 이야기를 먼저 했군. 무슨 일이었소?', 'resolute'],
    ['merchant', '저자가 문 앞을 지켰습니다. 안에서는 돈을 가져갔지요. 돈만이 아닙니다. 천도 가져갔습니다.'],
    ['narrator', '나는 하려던 말을 멈추고 상인의 말을 들었다.'],
    ['youth', '문밖에 있었습니다. 안으로 들어간 건 아니고요.', 'tense'],
    ['officer', '현장에서 확인할 것이 남았습니다. 문답은 제가 지켜보겠습니다.']
  ], 'route');
  nodes.route = { type: 'choice', title: '누구로 물을 것인가', bg: 'shop', who: 'sukjong',
    text: '군관은 내 뜻을 기다렸다. 청년과 상인은 아직 내가 누구인지 모른다.',
    choices: [
      { text: '왕으로서 조사 내용을 묻는다.', next: 'official_0', route: 'official' },
      { text: '어젯밤 만난 사람으로서 먼저 말을 건넨다.', next: 'private_0', route: 'private' }
    ] };
  scene('official', '이튿날 · 공개 조사', 'office', [
    ['narrator', '나는 군관을 불렀다. 그가 예를 갖추어 “전하”라고 답하자, 두 사람의 시선이 내게 쏠렸다. 우리는 관아의 작은 방으로 자리를 옮겼다.'],
    ['sukjong', '자, 확인한 것부터 듣자. 이 청년은 무슨 일을 했느냐.'],
    ['officer', '전하, 청년은 돈을 빼앗는 줄 알고 문밖을 지켰다고 말했습니다.', 'tense'],
    ['youth', '어젯밤 뵌 분이 전하셨습니까…….', 'tense'],
    ['sukjong', '어제처럼 말해도 된다. 다만 한 일은 빼놓지 말고.'],
    ['youth', '사람이 오나 살폈습니다. 돈을 빼앗는다는 것도 알았습니다.', 'tense'],
    ['officer', '때린 자는 따로 있었다는 진술입니다. 미리 알고 있었는지는 아직 모릅니다.']
  ], 'questions');
  scene('private', '이튿날 · 남겨 둔 이름', 'shop', [
    ['narrator', '내가 먼저 묻겠다고 군관에게 조용히 알렸다. 그는 신분을 드러내지 않은 채 한 걸음 물러서 문답을 지켜보았다.'],
    ['youth', '제 말을 들으러 오셨습니까?'],
    ['sukjong', '그래. 문 앞에서 뭘 했는지 네게 듣고 싶네.'],
    ['youth', '저는 문밖에만 있었습니다. 안에는 들어가지 않았고…….', 'tense'],
    ['sukjong', '그건 들었네. 밖에서는 무엇을 했나?', 'resolute'],
    ['youth', '사람이 오나 살폈습니다. 돈을 빼앗는다는 것도 알았습니다.', 'tense'],
    ['sukjong', '그러면 어젯밤 나를 다른 길로 보낸 것도…….', 'resolute'],
    ['youth', '사람이 들어오지 못하게 하라고 했습니다. 다치실 수도 있었고요.', 'tense'],
    ['merchant', '그동안 저는 나올 수가 없었고요.', 'tense']
  ], 'questions');
  nodes.questions = { type: 'questions', title: '문 안과 문밖', bg: 'route', who: 'sukjong',
    text: '문밖에 있었다는 말은 들었다. 이제 어떤 일을 알고 있었는지, 누가 무엇을 했는지 나누어 들어야 한다.',
    choices: [
      { text: '안에서 폭행이 있을 줄도 알았느냐?', next: 'awareness_0', answer: 'awareness_2' },
      { text: '직접 때린 자는 누구였느냐?', next: 'assault_0', answer: 'assault_2' }
    ] };
  scene('awareness', '문 안과 문밖', 'route', [
    ['youth', '돈을 빼앗는다는 말은 들었습니다. 때리는 것까지는…….', 'tense'],
    ['sukjong', '잠깐. 때릴 줄은 몰랐다는 말이냐, 때린 걸 못 봤다는 말이냐?', 'resolute'],
    ['officer', '그 부분은 아직 다른 진술과 맞춰 보지 못했습니다. 더 확인하겠습니다.']
  ], 'questions');
  scene('assault', '문 안과 문밖', 'route', [
    ['merchant', '때린 자는 따로 있었습니다. 제가 본 대로 말씀드리는 겁니다. 이 사람은 문 앞에 있었고요.'],
    ['youth', '저는 손을 대지 않았습니다.', 'tense'],
    ['merchant', '문 앞을 지킨 사람이 없었다면, 내가 나올 수는 있었겠지.', 'tense']
  ], 'questions');
  scene('reveal', '관아 · 같은 사실 앞에서', 'office', [
    ['narrator', '우리는 관아로 자리를 옮겼다. 군관이 “전하”라고 부르자 청년의 말이 멎었다. 나는 여전히 같은 평상복 차림이었다.'],
    ['youth', '나리께 드린 말씀이…….', 'tense'],
    ['sukjong', '듣고 있었네. 내가 누구든, 자네가 한 일이 달라지지는 않지.']
  ], 'deliberate_0');
  scene('deliberate', '관아 · 같은 사실 앞에서', 'office', [
    ['merchant', '누가 때렸는지는 가려 주십시오. 빼앗긴 것도 찾아 주시고요.'],
    ['youth', '문 앞에 선 건 맞습니다. 그렇지만 직접 때린 것까지 제 일이 되지는 않겠지요?', 'tense'],
    ['officer', '문을 지킨 일은 인정했습니다. 폭행을 미리 알았는지는 더 확인해야 합니다.'],
    ['narrator', '어젯밤의 친절도, 오늘의 가담도 같은 사람의 일이었다. 하지만 길을 알려 준 일은 이 사건의 처분 근거가 될 수 없었다.']
  ], 'verdict');
  const endings = {
    leniency: { id: 'E01', title: '사정을 살핀다는 것', label: '가담 책임은 묻되, 사정을 살펴 감경을 검토하라.', reactions: [
      ['청년', '그럼, 제 말을 더 들어 주시는 겁니까?'], ['상인', '사정을 듣는 동안 제 손해도 함께 적어 주십시오.'] ] },
    differentiate: { id: 'E02', title: '문 앞에 선 책임', label: '확인된 가담과 직접 폭행을 구분해 처분을 지시하라.', reactions: [
      ['청년', '제가 손을 대지 않았다는 것도 적히는 것이지요?'], ['상인', '문 앞을 지킨 일도 빠뜨리지 마십시오.'] ] },
    defer: { id: 'E03', title: '아직 묻지 못한 말', label: '폭행을 미리 알았는지 더 조사한 뒤 처분하라.', reactions: [
      ['청년', '그러면 아직 끝난 것은 아니군요.'], ['상인', '다시 불러야 한다면 무엇을 확인할지 알려 주십시오.'] ] }
  };
  nodes.verdict = { type: 'verdict', title: '어떤 지시를 내릴 것인가', bg: 'office', who: 'sukjong', face: 'resolute',
    text: '확인한 일에 책임을 묻고, 아직 모르는 것은 구분해야 한다.',
    facts: ['청년은 금품 강탈을 알고 문밖을 지켰다고 인정했다.', '상인은 직접 폭행한 자가 따로 있었다고 진술했다.', '청년이 폭행을 미리 알았는지, 다른 가담자들의 개별 행위는 아직 확인되지 않았다.', '상인은 돈과 천을 잃었다. 피해는 아직 회복되지 않았다.'],
    choices: Object.entries(endings).map(([verdict, e]) => ({ text: e.label, next: `${e.id}_0`, verdict })) };
  scene('E01', '관아 · 사정을 살핀다는 것', 'office', [
    ['sukjong', '스스로 인정한 가담과 직접 한 일을 살펴, 감경할 사정이 있는지 아뢰어라.', 'resolute'],
    ['youth', endings.leniency.reactions[0][1], 'tense'],
    ['merchant', endings.leniency.reactions[1][1], 'tense'],
    ['officer', '확인한 가담은 그대로 두고, 참작할 사정은 따로 살피겠습니다.'],
    ['sukjong', '그렇게 하라. 오늘 내가 물을 것은 다 물었다.', 'resolute'],
    ['narrator', '군관은 청년의 사정을 적을 자리를 마련했다. 상인은 자리를 뜨지 않았다. 나는 군관에게 남은 일을 맡기고 방을 나섰다.']
  ], 'E01_done');
  scene('E02', '관아 · 문 앞에 선 책임', 'office', [
    ['sukjong', '문밖을 지킨 일과 직접 때린 일을 한데 묶지 마라. 확인한 가담부터 구분해 처리하라.', 'resolute'],
    ['youth', endings.differentiate.reactions[0][1], 'tense'],
    ['merchant', endings.differentiate.reactions[1][1], 'tense'],
    ['officer', '두 진술을 구분해 적겠습니다. 직접 때렸다는 진술은 이 청년에게 붙이지 않겠습니다.'],
    ['sukjong', '확인되지 않은 일까지 보태지 마라. 나머지는 네가 맡아라.', 'resolute'],
    ['narrator', '군관이 청년의 가담과 폭행자의 행위를 나누어 읽자, 상인은 자기 말이 빠지지 않았는지 들었다. 나는 그 목소리를 뒤로하고 방을 나섰다.']
  ], 'E02_done');
  scene('E03', '관아 · 아직 묻지 못한 말', 'office', [
    ['sukjong', '문밖에 선 일은 인정했다. 안에서 벌어질 일까지 알았는지 더 살피고 처분을 아뢰어라.', 'resolute'],
    ['youth', endings.defer.reactions[0][1], 'tense'],
    ['merchant', endings.defer.reactions[1][1], 'tense'],
    ['officer', '폭행을 미리 알았는지, 다른 가담자들은 무엇을 했는지부터 맞춰 보겠습니다.'],
    ['sukjong', '확인할 것은 정했다. 불필요하게 옥에 오래 묶어 두는 일은 없게 하라.', 'resolute'],
    ['narrator', '군관은 남은 조사 항목을 적고 지시를 확인했다. 나는 고개를 끄덕이고 문답을 마쳤다. 방을 나설 때까지 두 사람은 자리를 지키고 있었다.']
  ], 'E03_done');
  for (const [verdict, e] of Object.entries(endings)) nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: 'office', verdict };
  window.NIGHT_STORY = { nodes, cast, endings, first: 'intro_0' };
})();
