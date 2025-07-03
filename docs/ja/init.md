# gcal init

Google Calendar認証設定を確認し、Google Calendar APIへの接続をテストします。

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

`init`コマンドは、Google Calendar認証が正しく動作していることを確認します。Google Calendar APIへのテスト接続を実行して以下を確認します：

- 認証情報ファイルが適切に設定されている
- 認証トークンが有効である
- Google Calendarへのアクセス権限がある

このコマンドは以下の場合に特に有用です：
- gcal-commanderの初回設定時
- 認証問題のトラブルシューティング
- 認証情報に変更を加えた後の設定確認

## 例

### 基本的な使用方法

```bash
# 確認プロンプト付きで認証を確認
gcal init

# 静寂に認証を確認（スクリプト用）
gcal init --quiet
```

## インタラクティブフロー

`gcal init`を実行すると、認証確認の確認プロンプトが表示されます：

```
これはGoogle Calendar認証を確認します。
? 認証を確認しますか？ (Y/n) 
```

- Enterを押すか`y`と入力して確認を続行
- `n`と入力して操作をキャンセル

**注意**: 初期ステータスメッセージ「これはGoogle Calendar認証を確認します。」は`--quiet`フラグ使用時でも常に表示されます。`--quiet`フラグは「Google Calendar認証を確認中...」の進行メッセージのみを非表示にします。

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