gcal-commander
=================

Google Calendar 작업을 위한 명령줄 인터페이스입니다. 터미널에서 직접 Google Calendar 이벤트와 캘린더를 관리하세요.

> 🤖 이 프로젝트는 주로 [Claude Code](https://claude.ai/code)를 사용하여 개발되었으며, AI 지원 개발 능력을 시연합니다.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![codecov](https://codecov.io/github/buko106/gcal-commander/graph/badge.svg?token=DQUL68E057)](https://codecov.io/github/buko106/gcal-commander)

## 기능

- 📅 **Google Calendar 이벤트 읽기** - 이벤트 목록 보기 및 상세 정보 확인
- ✏️ **캘린더 이벤트 생성** - 유연한 시간 옵션, 참석자 및 위치로 새 이벤트 추가
- 📋 **여러 캘린더 관리** - 모든 Google 캘린더 액세스
- 🔐 **안전한 OAuth2 인증** - 일회성 설정으로 자동 토큰 갱신
- 💻 **터미널 친화적 출력** - 스크립팅을 위한 깔끔한 테이블 형식 또는 JSON
- 🔇 **조용한 모드 지원** - 스크립팅을 위해 `--quiet` 플래그로 상태 메시지 숨김
- 🚀 **빠르고 가벼움** - oclif 프레임워크로 구축

## 언어

📖 **다른 언어의 README:**
- [🇺🇸 English](../../README.md)
- [🇯🇵 日本語 (Japanese)](../ja/README.md)
- [🇪🇸 Español (Spanish)](../es/README.md)
- [🇩🇪 Deutsch (German)](../de/README.md)
- [🇵🇹 Português (Portuguese)](../pt/README.md)
- [🇫🇷 Français (French)](../fr/README.md)

## 설치

```bash
npm install -g gcal-commander
```

## 초기 설정

gcal-commander를 사용하기 전에 Google Calendar API 액세스를 설정해야 합니다:

### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)로 이동
2. 새 프로젝트를 생성하거나 기존 프로젝트 선택
3. Google Calendar API 활성화:
   - "APIs & Services" > "Library"로 이동
   - "Google Calendar API" 검색
   - 클릭하고 "Enable" 버튼 클릭

### 2. OAuth 2.0 자격 증명 생성

1. "APIs & Services" > "Credentials"로 이동
2. "Create Credentials" > "OAuth client ID" 클릭
3. 메시지가 표시되면 OAuth 동의 화면 구성:
   - "External" 사용자 유형 선택
   - 필수 필드 입력 (애플리케이션 이름, 사용자 지원 이메일, 개발자 연락처)
   - 테스트 사용자에 이메일 추가
4. 애플리케이션 유형으로 "Desktop application" 선택
5. 이름 입력 (예: "gcal-commander")
6. "Create" 클릭
7. 자격 증명 JSON 파일 다운로드

### 3. 자격 증명 파일 설정

다운로드한 자격 증명 파일을 gcal-commander 구성 디렉터리에 배치:

```bash
# 구성 디렉터리 생성
mkdir -p ~/.gcal-commander

# 다운로드한 자격 증명 파일 복사
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. 첫 실행 인증

gcal-commander를 처음 실행하면:

1. Google OAuth 인증을 위해 기본 브라우저가 열립니다
2. Google 계정에 로그인하라고 요청됩니다
3. Google Calendar 액세스 권한을 요청합니다
4. 인증 토큰을 자동으로 저장합니다

```bash
# 첫 실행 - 인증 플로우가 시작됩니다
gcal calendars list
```

인증 토큰은 `~/.gcal-commander/token.json`에 저장되고 필요할 때 자동으로 갱신됩니다.

## 기본 사용법

```bash
# 모든 캘린더 목록 보기
gcal calendars list

# 기본 캘린더의 예정된 이벤트 목록 보기
gcal events list

# 특정 캘린더의 이벤트 목록 보기
gcal events list my-calendar@gmail.com

# 이벤트의 상세 정보 표시
gcal events show <event-id>

# 새 이벤트 생성
gcal events create "팀 미팅" --start "2024-01-15T14:00:00" --duration 60

# 종일 이벤트 생성
gcal events create "컨퍼런스" --start "2024-01-15" --all-day

# 이벤트 수와 시간 범위 제한
gcal events list --max-results 5 --days 7

# 스크립팅을 위한 조용한 모드 사용 (상태 메시지 숨김)
gcal events list --quiet --format json | jq '.[] | .summary'

# 구성 예제
gcal config set defaultCalendar work@company.com
gcal events list  # 이제 work@company.com을 기본값으로 사용
```

## 구성

gcal-commander는 기본 동작을 사용자 정의하기 위한 전역 구성을 지원합니다:

```bash
# 이벤트 목록의 기본 캘린더 설정
gcal config set defaultCalendar work@company.com

# 표시할 기본 이벤트 수 설정
gcal config set events.maxResults 25

# 기본 출력 형식 설정
gcal config set events.format json

# 기본 시간 범위 (일) 설정
gcal config set events.days 60

# 모든 현재 구성 보기
gcal config list

# 특정 구성 값 보기
gcal config get defaultCalendar

# 구성 설정 제거
gcal config unset defaultCalendar

# 모든 구성 재설정
gcal config reset --confirm
```

### 구성 옵션

- `defaultCalendar` - `gcal events list`의 기본 캘린더 ID (기본값: "primary")
- `events.maxResults` - 기본 최대 이벤트 수 (1-100, 기본값: 10)
- `events.format` - 기본 출력 형식: "table", "json", 또는 "pretty-json" (기본값: "table")
- `events.days` - 미리 보는 기본 일 수 (1-365, 기본값: 30)
- `language` - 인터페이스 언어: "en", "ja", "es", "de", "pt", "fr", 또는 "ko" (기본값: "en")

구성은 `~/.gcal-commander/config.json`에 저장되며 수동으로 편집할 수 있습니다.

## 명령어

gcal-commander는 Google Calendar와 상호 작용하기 위한 여러 명령어를 제공합니다:

### 캘린더 관리
- **[`gcal calendars list`](calendars-list.md)** - 사용 가능한 모든 캘린더 목록

### 이벤트 관리  
- **[`gcal events list`](events-list.md)** - 예정된 캘린더 이벤트 목록
- **[`gcal events show`](events-show.md)** - 상세 이벤트 정보 표시
- **[`gcal events create`](events-create.md)** - 유연한 일정 옵션으로 새 캘린더 이벤트 생성

### 구성
- **[`gcal config`](config.md)** - 전역 구성 설정 관리

### 설정 및 인증
- **[`gcal init`](init.md)** - Google Calendar 인증 설정 확인

### 도움말
- **`gcal help`** - 모든 명령어의 도움말 표시

각 명령어의 상세한 사용 예제와 옵션은 위의 링크를 클릭하여 포괄적인 문서를 확인하세요.

## 기여하기

gcal-commander에 대한 기여를 환영합니다! 이 프로젝트는 AI 지원 개발을 수용합니다.

### 권장 개발 워크플로

- **개발 지원을 위해 [Claude Code](https://claude.ai/code) 사용** - 기능 구현부터 코드 리뷰까지
- **품질 보증**: Claude Code가 코드 품질, 모범 사례 및 일관성을 위해 변경 사항을 검토하도록 하세요
- **테스트**: `npm test`로 모든 테스트가 통과하는지 확인
- **린팅**: 프리 커밋 훅을 통해 코드가 자동으로 린팅되고 포맷됨

### 개발 설정

1. 저장소 포크 및 클론
2. 의존성 설치: `npm install`
3. **개발 워크플로**:
   - **활발한 개발용**: `./bin/dev.js COMMAND`를 사용하여 TypeScript 소스 파일에서 직접 명령어 실행 (빌드 불필요)
   - **최종 테스트용**: `npm run build && ./bin/run.js COMMAND`를 사용하여 프로덕션 빌드 테스트
4. 변경 사항 작성 및 테스트 실행: `npm test`
5. 풀 리퀘스트 제출

**CLI 실행 모드:**
- `./bin/dev.js` - 개발 모드 (ts-node로 TypeScript 소스 파일, 즉시 변경)
- `./bin/run.js` - 프로덕션 모드 (dist/에서 컴파일된 JavaScript, 빌드 필요)

프로젝트는 Husky + lint-staged를 사용하여 커밋 전 자동 코드 품질 검사를 수행합니다.

## 언어 지원

gcal-commander는 국제화(i18n)를 지원하며 여러 언어로 제공됩니다:

**지원되는 언어:**
- **English** (`en`) - 기본값
- **Japanese** (`ja`) - 日本語  
- **Spanish** (`es`) - Español
- **German** (`de`) - Deutsch
- **Portuguese** (`pt`) - Português
- **French** (`fr`) - Français
- **Korean** (`ko`) - 한국어

```bash
# 일본어로 전환
gcal config set language ja

# 스페인어로 전환
gcal config set language es

# 독일어로 전환
gcal config set language de

# 포르투갈어로 전환
gcal config set language pt

# 프랑스어로 전환
gcal config set language fr

# 한국어로 전환
gcal config set language ko

# 영어로 다시 전환  
gcal config set language en

# 현재 언어 설정 보기
gcal config get language
```

모든 명령어 출력 메시지, 오류 메시지 및 상태 메시지가 선택한 언어로 표시됩니다.