# gcal calendars list

Googleアカウントを通じてアクセス可能なすべてのカレンダーを一覧表示します。

## 使用方法

```bash
gcal calendars list [options]
```

## オプション

| フラグ | 短縮形 | 説明 | デフォルト |
|--------|--------|------|-----------|
| `--fields` | | テーブル形式で表示するフィールドのカンマ区切りリスト | すべてのフィールド |
| `--format` | `-f` | 出力形式（table、json、pretty-json） | `table` |
| `--quiet` | `-q` | 重要でない出力を非表示（ステータスメッセージ、進行状況表示） | `false` |

## 例

### 基本的な使用方法

```bash
# すべてのカレンダーをテーブル形式で一覧表示
gcal calendars list

# カレンダーをJSON形式で一覧表示
gcal calendars list --format json

# カレンダーを静寂に一覧表示（ステータスメッセージなし）
gcal calendars list --quiet

# カレンダー名とIDのみ表示
gcal calendars list --fields name,id

# カレンダー名のみ表示（クイック概要用）
gcal calendars list --fields name
```

### 出力形式

**テーブル形式（デフォルト）：**
```
利用可能なカレンダー（3件見つかりました）：

1. 田中太郎（プライマリ）
   ID: primary
   アクセス: owner

2. 勤務先カレンダー
   ID: work@company.com
   アクセス: owner

3. 家族イベント
   ID: family@gmail.com
   アクセス: reader
```

**JSON形式：**
```json
[
  {
    "id": "primary",
    "summary": "田中太郎",
    "primary": true,
    "accessRole": "owner"
  },
  {
    "id": "work@company.com",
    "summary": "勤務先カレンダー",
    "accessRole": "owner"
  }
]
```

## テーブルフィールドのカスタマイズ

`--fields`フラグを使用して、テーブル形式で表示する列をカスタマイズできます：

### 利用可能なフィールド

- `name` - カレンダー名/概要
- `id` - カレンダーID
- `access` - アクセス権限（owner、reader、writer等）
- `primary` - プライマリカレンダー表示
- `description` - カレンダー説明
- `color` - カレンダーの色

### 例

```bash
# 名前とIDのみ表示（最も一般的な用途）
gcal calendars list --fields name,id

# 名前、ID、アクセス権限を表示
gcal calendars list --fields name,id,access

# 名前のみ表示（クイック概要用）
gcal calendars list --fields name

# カレンダーの色とアクセス権限を表示
gcal calendars list --fields name,color,access
```

**注意**: `--fields`フラグはテーブル形式の出力にのみ影響します。JSON出力は常にすべての利用可能なフィールドを含みます。

## 使用例

- **利用可能なカレンダーの発見** - アクセス権のあるすべてのカレンダーを確認
- **カレンダーIDの検索** - 他のコマンドで使用する正確なカレンダーIDを取得
- **スクリプト** - `--format json`でカレンダーデータをプログラム的に解析
- **クイック概要** - イベント一覧表示前に利用可能なカレンダーを確認

## 他のコマンドとの統合

このコマンドで返されるカレンダーIDは以下で使用できます：

- [`gcal events list <calendar-id>`](events-list.md) - 特定のカレンダーからイベントを一覧表示
- [`gcal events show <event-id> --calendar <calendar-id>`](events-show.md) - 特定のカレンダーからイベント詳細を表示
- [`gcal config set defaultCalendar <calendar-id>`](config.md) - デフォルトカレンダーを設定

## 関連コマンド

- [`gcal events list`](events-list.md) - カレンダーからイベントを一覧表示
- [`gcal config`](config.md) - デフォルトカレンダー設定を構成