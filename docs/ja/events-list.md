# gcal events list

指定されたカレンダーまたはデフォルトカレンダーから今後のカレンダーイベントを一覧表示します。

## 使用方法

```bash
gcal events list [calendar] [options]
```

## 引数

| 引数 | 説明 | デフォルト |
|------|------|-----------|
| `calendar` | イベントを一覧表示するカレンダーID | `primary` |

## オプション

| フラグ | 短縮形 | 説明 | デフォルト |
|--------|--------|------|-----------|
| `--days` | `-d` | 先読みする日数（1-365） | `30` |
| `--format` | `-f` | 出力形式（table、json、pretty-json） | `table` |
| `--max-results` | `-n` | 返却する最大イベント数（1-100） | `10` |
| `--quiet` | `-q` | ステータスメッセージを非表示 | `false` |

## 設定サポート

このコマンドはグローバル設定のデフォルト値をサポートします：

- `defaultCalendar` - 指定されていない場合に使用するデフォルトカレンダー
- `events.days` - デフォルトの先読み日数
- `events.format` - デフォルトの出力形式
- `events.maxResults` - デフォルトの最大イベント数

これらの値の設定詳細については、[`gcal config`](config.md)を参照してください。

## 例

### 基本的な使用方法

```bash
# プライマリカレンダーからイベントを一覧表示
gcal events list

# 特定のカレンダーからイベントを一覧表示
gcal events list work@company.com

# 今後7日間のイベントを一覧表示
gcal events list --days 7

# 最大20個のイベントを一覧表示
gcal events list --max-results 20
```

### 高度な使用方法

```bash
# 複数のオプションを組み合わせ
gcal events list personal@gmail.com --days 14 --max-results 5 --format json

# スクリプト用の静寂モード
gcal events list --quiet --format json | jq '.[] | .summary'

# 設定されたデフォルト値を使用
gcal config set defaultCalendar work@company.com
gcal config set events.days 14
gcal events list  # work@company.comを14日間使用
```

### 出力形式

**テーブル形式（デフォルト）：**
```
今後のイベント（2件見つかりました）：

1. チームミーティング
   1月15日（月） • 午前9:00 - 午前10:00
   週次チーム同期ミーティング

2. プロジェクトレビュー
   1月16日（火） • 午後2:00 - 午後3:30 @ 会議室A
```

**JSON形式：**
```json
[
  {
    "id": "abc123",
    "summary": "チームミーティング",
    "start": {
      "dateTime": "2024-01-15T09:00:00-08:00"
    },
    "end": {
      "dateTime": "2024-01-15T10:00:00-08:00"
    },
    "description": "週次チーム同期ミーティング"
  }
]
```

## 時間範囲と制限

- **日数範囲**: 本日から1-365日
- **最大結果数**: リクエストあたり1-100イベント
- **タイムゾーン**: イベントはローカルタイムゾーンで表示
- **過去のイベント**: 今後/現在のイベントのみ表示

## スクリプトと自動化

### イベントタイトルの抽出
```bash
gcal events list --format json --quiet | jq -r '.[].summary'
```

### 今日のイベントのみ取得
```bash
gcal events list --days 1 --format json
```

### 今後のイベント数をカウント
```bash
gcal events list --format json --quiet | jq 'length'
```

## 使用例

- **日次計画** - カレンダーの今後の予定を確認
- **カレンダー概要** - 今後のイベントの簡単な確認
- **スクリプト** - 自動化やレポート用のイベントデータ抽出
- **複数カレンダー管理** - 異なるカレンダー間でのイベント比較

## 関連コマンド

- [`gcal calendars list`](calendars-list.md) - 利用可能なカレンダーIDを検索
- [`gcal events show`](events-show.md) - 特定のイベントの詳細情報を取得
- [`gcal config`](config.md) - このコマンドのデフォルト値を設定