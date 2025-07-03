# gcal config

gcal-commanderのグローバル設定を管理します。エクスペリエンスをカスタマイズするためのコマンドのデフォルト値を設定します。

## 使用方法

```bash
gcal config <subcommand> [key] [value] [options]
```

## サブコマンド

| サブコマンド | 説明 |
|-------------|------|
| `get <key>` | 設定値を取得 |
| `set <key> <value>` | 設定値を設定 |
| `list` | すべての設定を一覧表示 |
| `unset <key>` | 設定を削除 |
| `reset` | すべての設定をデフォルトにリセット |

## オプション

| フラグ | 説明 |
|--------|------|
| `--confirm` | リセット時の確認プロンプトをスキップ |
| `--format` | 出力形式（table、json、pretty-json） |
| `--quiet` | 重要でない出力を非表示（ステータスメッセージ、進行状況表示） |

## 設定キー

### コア設定

| キー | 説明 | デフォルト | 有効な値 |
|------|------|-----------|----------|
| `defaultCalendar` | イベント一覧のデフォルトカレンダー | `primary` | 任意のカレンダーID |
| `language` | 表示言語 | `en` | `en`, `ja` |

### イベントコマンドのデフォルト

| キー | 説明 | デフォルト | 有効な値 |
|------|------|-----------|----------|
| `events.maxResults` | 返却するデフォルト最大イベント数 | `10` | `1-100` |
| `events.format` | デフォルト出力形式 | `table` | `table`, `json`, `pretty-json` |
| `events.days` | デフォルト先読み日数 | `30` | `1-365` |

## 例

### 基本設定

```bash
# デフォルトカレンダーを設定
gcal config set defaultCalendar work@company.com

# 現在のデフォルトカレンダーを取得
gcal config get defaultCalendar

# すべての現在の設定を一覧表示
gcal config list

# 設定を削除（デフォルトに戻る）
gcal config unset defaultCalendar
```

### 言語設定

```bash
# 日本語に変更
gcal config set language ja

# 英語に変更
gcal config set language en

# 現在の言語設定を確認
gcal config get language
```

### イベントコマンドのデフォルト

```bash
# デフォルト表示イベント数を設定
gcal config set events.maxResults 25

# デフォルト時間範囲を設定
gcal config set events.days 60

# デフォルト出力形式を設定
gcal config set events.format json

# イベント設定を表示
gcal config get events.maxResults
gcal config get events.days
gcal config get events.format
```

### 設定管理

```bash
# すべての設定をテーブル形式で表示
gcal config list

# すべての設定をJSON形式で表示
gcal config list --format json

# すべての設定をリセット（確認あり）
gcal config reset

# すべての設定をリセット（確認をスキップ）
gcal config reset --confirm
```

## 出力形式

### listコマンド - テーブル形式（デフォルト）
```
キー                    値
────────────────────────────────────
defaultCalendar        work@company.com
language               ja
events.maxResults      25
events.format          json
events.days            60
```

### listコマンド - JSON形式
```json
{
  "defaultCalendar": "work@company.com",
  "language": "ja",
  "events": {
    "maxResults": 25,
    "format": "json",
    "days": 60
  }
}
```

### getコマンド
```bash
$ gcal config get defaultCalendar
work@company.com
```

## 設定ファイル

設定は`~/.gcal-commander/config.json`に保存されます：

```json
{
  "defaultCalendar": "work@company.com",
  "language": "ja",
  "events": {
    "maxResults": 25,
    "format": "table",
    "days": 60
  }
}
```

必要に応じてこのファイルを手動で編集できますが、configコマンドの使用が推奨されます。

## 一般的なワークフロー

### 勤務環境の設定
```bash
# 勤務用の設定
gcal config set defaultCalendar work@company.com
gcal config set events.maxResults 20
gcal config set events.days 14
gcal config set events.format table
gcal config set language ja
```

### スクリプト環境の設定
```bash
# 自動化/スクリプト用の設定
gcal config set events.format json
gcal config set events.maxResults 100
gcal config set language en
```

### 複数カレンダー管理
```bash
# プライマリ勤務カレンダーを設定
gcal config set defaultCalendar primary-work@company.com

# イベント一覧でこのカレンダーをデフォルト使用
gcal events list  # primary-work@company.comを使用

# 特定のクエリでオーバーライド
gcal events list personal@gmail.com
```

## 検証

設定値は設定時に検証されます：

- **カレンダーID**: 初回使用まで検証されません
- **数値範囲**: `maxResults`（1-100）、`days`（1-365）
- **列挙型**: `format`は"table"、"json"、"pretty-json"である必要があります
- **言語**: `language`は"en"または"ja"である必要があります
- **無効な値**: コマンドがエラーと現在の有効オプションを表示

## コマンドへの影響

設定はコマンドのデフォルト動作に影響します：

### [`gcal events list`](events-list.md)
- カレンダーが指定されていない場合、`defaultCalendar`を使用
- `--max-results`のデフォルトに`events.maxResults`を使用
- `--format`のデフォルトに`events.format`を使用
- `--days`のデフォルトに`events.days`を使用

### [`gcal events show`](events-show.md)
- 指定されていない場合、`--calendar`のデフォルトに`defaultCalendar`を使用

### すべてのコマンド
- `language`設定に基づいてメッセージを表示

コマンドラインフラグは常に設定のデフォルトをオーバーライドします。

## トラブルシューティング

### 設定をリセット
設定に問題がある場合：
```bash
gcal config reset --confirm
```

### 現在の設定を表示
```bash
gcal config list --format json
```

### 特定の設定を確認
```bash
gcal config get defaultCalendar
```

## 関連コマンド

- [`gcal events list`](events-list.md) - 設定のデフォルトを使用
- [`gcal events show`](events-show.md) - 設定のデフォルトを使用
- [`gcal calendars list`](calendars-list.md) - 設定用のカレンダーIDを検索