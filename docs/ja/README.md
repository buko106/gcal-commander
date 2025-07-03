gcal-commander
=================

Google Calendarの操作を行うコマンドラインインターフェース。ターミナルから直接Google Calendarのイベントやカレンダーを管理できます。

> 🤖 このプロジェクトは主に[Claude Code](https://claude.ai/code)を使用して開発されており、AI支援開発の能力を実証しています。


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)
[![Downloads/week](https://img.shields.io/npm/dw/gcal-commander.svg)](https://npmjs.org/package/gcal-commander)


## 機能

- 📅 **Google Calendarイベントの閲覧** - イベントの一覧表示と詳細情報の確認
- ✏️ **カレンダーイベントの作成** - 柔軟な時間設定、参加者、場所の指定で新しいイベントを追加
- 📋 **複数カレンダーの管理** - すべてのGoogle Calendarにアクセス
- 🔐 **安全なOAuth2認証** - 一度の設定でトークンの自動更新
- 💻 **ターミナル向け出力** - スクリプト用のテーブル形式またはJSON形式
- 🔇 **静寂モードサポート** - スクリプト用に`--quiet`フラグでステータスメッセージを非表示
- 🚀 **高速・軽量** - oclifフレームワークで構築

## インストール

```bash
npm install -g gcal-commander
```

## 初期設定

gcal-commanderを使用する前に、Google Calendar APIアクセスの設定が必要です：

### 1. Google Cloud Consoleの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. Google Calendar APIを有効化：
   - 「APIとサービス」>「ライブラリ」に移動
   - 「Google Calendar API」を検索
   - クリックして「有効にする」を押下

### 2. OAuth 2.0認証情報の作成

1. 「APIとサービス」>「認証情報」に移動
2. 「認証情報を作成」>「OAuth クライアント ID」をクリック
3. プロンプトが表示された場合、OAuth同意画面を設定：
   - 「外部」ユーザータイプを選択
   - 必須フィールドを入力（アプリケーション名、ユーザーサポートメール、開発者連絡先）
   - テストユーザーにあなたのメールアドレスを追加
4. アプリケーションの種類で「デスクトップアプリケーション」を選択
5. 名前を入力（例：「gcal-commander」）
6. 「作成」をクリック
7. 認証情報JSONファイルをダウンロード

### 3. 認証情報ファイルの設定

ダウンロードした認証情報ファイルをgcal-commanderの設定ディレクトリに配置：

```bash
# 設定ディレクトリを作成
mkdir -p ~/.gcal-commander

# ダウンロードした認証情報ファイルをコピー
cp ~/Downloads/client_secret_*.json ~/.gcal-commander/credentials.json
```

### 4. 初回実行認証

gcal-commanderを初回実行すると：

1. デフォルトブラウザでGoogle OAuth認証が開きます
2. Googleアカウントへのサインインを求められます
3. Google Calendarへのアクセス許可を求められます
4. 認証トークンが自動的に保存されます

```bash
# 初回実行 - 認証フローがトリガーされます
gcal calendars list
```

認証トークンは`~/.gcal-commander/token.json`に保存され、必要に応じて自動的に更新されます。

## 基本的な使用方法

```bash
# すべてのカレンダーを一覧表示
gcal calendars list

# プライマリカレンダーから今後のイベントを一覧表示
gcal events list

# 特定のカレンダーからイベントを一覧表示
gcal events list my-calendar@gmail.com

# イベントの詳細情報を表示
gcal events show <event-id>

# 新しいイベントを作成
gcal events create "チームミーティング" --start "2024-01-15T14:00:00" --duration 60

# 終日イベントを作成
gcal events create "カンファレンス" --start "2024-01-15" --all-day

# イベント数と時間範囲を制限
gcal events list --max-results 5 --days 7

# スクリプト用の静寂モード（ステータスメッセージを非表示）
gcal events list --quiet --format json | jq '.[] | .summary'

# 設定例
gcal config set defaultCalendar work@company.com
gcal events list  # work@company.comをデフォルトとして使用
```

## 設定

gcal-commanderはデフォルト動作をカスタマイズするためのグローバル設定をサポートしています：

```bash
# イベント一覧のデフォルトカレンダーを設定
gcal config set defaultCalendar work@company.com

# 表示するイベント数のデフォルトを設定
gcal config set events.maxResults 25

# デフォルト出力形式を設定
gcal config set events.format json

# デフォルト時間範囲（日数）を設定
gcal config set events.days 60

# すべての現在の設定を表示
gcal config list

# 特定の設定値を表示
gcal config get defaultCalendar

# 設定を削除
gcal config unset defaultCalendar

# すべての設定をリセット
gcal config reset --confirm
```

### 設定オプション

- `defaultCalendar` - `gcal events list`のデフォルトカレンダーID（デフォルト："primary"）
- `events.maxResults` - デフォルトの最大イベント数（1-100、デフォルト：10）
- `events.format` - デフォルト出力形式："table"または"json"（デフォルト："table"）
- `events.days` - デフォルトの先読み日数（1-365、デフォルト：30）

設定は`~/.gcal-commander/config.json`に保存され、手動で編集することも可能です。

## コマンド

gcal-commanderはGoogle Calendarとやり取りするためのいくつかのコマンドを提供します：

### カレンダー管理
- **[`gcal calendars list`](calendars-list.md)** - 利用可能なすべてのカレンダーを一覧表示

### イベント管理  
- **[`gcal events list`](events-list.md)** - 今後のカレンダーイベントを一覧表示
- **[`gcal events show`](events-show.md)** - イベントの詳細情報を表示
- **[`gcal events create`](events-create.md)** - 柔軟なスケジューリングオプションで新しいカレンダーイベントを作成

### 設定
- **[`gcal config`](config.md)** - グローバル設定の管理

### セットアップ・認証
- **[`gcal init`](init.md)** - Google Calendar認証設定の確認

### ヘルプ
- **`gcal help`** - 任意のコマンドのヘルプを表示

各コマンドの詳細な使用例とオプションについては、上記のリンクをクリックして包括的なドキュメントをご覧ください。

## 貢献

gcal-commanderへの貢献を歓迎します！このプロジェクトはAI支援開発を受け入れています。

### 推奨開発ワークフロー

- **開発支援に[Claude Code](https://claude.ai/code)を使用** - 機能実装からコードレビューまで
- **品質保証**: 変更内容をClaude Codeでレビューし、コード品質、ベストプラクティス、一貫性を確保
- **テスト**: `npm test`ですべてのテストが通ることを確認
- **リンティング**: プリコミットフックによるコードの自動リンティングとフォーマット

### 開発環境の設定

1. リポジトリをフォークしてクローン
2. 依存関係をインストール: `npm install`
3. **開発ワークフロー**:
   - **アクティブ開発用**: `./bin/dev.js COMMAND`でTypeScriptソースファイルから直接コマンドを実行（ビルド不要）
   - **最終テスト用**: `npm run build && ./bin/run.js COMMAND`でプロダクションビルドをテスト
4. 変更を行いテストを実行: `npm test`
5. プルリクエストを提出

**CLI実行モード:**
- `./bin/dev.js` - 開発モード（ts-nodeでTypeScriptソースファイル、即座に変更反映）
- `./bin/run.js` - プロダクションモード（dist/からコンパイル済みJavaScript、ビルドが必要）

プロジェクトはHusky + lint-stagedを使用してコミット前の自動コード品質チェックを行います。

## 言語サポート

gcal-commanderは国際化（i18n）をサポートしており、現在英語と日本語で利用可能です：

```bash
# 初回セットアップ時に言語を選択
gcal init

# 設定で言語を変更
gcal config set language ja  # 日本語
gcal config set language en  # 英語
```

コマンドの出力メッセージ、エラーメッセージ、ステータスメッセージが選択した言語で表示されます。