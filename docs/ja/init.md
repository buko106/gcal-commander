# gcal init

言語選択とGoogle Calendar認証確認を含むインタラクティブセットアップ。

## 使用方法

```bash
gcal init [options]
```

## オプション

| フラグ | 短縮形 | 説明 | デフォルト |
|--------|--------|------|-----------|
| `--format` | `-f` | 出力形式（table、json、pretty-json） | `table` |
| `--quiet` | `-q` | 重要でない出力を非表示（ステータスメッセージ、進行状況表示） | `false` |

## 説明

`init`コマンドは、以下をサポートするインタラクティブセットアップ体験を提供します：

1. **優先言語の選択** - サポートされているオプション（日本語、英語、スペイン語、ドイツ語、ポルトガル語、フランス語、韓国語）から選択
2. **Google Calendar認証の確認** - Google Calendar APIへの接続をテストして認証を確認

以下を確実にします：
- インターフェース言語が好みに設定される
- 認証情報ファイルが適切に設定されている
- 認証トークンが有効である
- Google Calendarへのアクセス権限がある

このコマンドは以下の場合に特に有用です：
- gcal-commanderの初回設定時
- インターフェース言語設定の変更時
- 認証問題のトラブルシューティング
- 認証情報に変更を加えた後の設定確認

## 例

### 基本的な使用方法

```bash
# 言語選択と認証確認を含むインタラクティブセットアップ
gcal init

# 静寂にセットアップを実行（スクリプト用）
gcal init --quiet
```

## インタラクティブフロー

`gcal init`を実行すると、2段階のインタラクティブプロセスが実行されます：

### ステップ1: 言語選択

まず、優先するインターフェース言語を選択するプロンプトが表示されます：

```
? 優先言語を選択してください（矢印キーで選択）
❯ English (en)
  日本語 (ja)
  Español (es)
  Deutsch (de)
  Português (pt)
  Français (fr)
  한국어 (ko)
```

- 矢印キーでナビゲート
- Enterを押して優先言語を選択
- 選択した言語は設定に保存されます

### ステップ2: 認証確認

言語選択後、Google Calendar認証を確認するプロンプトが表示されます：

```
? 認証を確認しますか？ (Y/n) 
```

- Enterを押すか`y`と入力して確認を続行
- `n`と入力して認証確認をスキップ

**注意**: `--quiet`フラグはインタラクティブプロンプトを非表示にし、可能な場合はデフォルト値を使用します。

## 成功出力

認証が成功した場合：

```
✓ Google Calendar認証を確認中...
認証が成功しました！
```

## エラーハンドリング

認証が失敗した場合、トラブルシューティング情報付きのエラーメッセージが表示されます：

```
✗ Google Calendar認証を確認中...
認証に失敗しました: [エラーの詳細]
コマンドを再実行するか、Google Calendar API認証情報を確認してください。
```

よくある認証エラー：
- 認証情報ファイルの不足または無効
- 期限切れの認証トークン
- 不十分な権限
- ネットワーク接続の問題

## 前提条件

`gcal init`を実行する前に、以下を確認してください：

1. **Google Calendar APIが有効化済み** - Google Cloud Consoleで有効化
2. **OAuth 2.0認証情報** - ダウンロード済みで`~/.gcal-commander/credentials.json`に配置
3. **ネットワークアクセス** - GoogleのAPIへのアクセス

認証設定がまだの場合は、READMEの[初期設定](../README.md#初期設定)ガイドに従ってください。

## トラブルシューティング

### 認証失敗

`gcal init`が失敗した場合：

1. **認証情報ファイルを確認**: `~/.gcal-commander/credentials.json`が存在し、有効なOAuth 2.0認証情報を含んでいることを確認
2. **トークンを再生成**: `~/.gcal-commander/token.json`を削除し、任意のgcalコマンドを実行して再認証
3. **APIアクセスを確認**: Google Cloud ConsoleでGoogle Calendar APIが有効化されていることを確認
4. **ネットワークを確認**: インターネットアクセスがあり、Googleのサーバーに到達できることを確認

### ファイル権限

権限エラーが発生した場合：

```bash
# ファイル権限を確認
ls -la ~/.gcal-commander/

# 必要に応じて権限を修正
chmod 600 ~/.gcal-commander/credentials.json
chmod 600 ~/.gcal-commander/token.json
```

## 使用例

- **初回セットアップ** - 言語設定と認証確認を設定
- **言語切り替え** - インターフェース言語を7つのサポートされているオプションのいずれかに変更
- **初期設定確認** - 設定後に認証が動作していることを確認
- **トラブルシューティング** - 認証問題の診断
- **CI/CD統合** - 自動化環境での認証確認
- **ヘルスチェック** - 認証がまだ有効であることを定期的に確認

## 関連コマンド

- [`gcal calendars list`](calendars-list.md) - 利用可能なカレンダーを一覧表示（認証もテスト）
- [`gcal events list`](events-list.md) - イベントを一覧表示（認証が必要）
- [`gcal config`](config.md) - 設定を管理

## 参考

- [初期設定ガイド](../README.md#初期設定) - 完全な設定手順
- [Google Calendar API設定](https://console.cloud.google.com/) - Google Cloud Console