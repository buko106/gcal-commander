# gcal events create

유연한 일정 옵션, 참석자 및 메타데이터로 새로운 캘린더 이벤트를 생성합니다.

## 사용법

```bash
gcal events create <요약> [옵션]
```

## 인수

| 인수 | 설명 | 필수 |
|------|------|------|
| `요약` | 이벤트 제목/요약 | 예 |

## 옵션

| 플래그 | 단축 | 설명 | 기본값 |
|--------|------|------|--------|
| `--start` | `-s` | 시작 날짜 및 시간 (ISO 형식) | 필수 |
| `--end` | `-e` | 종료 날짜 및 시간 (ISO 형식) | - |
| `--duration` | `-d` | 지속 시간 (분) (--end의 대안) | `60` |
| `--all-day` | | 종일 이벤트 생성 | `false` |
| `--calendar` | `-c` | 이벤트를 생성할 캘린더 ID | `primary` |
| `--location` | `-l` | 이벤트 위치 | - |
| `--description` | | 이벤트 설명 | - |
| `--attendees` | | 참석자 이메일 주소의 쉼표 구분 목록 | - |
| `--send-updates` | | 이벤트 초대 보내기 (all/externalOnly/none) | `none` |
| `--fields` | | 테이블 형식으로 표시할 필드의 쉼표 구분 목록 | 모든 필드 |
| `--format` | `-f` | 출력 형식 (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) | `false` |

## 시간 지정

### 시간이 있는 이벤트
날짜와 시간에 ISO 8601 형식 사용:
```bash
# 기본 형식
gcal events create "회의" --start "2024-01-15T14:00:00"

# 시간대 포함
gcal events create "화상회의" --start "2024-01-15T14:00:00-08:00"
```

### 종일 이벤트
날짜만 형식 (YYYY-MM-DD) 사용:
```bash
gcal events create "컨퍼런스" --start "2024-01-15" --all-day
```

### 지속 시간 vs 종료 시간
- 편의를 위해 분 단위로 `--duration` 사용
- 특정 종료 시간을 위해 `--end` 사용
- `--end`와 `--duration`을 동시에 지정할 수 없음

## 예제

### 기본 이벤트 생성

```bash
# 간단한 1시간 회의 (기본 지속 시간)
gcal events create "팀 회의" --start "2024-01-15T14:00:00"

# 특정 지속 시간의 회의
gcal events create "모닝 스탠드업" --start "2024-01-15T09:00:00" --duration 30

# 특정 종료 시간의 회의
gcal events create "프로젝트 리뷰" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### 종일 이벤트

```bash
# 하루 이벤트
gcal events create "컨퍼런스" --start "2024-01-15" --all-day

# 여러 날 이벤트 (종료 날짜는 제외됨)
gcal events create "휴가" --start "2024-01-15" --end "2024-01-20" --all-day
```

### 메타데이터가 있는 이벤트

```bash
# 위치가 있는 회의
gcal events create "고객 회의" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "회의실 A"

# 설명이 있는 이벤트
gcal events create "스프린트 계획" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "다음 스프린트를 위한 작업 계획"
```

### 참석자가 있는 이벤트

```bash
# 초대를 보내지 않고 참석자 추가
gcal events create "팀 동기화" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# 참석자에게 초대 보내기
gcal events create "중요한 회의" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### 다른 캘린더

```bash
# 업무 캘린더에 생성
gcal events create "스프린트 데모" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# 개인 캘린더에 생성
gcal events create "병원 예약" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### 고급 예제

```bash
# 완전한 회의 설정
gcal events create "분기별 리뷰" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "메인 회의실" \
  --description "Q4 결과 및 Q1 계획" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# 스크립트용 JSON 출력
gcal events create "자동화된 이벤트" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## 출력 형식

**테이블 형식 (기본값):**
```
이벤트가 성공적으로 생성되었습니다!

제목: 팀 회의
ID: abc123def456
시작: 2024/1/15 14:00:00
종료: 2024/1/15 15:00:00
위치: 회의실 A
Google Calendar 링크: https://calendar.google.com/event?eid=...
```

**JSON 형식:**
```json
{
  "id": "abc123def456",
  "summary": "팀 회의",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "회의실 A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## 참석자 관리

### 초대 옵션
- `none` (기본값) - 참석자 추가하지만 초대 보내지 않음
- `all` - 모든 참석자에게 초대 보내기
- `externalOnly` - 외부 참석자에게만 초대 보내기

### 참석자 형식
쉼표로 구분된 이메일 주소 제공:
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## 시간대 처리

- **로컬 시간**: 시간대가 지정되지 않으면 로컬 시간대 사용
- **명시적 시간대**: ISO 형식으로 시간대 오프셋 포함
- **종일 이벤트**: 날짜만 형식, 시간대 독립적

## 유효성 검사 및 오류 처리

### 일반적인 오류
- **잘못된 날짜 형식**: 시간이 있는 이벤트에 대해 ISO 8601 형식 확인
- **end와 duration 동시 지정**: `--end`와 `--duration`을 동시에 지정할 수 없음
- **잘못된 지속 시간**: 양의 정수 (분)여야 함
- **과거 날짜**: 경고가 표시되지만 이벤트는 생성됨

### 날짜 형식 예제
```bash
# 유효한 형식
--start "2024-01-15T14:00:00"           # 로컬 시간대
--start "2024-01-15T14:00:00-08:00"     # 태평양 시간
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # 종일 이벤트

# 잘못된 형식
--start "2024년 1월 15일"                # ISO 형식 사용
--start "14:00"                         # 날짜 누락
```

## 사용 사례

- **회의 일정 잡기** - 참석자와 위치가 있는 회의 생성
- **이벤트 계획** - 컨퍼런스, 워크숍, 사교 이벤트 설정
- **개인 알림** - 약속 및 개인 이벤트 생성
- **반복 설정** - 수동 반복을 위한 템플릿 이벤트 생성
- **자동화** - 외부 시스템에서 이벤트 생성 스크립트

## 관련 명령

- [`gcal events list`](events-list.md) - 생성된 이벤트 보기
- [`gcal events show`](events-show.md) - 상세한 이벤트 정보 가져오기
- [`gcal calendars list`](calendars-list.md) - 사용 가능한 캘린더 ID 찾기
- [`gcal config`](config.md) - 기본 설정 구성