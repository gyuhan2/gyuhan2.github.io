# MEMORY

## Project Settings
- GitHub Pages 주소: `https://gyuhan2.github.io`
- GitHub 저장소: `https://github.com/gyuhan2/gyuhan2.github.io.git`
- GitHub 토큰 파일명: `github_token.txt`
- 프로필 참고 자료: `없음`
- 웹사이트 디자인 참고: `메트릭스 느낌의 웹사이트, 배경은 매트릭스의 움직이는 배경`
- 게임 추가 기능: `랜덤하게 움직이는 적 5개, 적은 5초마다 폭발하고, 폭발하면 다시 랜덤하게 재생성되서 랜덤하게 움직임, 이를 무한 반복`

## Goal
- 정적 프로페셔널 웹사이트를 반응형으로 만들고, `Games` 메뉴와 지렁이 게임을 넣어 GitHub Pages에 배포한다.

## Scope / Out of Scope
- Scope: 정적 `HTML`, `CSS`, `JavaScript`, 반응형 UI, 게임 입력, 매트릭스 배경, 콘텐츠 반영.
- Out of Scope: 백엔드, 외부 서비스, 프레임워크 추가, 토큰 노출, 대규모 재작성.

## Execution
- Mode: `CODEX_FALLBACK`
- Claude model: `claude-sonnet-5`
- Last test: `PASS(local: diff check, delimiter balance, content review) / Claude timeout / node unavailable`

## Current State
- 상태: `DEPLOY_APPROVAL_REQUIRED`
- 완료 루프: `Step 9 / Change Items 1-4`
- 다음 루프: `Await approval`
- Retry: `0`
- fingerprint: `claude_timeout_15s`
- blocker: `Awaiting user approval for commit, push, and deployment`
- 현재 commit: `b292f4b08219b1dfbcd70fb40e144d501cb81a7c`
- git status: `M MEMORY.md, M AORR_LOG.md, M index.html, M script.js; untracked docs and token helper files`
- rollback 기준: `Step 9 touched files를 b292f4b08219b1dfbcd70fb40e144d501cb81a7c로 되돌리고, verifier 실패 시 변경 범위를 축소한다`
- 마지막 정상 commit·URL: `46767ff74be3b51d89fed18b617733effc3084c6 / https://gyuhan2.github.io`

## Acceptance
- 데스크톱·태블릿·모바일 반응형이 동작한다.
- `Games` 메뉴와 지렁이 게임이 동작한다.
- 매트릭스 배경과 게임 추가 기능이 반영된다.
- 프로필 미확인 내용은 ` [사람 확인 필요] `로 유지된다.

## Guardrails
- 확인되지 않은 개인 정보 생성 금지
- 기존 콘텐츠 임의 삭제 금지
- 테스트 삭제·완화 금지
- 대규모 재작성 금지
- 백엔드·외부 서비스·프레임워크 임의 추가 금지
- 토큰 출력·로그·코드·문서·Git 저장 금지

## Retry / HITL
- Retry: 원인 하나만 고치고, 관련 파일만 최소 수정한다.
- HITL: CV 원문 부재, 배포 승인 필요, 요구사항 해석 모호, `CODEX_FALLBACK` 전환 시.

## Recent Loops
| Loop | 상태 | 실행 모드·모델 | 변경 파일 | 테스트 결과 | Retry | 다음 작업 |
|---|---|---|---|---|---|---|
| Step 9 / Change Items 1-4 | 완료 | `CODEX_FALLBACK / claude-sonnet-5` | `MEMORY.md`, `AORR_LOG.md`, `index.html`, `script.js` | `local PASS: diff check, delimiter balance, content review; Claude timeout` | `0` | `Await approval` |
| Step 7 / loop 1 | 완료 | `CODEX_FALLBACK / claude-sonnet-5` | `index.html`, `styles.css`, `script.js`, `MEMORY.md`, `AORR_LOG.md` | `local PASS: structure, delimiter balance, HTTP 200` | `0` | `DEPLOY_APPROVAL_REQUIRED` |
| Step 5 / loop 2 | 완료 | `CODEX_FALLBACK / sonnet` | `index.html`, `styles.css`, `MEMORY.md`, `AORR_LOG.md` | `local PASS; Claude timeout` | `0` | `HITL_REQUIRED` |
