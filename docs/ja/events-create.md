# gcal events create

柔軟なスケジューリングオプション、参加者、メタデータを使用して新しいカレンダーイベントを作成します。

## 使用方法

```bash
gcal events create <summary> [options]
```

## 引数

| 引数 | 説明 | 必須 |
|------|------|------|
| `summary` | イベントタイトル/概要 | はい |

## オプション

| フラグ | 短縮形 | 説明 | デフォルト |
|--------|--------|------|-----------|
| `--start` | `-s` | 開始日時（ISO形式） | 必須 |
| `--end` | `-e` | 終了日時（ISO形式） | - |
| `--duration` | `-d` | 継続時間（分）（--endの代替） | `60` |
| `--all-day` | | 終日イベントを作成 | `false` |
| `--calendar` | `-c` | イベントを作成するカレンダーID | `primary` |
| `--location` | `-l` | イベントの場所 | - |
| `--description` | | イベントの説明 | - |
| `--attendees` | | 参加者メールアドレスのカンマ区切りリスト | - |
| `--send-updates` | | イベント招待を送信（all/externalOnly/none） | `none` |
| `--fields` | | テーブル形式で表示するフィールドのカンマ区切りリスト | すべてのフィールド |
| `--format` | `-f` | 出力形式（table、json、pretty-json） | `table` |
| `--quiet` | `-q` | 重要でない出力を非表示（ステータスメッセージ、進行状況表示） | `false` |

## 時間の指定

### 時刻付きイベント
日時にはISO 8601形式を使用：
```bash
# 基本形式
gcal events create "ミーティング" --start "2024-01-15T14:00:00"

# タイムゾーン付き
gcal events create "電話会議" --start "2024-01-15T14:00:00-08:00"
```

### 終日イベント
日付のみの形式（YYYY-MM-DD）を使用：
```bash
gcal events create "カンファレンス" --start "2024-01-15" --all-day
```

### 継続時間 vs 終了時刻
- 便利のため`--duration`を分単位で使用
- 特定の終了時刻には`--end`を使用
- `--end`と`--duration`の両方は指定できません

## 例

### 基本的なイベント作成

```bash
# シンプルな1時間のミーティング（デフォルト継続時間）
gcal events create "チームミーティング" --start "2024-01-15T14:00:00"

# 特定の継続時間のミーティング
gcal events create "朝会" --start "2024-01-15T09:00:00" --duration 30

# 特定の終了時刻のミーティング
gcal events create "プロジェクトレビュー" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00"
```

### 終日イベント

```bash
# 単日イベント
gcal events create "カンファレンス" --start "2024-01-15" --all-day

# 複数日イベント（終了日は除外される）
gcal events create "休暇" --start "2024-01-15" --end "2024-01-20" --all-day
```

### メタデータ付きイベント

```bash
# 場所付きミーティング
gcal events create "クライアントミーティング" \
  --start "2024-01-15T14:00:00" \
  --duration 90 \
  --location "会議室A"

# 説明付きイベント
gcal events create "スプリント計画" \
  --start "2024-01-15T10:00:00" \
  --duration 120 \
  --description "次のスプリントのタスク計画"
```

### 参加者付きイベント

```bash
# 招待を送信せずに参加者を追加
gcal events create "チーム同期" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com"

# 参加者に招待を送信
gcal events create "重要なミーティング" \
  --start "2024-01-15T14:00:00" \
  --attendees "alice@company.com,bob@company.com" \
  --send-updates all
```

### 異なるカレンダー

```bash
# 勤務先カレンダーに作成
gcal events create "スプリントデモ" \
  --start "2024-01-15T15:00:00" \
  --calendar work@company.com

# 個人カレンダーに作成
gcal events create "医者の予約" \
  --start "2024-01-15T10:00:00" \
  --calendar personal@gmail.com
```

### 高度な例

```bash
# 完全なミーティング設定
gcal events create "四半期レビュー" \
  --start "2024-01-15T14:00:00" \
  --end "2024-01-15T17:00:00" \
  --location "メイン会議室" \
  --description "Q4結果とQ1計画" \
  --attendees "team@company.com,manager@company.com" \
  --calendar work@company.com \
  --send-updates all

# スクリプト用JSON出力
gcal events create "自動イベント" \
  --start "2024-01-15T14:00:00" \
  --format json --quiet
```

## 出力形式

**テーブル形式（デフォルト）：**
```
イベントが正常に作成されました！

タイトル: チームミーティング
ID: abc123def456
開始: 2024/1/15 14:00:00
終了: 2024/1/15 15:00:00
場所: 会議室A
Google Calendarリンク: https://calendar.google.com/event?eid=...
```

**JSON形式：**
```json
{
  "id": "abc123def456",
  "summary": "チームミーティング",
  "start": {
    "dateTime": "2024-01-15T14:00:00-08:00"
  },
  "end": {
    "dateTime": "2024-01-15T15:00:00-08:00"
  },
  "location": "会議室A",
  "htmlLink": "https://calendar.google.com/event?eid=..."
}
```

## 参加者管理

### 招待オプション
- `none`（デフォルト） - 参加者を追加するが招待は送信しない
- `all` - すべての参加者に招待を送信
- `externalOnly` - 外部参加者のみに招待を送信

### 参加者形式
メールアドレスをカンマで区切って提供：
```bash
--attendees "alice@company.com,bob@external.com,charlie@company.com"
```

## タイムゾーンの処理

- **ローカル時間**: タイムゾーンが指定されていない場合、ローカルタイムゾーンを使用
- **明示的タイムゾーン**: ISO形式でタイムゾーンオフセットを含める
- **終日イベント**: 日付のみの形式、タイムゾーン非依存

## 検証とエラーハンドリング

### よくあるエラー
- **無効な日付形式**: 時刻付きイベントにはISO 8601形式を確認
- **endとdurationの両方指定**: `--end`と`--duration`の両方は指定できません
- **無効な継続時間**: 正の整数（分）である必要があります
- **過去の日付**: 警告が表示されますがイベントは作成されます

### 日付形式の例
```bash
# 有効な形式
--start "2024-01-15T14:00:00"           # ローカルタイムゾーン
--start "2024-01-15T14:00:00-08:00"     # 太平洋時間
--start "2024-01-15T22:00:00Z"          # UTC
--start "2024-01-15" --all-day          # 終日イベント

# 無効な形式
--start "2024年1月15日"                  # ISO形式を使用
--start "14:00"                         # 日付が不足
```

## 使用例

- **ミーティングスケジューリング** - 参加者と場所を含むミーティングを作成
- **イベント計画** - カンファレンス、ワークショップ、社交イベントの設定
- **個人リマインダー** - 予定と個人イベントの作成
- **繰り返し設定** - 手動繰り返し用のテンプレートイベント作成
- **自動化** - 外部システムからのイベント作成スクリプト

## 関連コマンド

- [`gcal events list`](events-list.md) - 作成されたイベントを表示
- [`gcal events show`](events-show.md) - イベントの詳細情報を取得
- [`gcal calendars list`](calendars-list.md) - 利用可能なカレンダーIDを検索
- [`gcal config`](config.md) - デフォルト設定を構成