# gcal calendars list

Google 계정을 통해 접근 가능한 모든 캘린더를 나열합니다.

## 사용법

```bash
gcal calendars list [옵션]
```

## 옵션

| 플래그 | 단축 | 설명 | 기본값 |
|--------|------|------|--------|
| `--format` | `-f` | 출력 형식 (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) | `false` |

## 예제

### 기본 사용법

```bash
# 모든 캘린더를 테이블 형식으로 나열
gcal calendars list

# 캘린더를 JSON 형식으로 나열
gcal calendars list --format json

# 캘린더를 조용히 나열 (상태 메시지 없음)
gcal calendars list --quiet
```

### 출력 형식

**테이블 형식 (기본값):**
```
사용 가능한 캘린더 (3개 발견):

1. 김철수 (기본)
   ID: primary
   접근 권한: owner

2. 업무 캘린더
   ID: work@company.com
   접근 권한: owner

3. 가족 이벤트
   ID: family@gmail.com
   접근 권한: reader
```

**JSON 형식:**
```json
[
  {
    "id": "primary",
    "summary": "김철수",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "업무 캘린더",
    "accessRole": "owner"
  }
]
```

## 사용 사례

- **캘린더 발견** - 접근할 수 있는 모든 캘린더 보기
- **캘린더 ID 찾기** - 다른 명령에서 사용할 정확한 캘린더 ID 얻기
- **스크립팅** - `--format json`으로 캘린더 데이터를 프로그래밍 방식으로 분석
- **빠른 개요** - 이벤트를 나열하기 전 사용 가능한 캘린더 확인

## 다른 명령과의 통합

이 명령에서 반환되는 캘린더 ID는 다음에서 사용할 수 있습니다:

- [`gcal events list <calendar-id>`](events-list.md) - 특정 캘린더에서 이벤트 나열
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - 특정 캘린더에서 이벤트 세부 정보 표시
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - 기본 캘린더 설정

## 관련 명령

- [`gcal events list`](events-list.md) - 캘린더에서 이벤트 나열
- [`gcal config`](config.md) - 캘린더 기본 설정 구성