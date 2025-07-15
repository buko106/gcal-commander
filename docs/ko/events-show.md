# gcal events show

특정 캘린더 이벤트의 상세 정보를 표시합니다.

## 사용법

```bash
gcal events show <event-id> [옵션]
```

## 인수

| 인수 | 설명 | 필수 |
|------|------|------|
| `event-id` | 세부 정보를 표시할 이벤트 ID | 예 |

## 옵션

| 플래그 | 단축 | 설명 | 기본값 |
|--------|------|------|--------|
| `--calendar` | `-c` | 이벤트가 존재하는 캘린더 ID | `primary` |
| `--fields` | | 테이블 형식으로 표시할 필드의 쉼표 구분 목록 | 모든 필드 |
| `--format` | `-f` | 출력 형식 (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) | `false` |

## 예제

### 기본 사용법

```bash
# 기본 캘린더에서 이벤트 세부 정보 표시
gcal events show abc123def456

# 특정 캘린더에서 이벤트 표시
gcal events show abc123def456 --calendar work@company.com

# JSON 형식으로 이벤트 세부 정보 가져오기
gcal events show abc123def456 --format json
```

### 고급 사용법

```bash
# 조용히 이벤트 표시 (스크립트용)
gcal events show abc123def456 --quiet --format json

# 특정 캘린더에서 JSON 형식으로 이벤트 표시
gcal events show abc123def456 --calendar team@company.com --format json
```

## 이벤트 ID 가져오기

이벤트 ID는 다음에서 가져올 수 있습니다:

1. **`gcal events list` 명령 출력**
2. **Google Calendar URL** (URL의 긴 문자열)
3. **Calendar API 응답** (JSON 형식 사용 시)

이벤트 ID 찾기 예제:
```bash
# 이벤트 목록에서 ID 검색
gcal events list --format json | jq '.[] | {id, summary}'
```

## 출력 형식

**테이블 형식 (기본값):**
```
=== 이벤트 세부 정보 ===

제목: 팀 회의
ID: abc123def456
설명: 주간 팀 동기화 회의
위치: 회의실 A
상태: confirmed
시작: 2024년 1월 15일 (월) • 오전 9:00
종료: 2024년 1월 15일 (월) • 오전 10:00
생성자: 김철수
주최자: 박영희

참석자:
  1. kim@company.com (accepted)
  2. park@company.com (tentative)

Google Calendar 링크: https://calendar.google.com/event?eid=...
생성일: 2024/1/10 8:30:00
마지막 업데이트: 2024/1/12 15:45:00
```

**JSON 형식:**
```json
{
  "id": "abc123def456",
  "summary": "팀 회의",
  "description": "주간 팀 동기화 회의",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "회의실 A",
  "attendees": [
    {
      "email": "kim@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "park@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## 표시되는 이벤트 세부 정보

이 명령은 다음을 포함한 포괄적인 이벤트 정보를 표시합니다:

- **기본 정보**: 제목, 설명, 이벤트 ID
- **시간 정보**: 시간대 정보가 포함된 시작/종료 시간
- **위치**: 물리적 또는 가상 회의 위치
- **참석자**: 이메일 주소 및 응답 상태
- **상태**: 이벤트 상태 (confirmed, tentative, cancelled)
- **메타데이터**: 생성 및 마지막 업데이트 타임스탬프
- **반복**: 반복 규칙 (해당하는 경우)
- **알림**: 기본 및 재정의된 알림

## 일반적인 사용 사례

### 이벤트 확인
```bash
# 회의 전 이벤트 세부 정보 빠르게 확인
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### 참석자 정보
```bash
# 이벤트 참석자 이메일 주소 추출
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### 회의실 예약 확인
```bash
# 위치 및 시간 세부 정보 확인
gcal events show abc123 | grep -E "(위치|시작|종료)"
```

### 이벤트 데이터 내보내기
```bash
# 외부 처리를 위한 완전한 이벤트 데이터 가져오기
gcal events show abc123 --format json --quiet > event-details.json
```

## 오류 처리

일반적인 오류 및 해결책:

- **이벤트를 찾을 수 없음**: 이벤트 ID 및 캘린더 확인
- **액세스 거부됨**: 지정된 캘린더에 대한 액세스 권한 확인
- **잘못된 이벤트 ID**: 이벤트 ID 형식 및 소스 확인

## 관련 명령

- [`gcal events list`](events-list.md) - 이 명령에서 사용할 이벤트 ID 찾기
- [`gcal calendars list`](calendars-list.md) - 사용 가능한 캘린더 ID 찾기
- [`gcal config`](config.md) - 기본 설정 구성