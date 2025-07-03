# gcal events show

特定のカレンダーイベントの詳細情報を表示します。

## 使用方法

```bash
gcal events show <event-id> [options]
```

## 引数

| 引数 | 説明 | 必須 |
|------|------|------|
| `event-id` | 詳細を表示するイベントID | はい |

## オプション

| フラグ | 短縮形 | 説明 | デフォルト |
|--------|--------|------|-----------|
| `--calendar` | `-c` | イベントが存在するカレンダーID | `primary` |
| `--format` | `-f` | 出力形式（table、json、pretty-json） | `table` |
| `--quiet` | `-q` | ステータスメッセージを非表示 | `false` |

## 例

### 基本的な使用方法

```bash
# プライマリカレンダーからイベント詳細を表示
gcal events show abc123def456

# 特定のカレンダーからイベントを表示
gcal events show abc123def456 --calendar work@company.com

# JSON形式でイベント詳細を取得
gcal events show abc123def456 --format json
```

### 高度な使用方法

```bash
# 静寂にイベントを表示（スクリプト用）
gcal events show abc123def456 --quiet --format json

# 特定のカレンダーからJSON形式でイベントを表示
gcal events show abc123def456 --calendar team@company.com --format json
```

## イベントIDの取得

イベントIDは以下から取得できます：

1. **`gcal events list`**コマンドの出力
2. **Google CalendarのURL**（URLの長い文字列）
3. **Calendar APIレスポンス**（JSON形式使用時）

イベントIDを見つける例：
```bash
# イベント一覧でIDを検索
gcal events list --format json | jq '.[] | {id, summary}'
```

## 出力形式

**テーブル形式（デフォルト）：**
```
=== イベント詳細 ===

タイトル: チームミーティング
ID: abc123def456
説明: 週次チーム同期ミーティング
場所: 会議室A
ステータス: confirmed
開始: 2024年1月15日（月） • 午前9:00
終了: 2024年1月15日（月） • 午前10:00
作成者: 田中太郎
主催者: 佐藤花子

参加者:
  1. tanaka@company.com (accepted)
  2. sato@company.com (tentative)

Google Calendarリンク: https://calendar.google.com/event?eid=...
作成日時: 2024/1/10 8:30:00
最終更新: 2024/1/12 15:45:00
```

**JSON形式：**
```json
{
  "id": "abc123def456",
  "summary": "チームミーティング",
  "description": "週次チーム同期ミーティング",
  "start": {
    "dateTime": "2024-01-15T09:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2024-01-15T10:00:00-08:00",
    "timeZone": "America/Los_Angeles"
  },
  "location": "会議室A",
  "attendees": [
    {
      "email": "tanaka@company.com",
      "responseStatus": "accepted"
    },
    {
      "email": "sato@company.com",
      "responseStatus": "needsAction"
    }
  ],
  "status": "confirmed",
  "created": "2024-01-10T08:30:00.000Z",
  "updated": "2024-01-12T15:45:00.000Z"
}
```

## 表示されるイベント詳細

このコマンドは以下の包括的なイベント情報を表示します：

- **基本情報**: タイトル、説明、イベントID
- **時間情報**: タイムゾーン情報付きの開始/終了時刻
- **場所**: 物理的または仮想ミーティングの場所
- **参加者**: メールアドレスと回答状況
- **ステータス**: イベントステータス（confirmed、tentative、cancelled）
- **メタデータ**: 作成日時と最終更新のタイムスタンプ
- **繰り返し**: 繰り返しルール（該当する場合）
- **リマインダー**: デフォルトとオーバーライドリマインダー

## 一般的な使用例

### イベント確認
```bash
# ミーティング前にイベント詳細を素早く確認
gcal events show $(gcal events list --format json | jq -r '.[0].id')
```

### 参加者情報
```bash
# イベントの参加者メールアドレスを抽出
gcal events show abc123 --format json | jq -r '.attendees[]?.email'
```

### 会議室予約確認
```bash
# 場所と時間詳細を確認
gcal events show abc123 | grep -E "(場所|開始|終了)"
```

### イベントデータのエクスポート
```bash
# 外部処理用の完全なイベントデータを取得
gcal events show abc123 --format json --quiet > event-details.json
```

## エラーハンドリング

よくあるエラーと解決方法：

- **イベントが見つからない**: イベントIDとカレンダーを確認
- **アクセス拒否**: 指定されたカレンダーへのアクセス権限を確認
- **無効なイベントID**: イベントID形式とソースを確認

## 関連コマンド

- [`gcal events list`](events-list.md) - このコマンドで使用するイベントIDを検索
- [`gcal calendars list`](calendars-list.md) - 利用可能なカレンダーIDを検索
- [`gcal config`](config.md) - デフォルト設定を構成