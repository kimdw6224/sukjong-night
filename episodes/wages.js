/* 이 사건과 인물은 시대를 배경으로 만든 창작입니다. */
(() => {
  const { nodes, cast, endings, scene } = window.NIGHT_STORY;
  cast.wagesOwner = { name: '공방 주인', image: 'wages_owner' };
  cast.wagesWorker = { name: '일꾼', image: 'wages_worker' };
  const source = { title: '이야기의 배경', text: '품삯과 깨진 기물을 둘러싼 사건, 인물과 처분은 조선 시대를 배경으로 만든 창작입니다.' };
  const definitions = {
    wages_pay: { id: 'wages_pay', title: '먼저 건넨 품삯', label: '이견 없는 품삯부터 지급하게 한다.', reactions: [['일꾼', '그 돈이라도 오늘 받을 수 있습니까?'], ['공방 주인', '나머지는 그릇값을 살핀 뒤에 정해 주십시오.']] },
    wages_inquiry: { id: 'wages_inquiry', title: '남겨 둔 장부', label: '두 사람을 관아로 불러 증언을 대조한다.', reactions: [['일꾼', '그럼 오늘은 빈손으로 돌아가야 합니까?'], ['공방 주인', '장부와 그릇 조각도 가져가겠습니다.']] },
    wages_settle: { id: 'wages_settle', title: '다시 정한 약속', label: '두 사람이 지급액과 날짜를 정하도록 중재한다.', reactions: [['일꾼', '열 닢만 빼고 오늘 주시면 받겠습니다.'], ['공방 주인', '좋네. 쉰 닢은 지금 내주지.']] }
  };
  for (const [key, value] of Object.entries(definitions)) endings[key] = { ...value, episode: 'wages', source };
  scene('wages_intro', '공방 앞', 'alley', [
    ['narrator', '동문 공방 앞에서 두 사람이 궤짝을 사이에 두고 서 있었다.'],
    ['wagesWorker', '사흘 품삯을 주시기로 하지 않았습니까?'],
    ['wagesOwner', '그릇값은 어쩌고? 저걸 새로 맞추려면 돈이 든다.'],
    ['wagesWorker', '제가 깼다는 걸 보셨습니까?'],
    ['wagesOwner', '네가 안쪽을 치운 뒤에 깨진 걸 봤다.'],
    ['sukjong', '그 궤짝에 든 게 그릇 조각이오? 잠깐 보여 주겠소?'],
    ['wagesOwner', '깨진 그릇 조각입니다. 버리지 않고 모아 뒀습니다.'],
    ['sukjong', '일한 값은 얼마로 정했소?'],
    ['wagesOwner', '하루 스무 닢씩 사흘입니다. 예순 닢이지요.'],
    ['wagesWorker', '예. 한 닢도 못 받았습니다.', 'tense'],
    ['sukjong', '그릇값은 얼마를 빼겠다는 것이오?'],
    ['wagesOwner', '스무 닢을 생각했습니다. 나머지는 내줄 수 있습니다.'],
    ['narrator', '일꾼이 궤짝에서 손을 떼었다. 주인은 조각이 쏟아지지 않게 뚜껑을 닫았다.', 'neutral', 'wagesOwner'],
    ['sukjong', '그 돈을 빼기로 미리 얘기한 적은 있나?'],
    ['wagesWorker', '없었습니다. 일이 끝난 뒤에 처음 들었습니다.'],
    ['wagesOwner', '그릇이 더 깨질 줄은 저도 몰랐으니까요.']
  ], 'wages_inspect');
  nodes.wages_inspect = { type: 'choice', title: '공방 앞', bg: 'alley', who: 'sukjong', thought: true,
    text: '어느 쪽부터 살펴볼까.', choices: [
      { text: '장부에서 일한 날과 맡긴 물건을 살핀다.', next: 'wages_ledger_0' },
      { text: '그릇 조각을 보고 발견 순서를 묻는다.', next: 'wages_discovery_0' }
    ] };
  scene('wages_ledger', '공방 앞', 'alley', [
    ['wagesOwner', '여기 사흘치가 적혀 있습니다. 첫날은 아침부터 왔고, 나머지 이틀도 해 질 때까지 있었습니다.'],
    ['wagesWorker', '셋째 날에는 문짝까지 달았습니다.'],
    ['sukjong', '일한 날은 두 사람 말이 같구나. 먼저 받은 돈은 없고?'],
    ['wagesOwner', '없습니다. 일을 마치면 한꺼번에 주기로 했습니다.'],
    ['sukjong', '이 그릇은 이 사람이 오기 전날 맡긴 물건이오? 여기 금이 갔다고 적혀 있소.'],
    ['wagesOwner', '예. 그런데 지금은 조각이 더 났습니다.'],
    ['wagesWorker', '처음부터 금이 있었다는 말씀은 안 하셨잖습니까.', 'tense'],
    ['narrator', '장부 옆장에는 쌀가게 됫박 밑판 수리를 마쳤으나 대금은 받지 못했다는 표시가 남아 있었다.']
  ], 'wages_more_marks_0');
  scene('wages_discovery', '공방 앞', 'alley', [
    ['sukjong', '깨진 걸 맨 먼저 본 사람이 누구요?'],
    ['wagesOwner', '접니다. 저녁에 안쪽을 살피다가 봤습니다.'],
    ['sukjong', '깨지는 것도 봤소?'],
    ['wagesOwner', '그건 못 봤습니다. 일꾼이 그곳을 치운 건 봤고요.'],
    ['wagesWorker', '제가 치울 때는 그릇이 선반 위에 있었습니다.'],
    ['sukjong', '둘 중 누가 먼저 나왔나?'],
    ['wagesWorker', '제가 먼저 나왔습니다. 주인장은 안에 계셨고요.'],
    ['wagesOwner', '그릇이 언제 더 깨졌는지는 저도 모릅니다. 다만 선반을 치운 건 저 친구뿐이었습니다.'],
    ['narrator', '내가 조각 둘을 맞대자 금을 따라 덧댄 오래된 수리 자국이 드러났다.'],
    ['sukjong', '이건 새로 생긴 자국은 아니구려. 수리하려고 들여온 그릇이오?'],
    ['wagesOwner', '금이 가서 맡긴 건 맞습니다. 그렇다고 저렇게까지 부서져 있지는 않았습니다.']
  ], 'wages_more_entry_0');
  scene('wages_more_marks', '공방 앞', 'alley', [
    ['narrator', '나는 궤짝의 조각 둘을 맞대어 보았다. 금을 따라 덧댄 오래된 수리 자국이 있었다.'],
    ['wagesWorker', '저 자국을 봤더라면 저도 깨진 걸 알았을 겁니다.'],
    ['wagesOwner', '처음에는 금만 있었습니다. 누가 조각까지 냈는지는 여전히 모르지요.']
  ], 'wages_reveal_0');
  scene('wages_more_entry', '공방 앞', 'alley', [
    ['sukjong', '언제 맡긴 물건인지 장부를 봅시다.'],
    ['wagesOwner', '여기 있습니다. 저 친구가 일을 시작하기 전날 들어왔습니다.'],
    ['narrator', '옆장에는 쌀가게 됫박 밑판을 수리했으나 대금은 받지 못했다는 표시가 있었다.']
  ], 'wages_reveal_0');
  scene('wages_reveal', '공방 앞', 'alley', [
    ['narrator', '군관이 내 옆에 다가와 낮게 말했다.', 'neutral', 'officer'],
    ['officer', '전하, 날이 저뭅니다. 돌아가셔야 합니다.'],
    ['narrator', '주인이 군관의 말을 듣고 급히 허리를 굽혔다. 일꾼도 뒤따라 몸을 숙였다.', 'neutral', 'wagesWorker'],
    ['wagesWorker', '전하를 몰라뵈었습니다.'],
    ['sukjong', '놀라게 했군. 장부의 쌀가게 수리값도 아직 못 받았소?'],
    ['wagesOwner', '예. 밑판은 고쳐 보냈는데 대금이 들어오질 않았습니다. 가진 돈으로 품삯과 그릇 수리비를 다 내기가 막막했습니다.', 'tense'],
    ['sukjong', '그래서 수리하려고 받은 그릇값을 이 사람 품삯에서 빼려 한 것이오?'],
    ['wagesOwner', '조각이 더 난 건 누군가의 손을 탄 탓이라 생각했습니다. 돈이 모자랐던 것도 사실이고요.'],
    ['wagesOwner', '제가 스무 닢을 빼더라도 마흔 닢은 드릴 수 있습니다.'],
    ['wagesWorker', '저는 예순 닢을 받기로 했습니다. 그릇값까지 제가 내야 하는지는 모르겠습니다.', 'tense'],
    ['narrator', '주인은 장부를 덮었고, 일꾼은 내 손을 바라보았다.']
  ], 'wages_verdict');
  nodes.wages_verdict = { type: 'choice', title: '공방 앞', bg: 'alley', who: 'sukjong', thought: true,
    text: '일한 품삯과 그릇값을 어떻게 정할까.', choices: Object.entries(definitions).map(([verdict, e]) => ({ text: e.label, next: `${e.id}_0`, verdict })) };
  scene('wages_pay', '먼저 건넨 품삯', 'alley', [
    ['sukjong', '두 사람이 다 받을 수 있다고 말한 마흔 닢부터 내주시오. 남은 스무 닢은 더 살펴봅시다.'],
    ['wagesWorker', definitions.wages_pay.reactions[0][1], 'tense'],
    ['wagesOwner', definitions.wages_pay.reactions[1][1]],
    ['sukjong', '그렇게 합시다. 미리 빼기로 한 돈도 아니니 그냥 넘어갈 수는 없소.'],
    ['narrator', '주인은 품에서 돈을 꺼내 열 닢씩 네 번 세었다. 일꾼은 돈을 받아 주머니 안쪽에 넣었다.', 'neutral', 'wagesOwner'],
    ['wagesWorker', '나머지는 언제 와서 여쭤보면 됩니까?'],
    ['officer', '사흘 뒤 관아로 와라. 주인장께도 알리겠다.'],
    ['narrator', '사흘 뒤, 두 사람은 장부와 그릇 조각을 가지고 관아에 왔다. 군관이 마흔 닢을 건넨 날짜부터 물었다.', 'neutral', 'officer']
  ], 'wages_pay_done');
  scene('wages_inquiry', '남겨 둔 장부', 'alley', [
    ['sukjong', '두 사람 다 내일 관아에 오시오. 일을 마친 때부터 차례로 들어 봅시다.'],
    ['wagesWorker', definitions.wages_inquiry.reactions[0][1], 'tense'],
    ['wagesOwner', definitions.wages_inquiry.reactions[1][1]],
    ['sukjong', '일한 날을 아는 사람도 함께 오시오. 조각은 버리지 말고 가져오고.'],
    ['narrator', '일꾼은 빈 주머니에 손을 넣은 채 돌아섰다. 주인은 궤짝을 안으로 옮겼다.', 'neutral', 'wagesWorker'],
    ['narrator', '이튿날, 군관이 장부를 펴고 그릇 조각을 탁자 위에 놓았다.', 'neutral', 'officer'],
    ['officer', '주인장께서는 깨지는 걸 보지 못하셨다고 했지요?'],
    ['wagesOwner', '예. 제가 본 것부터 다시 말씀드리겠습니다.'],
    ['narrator', '일꾼은 탁자 건너편에 앉아 주인의 말을 들었다.', 'neutral', 'wagesWorker'],
    ['narrator', '함께 일한 사람의 말도 사흘이었다. 그릇이 깨지는 것을 본 사람은 끝내 나오지 않았다.'],
    ['wagesOwner', '품삯은 약속한 예순 닢을 내겠습니다. 그릇 일은 나중에 더 알아보지요.'],
    ['wagesWorker', '받은 날짜도 장부에 써 주십시오. 저도 보고 가겠습니다.']
  ], 'wages_inquiry_done');
  scene('wages_settle', '다시 정한 약속', 'alley', [
    ['sukjong', '마흔 닢은 주겠다고 했고 예순 닢을 달라고 했으니, 두 분이 받아들일 수 있는 액수를 말해 보시오.'],
    ['wagesWorker', definitions.wages_settle.reactions[0][1], 'tense'],
    ['wagesOwner', definitions.wages_settle.reactions[1][1]],
    ['sukjong', '오늘 쉰 닢을 건네고 이 일은 여기서 마치는 것으로 두 분 다 괜찮겠소?'],
    ['wagesWorker', '예. 그리하겠습니다.'],
    ['wagesOwner', '저도 좋습니다.'],
    ['narrator', '주인이 쉰 닢을 세어 건넸다. 일꾼도 한 닢씩 확인한 뒤 고개를 끄덕였다.', 'neutral', 'wagesWorker'],
    ['officer', '두 분이 오늘 합의하고 받은 일은 적어 두겠습니다.'],
    ['narrator', '며칠 뒤, 나는 골목에서 일꾼을 다시 보았다. 그가 비어 있는 손을 들어 인사하고 다음 일터로 걸어갔다.', 'neutral', 'wagesWorker']
  ], 'wages_settle_done');
  for (const [verdict, e] of Object.entries(definitions)) nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: verdict === 'wages_inquiry' ? 'office' : 'alley', verdict, episode: 'wages' };
  for (const [id, node] of Object.entries(nodes)) {
    if (!id.startsWith('wages_')) continue;
    node.episode = 'wages';
    if (node.type === 'line' && ['sukjong', 'wagesOwner', 'wagesWorker'].includes(node.who)) {
      node.pair = node.who === 'wagesOwner' ? ['sukjong', 'wagesOwner'] : ['sukjong', 'wagesWorker'];
    }
  }
  nodes.wages_intro_0.cue = 'steps';
  nodes.wages_pay_7.bg = 'office';
  nodes.wages_pay_done.bg = 'office';
  nodes.wages_inquiry_5.bg = 'office';
  nodes.wages_inquiry_6.bg = 'office';
  nodes.wages_inquiry_7.bg = 'office';
  nodes.wages_inquiry_8.bg = 'office';
  for (const id of ['wages_inquiry_9', 'wages_inquiry_10', 'wages_inquiry_11']) nodes[id].bg = 'office';
})();
