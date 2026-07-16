# AORR 상태 머신

## 1. Target과 완료 기준
- Target
  - 정적 프로페셔널 웹사이트를 GitHub Pages에 배포 가능한 형태로 완성한다.
  - 데스크톱, 태블릿, 모바일에서 반응형으로 동작해야 한다.
  - 상단 `Games` 메뉴가 있어야 한다.
  - 키보드와 터치로 조작하는 지렁이 게임이 있어야 한다.
  - 매트릭스 느낌의 움직이는 배경과 게임 확장 기능을 반영한다.
  - Verifier 실행 주체는 `Claude Code CLI`이고, 모델 선택은 `sonnet`이다.
  - Verifier 실제 세부 모델명은 `[사람 확인 필요]`로 남긴다.
- 완료 기준
  - Claude Code CLI Sonnet의 전체 검증이 통과한다.
  - HTML, CSS, JavaScript, 게임 입력, 반응형, 콘텐츠가 목표에 맞게 동작한다.
  - GitHub Pages 배포가 성공하고 공개 URL이 확인된다.
  - 불명확한 프로필 정보는 모두 ` [사람 확인 필요] `로 남아 있거나, 확인된 CV 내용으로만 채워진다.

## 2. Act: Codex가 수행할 최소 수정
- 한 번의 Act에서는 하나의 원인만 고친다.
- 한 번의 Retry에서는 관련 파일만 수정한다.
- Codex는 최소 수정만 수행한다.
  - 레이아웃/시맨틱 구조 수정
  - CSS 반응형 조정
  - JavaScript 상태/입력/게임 로직 수정
  - 콘텐츠 문구 수정
  - 배포 설정 수정
- Codex는 테스트를 실행하지 않는다.
- Codex는 결과를 과장하지 않고, 수정 범위와 의도를 짧게 기록한다.

## 3. Observe: Claude가 실행할 테스트와 수집할 결과
- Claude Code CLI Sonnet이 가능하면 다음을 실행한다.
  - 파일 구조와 산출물 확인
  - 정적 HTML 렌더링/DOM 검토
  - CSS 반응형 확인
  - 지렁이 게임의 키보드 입력 확인
  - 모바일 터치 입력 확인
  - 매트릭스 배경 애니메이션 확인
  - `Games` 메뉴 이동 확인
  - GitHub Pages 배포 가능성 확인
- 수집할 결과
  - 통과/실패 여부
  - 실패한 테스트 이름
  - 실패 원인 분류
  - 관련 파일 경로
  - 재현 조건
- Claude CLI 사용 불가 시
  - `CODEX_FALLBACK`으로 기록한다.
  - 이 경우 Codex가 수정과 테스트를 모두 수행해야 한다. ` [사람 확인 필요] `

## 4. Reason: 실패 원인 분류
- `HTML`
  - 마크업 구조, 의미론, 누락된 섹션, 잘못된 링크
- `CSS`
  - 레이아웃 붕괴, 반응형 깨짐, 스타일 충돌, 애니메이션 문제
- `JAVASCRIPT`
  - 런타임 에러, 상태 관리 오류, 이벤트 처리 실패
- `GAME`
  - 지렁이 이동, 충돌, 점수, 터치 조작, 재시작, 게임 루프 문제
- `CONTENT`
  - 프로필 문구, CV 반영, ` [사람 확인 필요] ` 처리 오류
- `TEST`
  - 검증 스크립트 실패, 검사 누락, 재현 불가
- `ENVIRONMENT`
  - 로컬 실행 환경, 의존 도구, 경로, 인코딩, 권한 문제
- `GITHUB`
  - 원격 연결, 저장소 상태, 인증, push 관련 문제
- `DEPLOYMENT`
  - GitHub Pages 설정, 배포 반영, 공개 URL 확인 실패
- `UNKNOWN`
  - 위 항목으로 분류되지 않는 실패

## 5. Repeat: Codex 최소 수정 → Claude 동일 테스트 재실행
- 실패가 나면 Reason을 하나로 확정한다.
- 해당 Reason과 관련된 파일만 Codex가 최소 수정한다.
- Claude는 동일한 검증 세트를 다시 실행한다.
- 같은 실패가 반복되면 다음 우선순위를 따른다.
  - 원인 축소
  - 관련 파일 범위 축소
  - 환경 문제 여부 확인
  - ` [사람 확인 필요] ` 항목 재검토
- Retry는 `RETRYING` 상태로 유지한다.
- 수정이 원인과 직접 연결되지 않으면 다시 분류한다.

## 6. Stop과 HITL 조건
- Stop
  - Claude 전체 검증이 통과하면 `PASSED`
  - 배포 승인 전이면 `DEPLOY_APPROVAL_REQUIRED`
  - 배포 성공 후이면 `DEPLOYED`
  - 더 이상 자동 진전이 없고 사람 판단이 필요한 경우 `HITL_REQUIRED`
  - 작업이 구조적으로 막히면 `BLOCKED`
- HITL 조건
  - CV 원문이 없어 프로필 내용을 확정할 수 없음
  - 배포 승인 또는 GitHub 자격 증명 사용이 필요한 경우
  - GitHub Pages 정책, 계정, 원격 저장소 상태를 사람 확인이 필요할 때
  - 게임 요구사항 해석에 모호함이 남아 있을 때
  - `CODEX_FALLBACK`으로 전환했지만 추가 판단이 필요한 경우

## 7. 개발 루프 표

| 루프 | 입력 | Codex Act | Claude Verify | 통과 기준 | 다음 상태 |
|---|---|---|---|---|---|
| 1 | `MEMORY.md`, `STEP1_ANALYSIS.md`, 저장소 구조 | 페이지 구조, 섹션, 메뉴 슬롯, 게임 진입점 최소 수정 | 구조, 링크, 반응형 기초 확인 | HTML 구조와 주요 섹션이 목표와 맞음 | `VERIFYING` |
| 2 | 1차 구조 결과 | 매트릭스 배경, 색/타이포, 반응형 CSS 최소 수정 | 다양한 화면 폭에서 레이아웃 확인 | 데스크톱·태블릿·모바일에서 깨지지 않음 | `VERIFYING` |
| 3 | 반응형 결과 | 지렁이 게임 입력/상태/렌더링 최소 수정 | 키보드와 터치 조작 확인 | 게임이 정상 조작되고 기본 플레이가 가능함 | `VERIFYING` |
| 4 | 게임 결과 | 적 5개, 5초 폭발, 재생성 무한 반복 로직 최소 수정 | 적 이동/폭발/재생성 주기 확인 | 적이 반복적으로 폭발 후 다시 생성됨 | `VERIFYING` |
| 5 | 콘텐츠 결과 | CV 확인된 부분만 반영하고 미확인 항목 표기 점검 | 콘텐츠 정확성, 링크, 접근성 확인 | 미확인 내용이 남지 않거나 ` [사람 확인 필요] `로 유지됨 | `VERIFYING` |
| 6 | 검증 통과 결과 | 배포 설정 최소 수정 | GitHub Pages 배포와 공개 URL 확인 | 공개 URL이 정상 열림 | `DEPLOY_APPROVAL_REQUIRED` |

## 8. Self-Correcting TDD Loop
- 기본 모드
  - Codex = Worker: 코드 분석과 최소 수정
  - Claude Code CLI Sonnet = Verifier: 변경 전·후 테스트 실행
  - Codex는 Claude가 실행한 테스트를 중복 실행하지 않는다
- 실행 순서
  1. Claude가 변경 전 테스트를 실행한다.
  2. Claude가 실패 항목, 핵심 오류, 관련 파일, fingerprint를 보고한다.
  3. Codex가 원인 하나에 필요한 최소 코드만 수정한다.
  4. Claude가 동일 테스트를 재실행한다.
  5. 실패 시 Claude가 새 결과와 fingerprint를 보고한다.
  6. Codex가 최소 수정 후 Claude에 재검증을 요청한다.
  7. Claude의 전체 테스트가 통과해야 `PASSED`가 된다.
- 검증 범위
  - 파일 존재와 상대 경로
  - HTML 구조와 내부 링크
  - CSS 반응형
  - JavaScript 오류
  - 지렁이 게임 기능과 입력
  - 로컬 HTTP 응답
  - `375px`, `768px`, `1440px`
  - GitHub Pages 호환성
- 실패 기록
  - 실행 주체와 모델
  - 명령
  - exit code
  - 핵심 오류
  - 관련 파일·라인
  - fingerprint
  - 최종 상태
- Retry
  - 오류당 최대 3회
  - 동일 fingerprint 2회면 중지
  - 한 Retry에서는 원인 하나와 최소 파일만 수정
  - 테스트 삭제·완화 금지
- Fallback
  - Claude CLI를 사용할 수 없을 때만 Codex가 수정과 테스트를 모두 수행한다.
  - Fallback 이유와 사용 여부를 기록한다.
  - 현재 상태는 `Claude CLI 사용 가능`이다.

## 9. Step 8 Execution Order
1. Shift 가속 기능
2. Shift 설명 문구
3. 경력·학력·스킬의 `비공개` 표기
4. 프로젝트 자동 생성 문구
