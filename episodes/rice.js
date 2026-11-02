/* 장터 사건과 등장인물은 게임을 위해 지어낸 이야기입니다. */
(() => {
  const { nodes, cast, endings, scene } = window.NIGHT_STORY;
  cast.riceSeller = { name: '쌀가게 주인', image: 'rice_seller' };
  cast.riceBuyer = { name: '손님', image: 'rice_buyer' };

  scene('rice_intro', '장터', 'alley', [
    ['narrator', '장터 어귀에서 쌀자루를 든 사내와 가게 주인이 실랑이를 벌이고 있었다.', 'neutral', 'riceBuyer'],
    ['riceBuyer', '어제 분명히 한 말을 샀습니다. 집에 가서 되니 한 되가 모자라지 않습니까?'],
    ['riceSeller', '자루 입구를 제대로 묶지도 않고 가셨잖소. 오는 길에 흘렸겠지.'],
    ['riceBuyer', '흘렸으면 길바닥에서 쓸어 오기라도 했겠지요.', 'tense'],
    ['sukjong', '한 되가 모자라다니. 두 분이 같은 그릇으로 재셨소?'],
    ['officer', '가게에서 쓰는 됫박부터 보시지요.'],
    ['riceSeller', '보실 거면 들어오십시오. 됫박도 그대로 있습니다.'],
    ['narrator', '주인이 문을 열었다. 손님은 자루를 내려놓지 않은 채 따라 들어왔다.', 'neutral', 'riceSeller']
  ], 'rice_inspect');
  nodes.rice_inspect = { type: 'choice', title: '쌀가게', bg: 'shop', who: 'sukjong', thought: true,
    text: '무엇부터 살펴볼까.', choices: [
      { text: '가게의 됫박과 다른 됫박을 비교한다.', next: 'rice_measure_0' },
      { text: '쌀을 사고 판 순서를 두 사람에게 묻는다.', next: 'rice_sequence_0' }
    ] };
  scene('rice_measure', '쌀가게', 'shop', [
    ['sukjong', '군관, 이웃 가게에서 됫박 하나만 빌려 오게.'],
    ['riceSeller', '제 됫박을 의심하시는 겁니까?'],
    ['sukjong', '나란히 놓으면 알겠지. 서로 눈대중만 겨루는 것보다는 낫겠소.'],
    ['narrator', '군관이 가져온 됫박에 쌀을 평평하게 채우고, 그것을 주인의 됫박에 부었다.', 'neutral', 'officer'],
    ['officer', '남습니다. 이 됫박에는 끝까지 채워도 다 들어가지 않습니다.'],
    ['riceSeller', '그 됫박이 더 큰 건 아니고요?'],
    ['sukjong', '바닥을 한번 뒤집어 보게. 안쪽은 왜 이리 높지?'],
    ['narrator', '군관이 그릇을 기울였다. 안쪽 바닥 둘레에 새 나무를 덧댄 자국이 보였다.', 'neutral', 'officer'],
    ['riceSeller', '며칠 전 동문 공방에 밑판 수리를 맡겼습니다. 돌아온 뒤로는 어제 처음 썼고요.'],
    ['sukjong', '수리를 맡긴 표가 있으면 보여 주시오.']
  ], 'rice_reveal_0');
  scene('rice_sequence', '쌀가게', 'shop', [
    ['sukjong', '한 말이면 열 번을 담았을 텐데. 어느 분이 셌소?'],
    ['riceBuyer', '제가 자루를 벌리고 있었습니다. 주인장이 부을 때마다 세었고요.'],
    ['riceSeller', '열 번 다 부었습니다. 자루를 가져가실 때도 옆구리에 끼고 가셨지요.'],
    ['riceBuyer', '입구를 묶고 나서 들었습니다. 풀린 곳도 없었고요.'],
    ['sukjong', '그 자루를 이리 보여 주겠소?'],
    ['narrator', '손님이 자루를 펼쳤다. 입구의 끈은 남아 있었고 바닥에는 눈에 띄는 구멍이 없었다.', 'neutral', 'riceBuyer'],
    ['officer', '지금은 구멍이 보이지 않습니다. 어제 길에서 흘렸는지까지는 알 수 없습니다.'],
    ['riceSeller', '열 번 부은 건 사실입니다. 어제 공방에서 찾아와 처음 쓰는 그릇이었고요.'],
    ['sukjong', '공방에서 무엇을 고쳤나?'],
    ['riceSeller', '밑판입니다. 기다리십시오. 받아 둔 수리표가 있습니다.'],
    ['narrator', '주인이 계산대 서랍에서 수리표를 꺼냈다. “동문 공방·쌀가게 됫박 밑판 수리”라고 적혀 있었다.', 'neutral', 'riceSeller']
  ], 'rice_reveal_0');
  scene('rice_reveal', '쌀가게', 'shop', [
    ['officer', '전하, 두 사람의 말을 적어 둘까요?'],
    ['narrator', '주인이 됫박을 내려놓고 허리를 굽혔다. 손님도 급히 자루를 바닥에 놓았다.', 'neutral', 'riceSeller'],
    ['riceSeller', '전하를 몰라뵈었습니다.'],
    ['sukjong', '인사는 됐소. 아까 하던 얘기를 마저 합시다.']
  ], 'rice_join_0');
  scene('rice_join', '쌀가게', 'shop', [
    ['narrator', '군관이 수리표와 됫박을 계산대 위에 나란히 놓았다.', 'neutral', 'officer'],
    ['officer', '표에 “동문 공방·쌀가게 됫박 밑판 수리”라고 적혀 있습니다.'],
    ['sukjong', '그릇 안을 보게. 밑판을 안쪽에 덧대었군.'],
    ['narrator', '군관이 이웃 가게에서 빌린 됫박의 쌀을 부었다. 쌀을 평평히 담고도 빌린 그릇에 쌀이 남았다.', 'neutral', 'officer'],
    ['officer', '덧댄 밑판만큼 안이 얕아졌습니다. 두 그릇에 들어가는 양도 다릅니다.'],
    ['riceSeller', '수리가 끝났으니 그대로 써도 되는 줄 알았습니다. 다시 재 보지는 못했습니다.', 'tense'],
    ['riceBuyer', '그릇을 고쳤다고 제 쌀까지 채워지는 건 아니잖습니까.'],
    ['sukjong', '주인장, 손님에게 모자란 쌀을 채워 줄 생각은 있소?'],
    ['riceSeller', '양을 함께 확인해 주시면 그만큼은 드리겠습니다.'],
    ['riceBuyer', '좋습니다. 저도 옆에서 보겠습니다.'],
    ['narrator', '주인의 손이 됫박 손잡이에서 떨어졌다. 두 사람이 내 쪽을 바라보았다.', 'neutral', 'riceSeller']
  ], 'rice_decide');
  nodes.rice_decide = { type: 'choice', title: '쌀가게', bg: 'shop', who: 'sukjong', thought: true,
    text: '두 사람의 말을 들었다. 어떻게 하겠는가?', choices: [
      { text: '양을 함께 확인하고 모자란 쌀을 돌려주게 한다.', next: 'rice_refund_0', verdict: 'rice_refund' },
      { text: '됫박과 거래 경위를 관아에서 조사하게 한다.', next: 'rice_report_0', verdict: 'rice_report' },
      { text: '오늘 거래를 멈추고 가게의 됫박을 검사하게 한다.', next: 'rice_check_0', verdict: 'rice_check' }
    ] };
  endings.rice_refund = { id: 'rice_refund', title: '채운 자루', label: nodes.rice_decide.choices[0].text, episode: 'rice',
    reactions: [['손님', '이제 무게가 좀 나가네요.'], ['쌀가게 주인', '다음에는 보는 앞에서 함께 셉시다.']] };
  endings.rice_report = { id: 'rice_report', title: '관아에 남긴 됫박', label: nodes.rice_decide.choices[1].text, episode: 'rice',
    reactions: [['손님', '저도 관아에 가야 합니까?'], ['쌀가게 주인', '그릇은 돌려받을 수 있겠지요?']] };
  endings.rice_check = { id: 'rice_check', title: '멈춘 장사', label: nodes.rice_decide.choices[2].text, episode: 'rice',
    reactions: [['쌀가게 주인', '오늘 손님들은 어쩌고요?'], ['손님', '제 쌀도 그 뒤에 받는 겁니까?']] };
  scene('rice_refund', '쌀가게', 'shop', [
    ['sukjong', '두 사람이 보는 앞에서 양을 다시 재고, 모자란 만큼 채워 주시오.'],
    ['riceSeller', '그리하겠습니다. 자루를 이쪽으로 주십시오.'],
    ['narrator', '군관이 이웃 가게의 됫박으로 두 사람이 보는 앞에서 양을 재자 주인이 쌀을 더 퍼 담았다.', 'neutral', 'officer'],
    ['riceBuyer', endings.rice_refund.reactions[0][1]],
    ['riceSeller', endings.rice_refund.reactions[1][1]],
    ['riceBuyer', '그릇도 한번 살펴 주십시오. 저 말고도 쓰는 사람이 있으니까요.'],
    ['sukjong', '군관, 이 됫박은 다른 그릇과 다시 맞춰 보게.'],
    ['narrator', '손님은 자루를 묶어 어깨에 멨다. 군관이 됫박을 든 동안 주인은 새 자루를 꺼내 놓았다.', 'neutral', 'riceBuyer'],
    ['narrator', '사흘 뒤 장터에 들렀을 때, 주인은 쌀을 붓기 전에 손님에게 그릇 안을 보여 주고 있었다.', 'neutral', 'riceSeller'],
    ['riceSeller', '여기까지 고르게 담겠습니다. 다 부었는지도 같이 세어 주시고요.']
  ], 'rice_refund_done');
  scene('rice_report', '관아로', 'shop', [
    ['sukjong', '그릇과 거래 경위를 관아에서 다시 살펴보겠다. 두 사람도 와 주시오.'],
    ['riceBuyer', endings.rice_report.reactions[0][1]],
    ['sukjong', '언제 어떻게 샀는지 직접 들어야겠소. 자루도 가져오고.'],
    ['riceSeller', endings.rice_report.reactions[1][1]],
    ['officer', '확인이 끝나면 돌려드리겠습니다. 다른 장사 도구가 있습니까?'],
    ['riceSeller', '안쪽에 한 개 더 있습니다. 잠깐만 가져오겠습니다.'],
    ['narrator', '군관이 됫박을 천으로 싸서 들었다. 손님은 아직 채우지 못한 자루를 품에 안고 그 뒤를 따랐다.', 'neutral', 'riceBuyer'],
    ['narrator', '관아에 도착하자 군관은 두 사람에게 어제 거래를 차례로 다시 물었다.', 'neutral', 'officer'],
    ['officer', '수리한 뒤 다른 거래에도 이 됫박을 썼는지 장터에서 더 물어보겠습니다.'],
    ['riceBuyer', '내일 다시 오겠습니다. 그때는 모자란 쌀도 받을 수 있으면 좋겠습니다.']
  ], 'rice_report_done');
  scene('rice_check', '쌀가게', 'shop', [
    ['sukjong', '오늘은 이 됫박으로 더 팔지 마시오. 군관이 다른 그릇과 맞춰 볼 것이오.'],
    ['riceSeller', endings.rice_check.reactions[0][1]],
    ['sukjong', '그릇이 맞는지 확인되는 대로 다시 여시오.'],
    ['riceBuyer', endings.rice_check.reactions[1][1]],
    ['sukjong', '자루를 놓고 기다려 주시오. 양을 확인한 뒤 채우게 하겠소.'],
    ['narrator', '주인은 가게 앞에 놓은 쌀자루를 안으로 들였다. 줄을 서던 사람들이 발걸음을 돌렸다.', 'neutral', 'riceSeller'],
    ['officer', '주인장, 안쪽에 있는 다른 됫박도 가져와 주십시오.'],
    ['riceSeller', '알겠습니다. 손님, 자루는 저울 옆에 놓아 주시오.'],
    ['narrator', '이튿날, 주인은 확인을 마친 그릇 하나만 계산대 위에 놓았다. 손님은 함께 양을 잰 자루를 받아 갔다.', 'neutral', 'riceBuyer'],
    ['riceSeller', '오늘부터는 이걸로만 재겠습니다. 어제 못 채운 쌀부터 받으시오.']
  ], 'rice_check_done');
  for (const key of ['rice_refund', 'rice_report', 'rice_check']) {
    const e = endings[key];
    e.source = { title: '이야기의 배경', text: '쌀가게 사건과 등장인물, 대화와 결말은 숙종 시대를 배경으로 지어낸 이야기입니다.' };
    nodes[`${e.id}_done`] = { type: 'end', title: e.title, bg: key === 'rice_report' ? 'office' : 'shop', verdict: key, episode: 'rice' };
  }
  for (const [id, node] of Object.entries(nodes)) {
    if (!id.startsWith('rice_')) continue;
    node.episode = 'rice';
    if (node.type === 'line' && ['sukjong', 'riceSeller'].includes(node.who)) node.pair = ['sukjong', 'riceSeller'];
    if (node.type === 'line' && node.who === 'riceBuyer') node.pair = ['riceSeller', 'riceBuyer'];
  }
  nodes.rice_intro_7.cue = 'door';
  nodes.rice_report_6.cue = 'steps';
  for (const id of ['rice_report_7', 'rice_report_8', 'rice_report_9']) nodes[id].bg = 'office';
})();
