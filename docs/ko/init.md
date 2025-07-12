# gcal init

Google Calendar 인증 설정을 확인하고 Google Calendar API와의 연결을 테스트합니다.

## 사용법

```bash
gcal init [옵션]
```

## 옵션

| 플래그 | 단축 | 설명 | 기본값 |
|--------|------|------|--------|
| `--format` | `-f` | 출력 형식 (table, json, pretty-json) | `table` |
| `--quiet` | `-q` | 필수가 아닌 출력 숨기기 (상태 메시지, 진행률 표시기) | `false` |

## 설명

`init` 명령은 Google Calendar 인증이 제대로 작동하는지 확인합니다. Google Calendar API에 테스트 연결을 수행하여 다음을 확인합니다:

- 자격 증명 파일이 올바르게 설정되어 있음
- 인증 토큰이 유효함
- Google Calendar에 대한 액세스 권한이 있음

이 명령은 다음과 같은 경우에 특히 유용합니다:
- gcal-commander의 초기 설정
- 인증 문제 해결
- 자격 증명을 변경한 후 설정 확인

## 예제

### 기본 사용법

```bash
# 확인 프롬프트와 함께 인증 확인
gcal init

# 조용히 인증 확인 (스크립트용)
gcal init --quiet
```

## 대화형 흐름

`gcal init`를 실행하면 인증 확인을 위한 확인 프롬프트가 표시됩니다:

```
Google Calendar 인증을 확인합니다.
? 인증을 확인하시겠습니까? (Y/n) 
```

- Enter를 누르거나 `y`를 입력하여 확인을 계속
- `n`을 입력하여 작업 취소

**참고**: 초기 상태 메시지 "Google Calendar 인증을 확인합니다."는 `--quiet` 플래그를 사용할 때도 항상 표시됩니다. `--quiet` 플래그는 "Google Calendar 인증 확인 중..." 진행 메시지만 숨깁니다.

## 성공 출력

인증이 성공하면:

```
✓ Google Calendar 인증 확인 중...
인증이 성공했습니다!
```

## 오류 처리

인증이 실패하면 문제 해결 정보와 함께 오류 메시지가 표시됩니다:

```
✗ Google Calendar 인증 확인 중...
인증 오류: [오류 세부 정보]
명령을 다시 시도하거나 Google Calendar API 자격 증명을 확인하세요.
```

일반적인 인증 오류:
- 자격 증명 파일 누락 또는 잘못됨
- 만료된 인증 토큰
- 불충분한 권한
- 네트워크 연결 문제

## 전제 조건

`gcal init`를 실행하기 전에 다음을 확인하세요:

1. **Google Calendar API 활성화됨** - Google Cloud Console에서 활성화
2. **OAuth 2.0 자격 증명** - 다운로드하여 `~/.gcal-commander/credentials.json`에 배치
3. **네트워크 액세스** - Google API에 대한 액세스

아직 인증을 설정하지 않았다면 README의 [초기 설정](../README.md#초기-설정) 가이드를 따르세요.

## 문제 해결

### 인증 실패

`gcal init`가 실패하는 경우:

1. **자격 증명 파일 확인**: `~/.gcal-commander/credentials.json`이 존재하고 유효한 OAuth 2.0 자격 증명을 포함하는지 확인
2. **토큰 재생성**: `~/.gcal-commander/token.json`을 삭제하고 gcal 명령을 실행하여 재인증
3. **API 액세스 확인**: Google Cloud Console에서 Google Calendar API가 활성화되어 있는지 확인
4. **네트워크 확인**: 인터넷 액세스가 있고 Google 서버에 도달할 수 있는지 확인

### 파일 권한

권한 오류가 발생하는 경우:

```bash
# 파일 권한 확인
ls -la ~/.gcal-commander/

# 필요한 경우 권한 수정
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## 사용 사례

- **초기 설정 확인** - 설정 후 인증이 작동하는지 확인
- **문제 해결** - 인증 문제 진단
- **CI/CD 통합** - 자동화 환경에서 인증 확인
- **상태 점검** - 인증이 여전히 유효한지 주기적으로 확인

## 관련 명령

- [`gcal calendars list`](calendars-list.md) - 사용 가능한 캘린더 나열 (인증도 테스트)
- [`gcal events list`](events-list.md) - 이벤트 나열 (인증 필요)
- [`gcal config`](config.md) - 구성 관리

## 참조

- [초기 설정 가이드](../README.md#초기-설정) - 완전한 설정 단계
- [Google Calendar API 설정](https://console.cloud.google.com/) - Google Cloud Console