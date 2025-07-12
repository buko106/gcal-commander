# gcal config

gcal-commander의 전역 구성을 관리합니다. 명령에 대한 기본값을 설정하여 경험을 맞춤화합니다.

## 사용법

```bash
gcal config <하위명령> [키] [값] [옵션]
```

## 하위명령

| 하위명령 | 설명 |
|----------|------|
| `get <키>` | 구성 값 가져오기 |
| `set <키> <값>` | 구성 값 설정 |
| `list` | 모든 구성 나열 |
| `unset <키>` | 구성 제거 |
| `reset` | 모든 구성을 기본값으로 재설정 |

## 옵션

| 플래그 | 설명 |
|--------|------|
| `--confirm` | 재설정 시 확인 생략 |
| `--format` | 출력 형식 (table, json, pretty-json) |
| `--quiet` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) |

## 구성 키

### 핵심 구성

| 키 | 설명 | 기본값 | 유효한 값 |
|----|------|--------|----------|
| `defaultCalendar` | 이벤트 나열을 위한 기본 캘린더 | `primary` | 모든 캘린더 ID |
| `language` | 표시 언어 | `en` | `en`, `ja` |

### 이벤트 명령 기본값

| 키 | 설명 | 기본값 | 유효한 값 |
|----|------|--------|----------|
| `events.maxResults` | 반환할 기본 최대 이벤트 수 | `10` | `1-100` |
| `events.format` | 기본 출력 형식 | `table` | `table`, `json`, `pretty-json` |
| `events.days` | 미래를 위한 기본 일수 | `30` | `1-365` |

## 예제

### 기본 구성

```bash
# 기본 캘린더 설정
gcal config set defaultCalendar work@company.com

# 현재 기본 캘린더 가져오기
gcal config get defaultCalendar

# 모든 현재 구성 나열
gcal config list

# 구성 제거 (기본값으로 돌아가기)
gcal config unset defaultCalendar
```

### 언어 구성

```bash
# 한국어로 변경
gcal config set language ko

# 영어로 변경
gcal config set language en

# 현재 언어 설정 확인
gcal config get language
```

### 이벤트 명령 기본값

```bash
# 표시할 기본 이벤트 수 설정
gcal config set events.maxResults 25

# 기본 시간 범위 설정
gcal config set events.days 60

# 기본 출력 형식 설정
gcal config set events.format json

# 이벤트 설정 보기
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### 구성 관리

```bash
# 모든 구성을 테이블 형식으로 표시
gcal config list

# 모든 구성을 JSON 형식으로 표시
gcal config list --format json

# 모든 구성 재설정 (확인 포함)
gcal config reset

# 모든 구성 재설정 (확인 생략)
gcal config reset --confirm
```

## 출력 형식

### list 명령 - 테이블 형식 (기본값)
```
키                      값
────────────────────────────────────
defaultCalendar         work@company.com
language                ko
events.maxResults       25
events.format           json
events.days             60
```

### list 명령 - JSON 형식
```json
{
  "defaultCalendar": "work@company.com",
  "language": "ko",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### get 명령
```bash
$ gcal config get defaultCalendar
work@company.com
```

## 구성 파일

구성은 `~/.gcal-commander/config.json`에 저장됩니다:

```json
{
  "defaultCalendar": "work@company.com",
  "language": "ko",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

필요한 경우 이 파일을 수동으로 편집할 수 있지만 config 명령 사용을 권장합니다.

## 일반적인 워크플로

### 업무 환경 설정
```bash
# 업무용 구성
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language ko
```

### 스크립트 환경 설정
```bash
# 자동화/스크립트용 구성
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### 다중 캘린더 관리
```bash
# 기본 업무 캘린더 설정
gcal config set defaultCalendar primary-work@company.com

# 이벤트 목록에서 이 캘린더를 기본으로 사용
gcal events list  # primary-work@company.com 사용

# 특정 쿼리에 대해 재정의
gcal events list personal@gmail.com
```

## 유효성 검사

구성 값은 설정 시 유효성이 검사됩니다:

- **캘린더 ID**: 첫 사용까지 유효성 검사 안됨
- **숫자 범위**: `maxResults` (1-100), `days` (1-365)
- **열거형**: `format`은 "table", "json", "pretty-json"이어야 함
- **언어**: `language`는 "en" 또는 "ja"이어야 함
- **잘못된 값**: 명령이 오류와 현재 유효한 옵션을 표시

## 명령에 미치는 영향

구성은 명령의 기본 동작에 영향을 줍니다:

### [`gcal events list`](events-list.md)
- 캘린더가 지정되지 않으면 `defaultCalendar` 사용
- `--max-results`의 기본값으로 `events.maxResults` 사용
- `--format`의 기본값으로 `events.format` 사용
- `--days`의 기본값으로 `events.days` 사용

### [`gcal events show`](events-show.md)
- 지정되지 않으면 `--calendar`의 기본값으로 `defaultCalendar` 사용

### 모든 명령
- `language` 설정에 따라 메시지 표시

명령줄 플래그는 항상 구성 기본값을 재정의합니다.

## 문제 해결

### 구성 재설정
구성에 문제가 있는 경우:
```bash
gcal config reset --confirm
```

### 현재 구성 보기
```bash
gcal config list --format json
```

### 특정 구성 확인
```bash
gcal config get defaultCalendar
```

## 관련 명령

- [`gcal events list`](events-list.md) - 구성 기본값 사용
- [`gcal events show`](events-show.md) - 구성 기본값 사용
- [`gcal calendars list`](calendars-list.md) - 구성을 위한 캘린더 ID 찾기