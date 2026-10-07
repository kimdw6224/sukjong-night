# 숙종의 밤

숙종이 평상복 차림으로 검계 사건을 조사하는 한국어 웹 비주얼 노벨입니다. 실록의 검계 처벌 논의에서 착안한 창작으로, 실제 숙종의 암행 수사를 재현한 작품은 아닙니다.

- 두 조사 경로와 세 엔딩
- 질문 순서 선택, 대화 기록, 브라우저 자동 저장
- 실록과 창작을 비교하는 완료 화면
- PC 키보드·마우스와 모바일 터치 지원

## 로컬 실행

Node.js가 있는 환경에서 실행합니다. 게임 실행을 위한 별도 패키지는 없습니다.

```sh
node serve.mjs
```

브라우저에서 [로컬 게임](http://127.0.0.1:5177)을 엽니다. 종료는 터미널에서 Ctrl+C입니다.

## 배포

```sh
node build.mjs
```

정적 파일은 `dist/`에 생성됩니다. Vercel은 `vercel.json`의 빌드 명령과 출력 폴더를 사용합니다. 게임에는 별도의 API 서버나 데이터베이스가 없습니다.

## 이미지

밤 골목·포목상·관아 배경 3장과 인물 4명의 표정 2종씩, 총 11장의 이미지를 포함합니다.

이미지는 아래 경로에 넣습니다. 서버 시작과 배포 빌드 때 실제 존재하는 파일을 `art.js`에 연결합니다.

```text
assets/backgrounds/bg_alley_night.png
assets/backgrounds/bg_shop_day.png
assets/backgrounds/bg_office_day.png
assets/characters/youth_neutral.png
assets/characters/youth_tense.png
assets/characters/merchant_neutral.png
assets/characters/merchant_tense.png
assets/characters/officer_neutral.png
assets/characters/officer_tense.png
assets/characters/sukjong_neutral.png
assets/characters/sukjong_resolute.png
```

## 코드

- `story.js`: 대사와 분기
- `game.js`: 진행, 저장, 기록, 실록 비교
- `style.css`: 반응형 화면
- `serve.mjs`: 로컬 서버와 이미지 목록 갱신
- `build.mjs`: 정적 배포 파일 준비

## 테스트

Playwright가 설치된 개발 환경에서 실행할 수 있습니다. 게임 실행에는 Playwright가 필요하지 않습니다.

```sh
node test-browser.cjs
```

배포 주소를 확인할 때는 `GAME_URL` 환경 변수로 대상 URL을 지정합니다. 테스트 결과와 화면 캡처는 로컬 `test-output/`에 기록하며 공개 저장소에는 포함하지 않습니다. 테스트는 Chromium 기준으로 두 조사 경로 × 세 엔딩, 모바일 360px, 저장 제한과 복구, 대화 기록, 키보드 조작을 확인합니다. 실제 휴대전화 Safari와 이용자의 플레이 시간은 별도 확인이 필요합니다.

## 사료

[『숙종실록』 15권, 숙종 10년(1684) 2월 18일(음력) 1번째 기사](https://sillok.history.go.kr/id/ksa_11002018_001)

숙종의 암행, 청년·상인·군관의 구체적인 사건과 대사, 인물의 외형·성격과 결말은 창작입니다.
