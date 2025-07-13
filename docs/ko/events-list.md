# gcal events list

지정된 캘린더 또는 기본 캘린더에서 예정된 캘린더 이벤트를 나열합니다.

## 사용법

```bash
gcal events list [캘린더] [옵션]
```

## 인수

| 인수 | 설명 | 기본값 |
|------|------|--------|
| `캘린더` | 이벤트를 나열할 캘린더 ID | `primary` |

## 옵션

| 플래그 | 단축 | 설명 | 기본값 |
|--------|------|------|--------|
| `--days` | `-d` | 미래로 조회할 일수 (1-365) | `30` |
| `--format` | `-f` | 출력 형식 (table, json, pretty-json) | `table` |
| `--max-results` | `-n` | 반환할 최대 이벤트 수 (1-100) | `10` |
| `--quiet` | `-q` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) | `false` |

## 구성 지원

이 명령은 전역 구성 기본값을 지원합니다:

- `defaultCalendar` - 지정되지 않은 경우 사용할 기본 캘린더
- `events.days` - 미래로 조회할 기본 일수
- `events.format` - 기본 출력 형식
- `events.maxResults` - 기본 최대 이벤트 수

이 값을 설정하는 방법에 대한 자세한 내용은 [`gcal config`](config.md)를 참조하세요.

## 예제

### 기본 사용법

```bash
# 기본 캘린더에서 이벤트 나열
gcal events list

# 특정 캘린더에서 이벤트 나열
gcal events list work@company.com

# 다음 7일간의 이벤트 나열
gcal events list --days 7

# 최대 20개 이벤트 나열
gcal events list --max-results 20
```

### 고급 사용법

```bash
# 여러 옵션 결합
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# 스크립트용 조용한 모드
gcal events list --quiet --format json | jq '.[] | .summary'

# 구성된 기본값 사용
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # 14일간 work@company.com 사용
```

### 출력 형식

**테이블 형식 (기본값):**
```
예정된 이벤트 (2개 발견):

1. 팀 회의
   1월 15일 (월) • 오전 9:00 - 오전 10:00
   주간 팀 동기화 회의

2. 프로젝트 리뷰
   1월 16일 (화) • 오후 2:00 - 오후 3:30 @ 회의실 A
```

**JSON 형식:**
```json
[
  {
    "id": "abc123",
    "summary": "팀 회의",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "주간 팀 동기화 회의"
  }
]
```

## 시간 범위 및 제한

- **일수 범위**: 오늘부터 1-365일
- **최대 결과**: 요청당 1-100개 이벤트
- **시간대**: 이벤트는 로컬 시간대로 표시
- **과거 이벤트**: 미래/현재 이벤트만 표시

## 스크립팅 및 자동화

### 이벤트 제목 추출
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### 오늘 이벤트만 가져오기
```bash
gcal events list --days 1 --format json
```

### 예정된 이벤트 수 세기
```bash
gcal events list --format json --quiet | jq 'length'
```

## 사용 사례

- **일일 계획** - 캘린더의 예정된 약속 검토
- **캘린더 개요** - 예정된 이벤트 빠른 확인
- **스크립팅** - 자동화 또는 보고서를 위한 이벤트 데이터 추출
- **다중 캘린더 관리** - 서로 다른 캘린더 간 이벤트 비교

## 관련 명령

- [`gcal calendars list`](calendars-list.md) - 사용 가능한 캘린더 ID 찾기
- [`gcal events show`](events-show.md) - 특정 이벤트의 상세 정보 가져오기
- [`gcal config`](config.md) - 이 명령의 기본값 설정