# Nail AI App — Web Prototype

> iOSネイティブアプリ「Nail Jewelry Box」の体験検証用リポジトリ  
> 最終ゴール: App Store公開 → 詳細は [ROADMAP.md](./ROADMAP.md) を参照

---

## リポジトリ構成

```
nail-report/
├── prototype/
│   └── jewelry-box.html   # 3Dジュエリーボックス Webプロトタイプ（UX検証用）
├── src/                   # React + TypeScript アプリ（将来の移植先）
├── ROADMAP.md             # 開発ロードマップ & 技術スタック
└── .github/workflows/     # CI（npm run build ガード）
```

---

## Webプロトタイプの確認方法

`prototype/jewelry-box.html` は**単一HTMLファイル**で動作します。サーバー不要。

### ローカルで開く

```bash
# 方法1: ブラウザで直接開く（最速）
open prototype/jewelry-box.html          # macOS
start prototype/jewelry-box.html         # Windows

# 方法2: VS Code Live Server 拡張を使う
# → jewelry-box.html を右クリック → "Open with Live Server"

# 方法3: Python 簡易サーバー（CORS制限を避けたい場合）
python -m http.server 8080
# → http://localhost:8080/prototype/jewelry-box.html
```

### iPhone Safari で確認する

```bash
# 同一Wi-Fi上で Python サーバーを起動し、
# iPhoneのSafariから http://<PCのIPアドレス>:8080/prototype/jewelry-box.html にアクセス
```

### プロトタイプでできること

| 操作 | 内容 |
|------|------|
| ドラッグ | ジュエリーボックスを回転 |
| タップ / クリック | ネイルカードの詳細を表示 |
| SPHERE / GRID / SPIRAL | レイアウトモードの切り替え |
| Glass / Snow Globe / Velvet / Showcase | ボックススキンの切り替え |
| 左下の `+` ボタン | 自分のネイル写真をコレクションに追加 |

---

> **注意**: `prototype/jewelry-box.html` は**UX検証専用**です。  
> React（`src/`）や将来のSwiftUI実装とはコードを共有しません。  
> Web版で確定した体験設計・パラメータは「仕様書」として iOS 実装へ引き継ぎます。

---

## React アプリ（開発環境）

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド（CI で自動実行）
```

---

## CI

Pull Request を `main` へ出すと GitHub Actions が以下を自動実行します。

1. `npm ci` — 依存関係インストール
2. CSS ガードスクリプト
3. `npm run build` — TypeScript コンパイル + Vite ビルド

すべてパスすることが main マージの条件です。

---

## 関連ドキュメント

- [ROADMAP.md](./ROADMAP.md) — フェーズ別開発計画・技術スタック・KPI
