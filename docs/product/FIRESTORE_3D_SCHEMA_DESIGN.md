# Firestore 3D Schema Design (Phase 8)

## 概要
Phase 8 (3D Preview Foundation) における、ネイルチップの3D表示・カスタマイズ機能をサポートするための Firestore スキーマ拡張設計です。

技術選定（[3D_LIBRARY_EVALUATION.md](./3D_LIBRARY_EVALUATION.md)）に基づき、**React Three Fiber (R3F)** を使用して動的なマテリアル変更やモデル表示を行うためのデータを保持します。

## スキーマ拡張の定義

`NailItem` コレクション（`users/{userId}/nailItems/{itemId}`）に、以下のオプションフィールドを追加します。

### 新規フィールド一覧

| フィールド名 | 型 | 説明 | 例 |
|---|---|---|---|
| `shape` | string | ネイルチップの形状（ID/スラグ） | `"oval"`, `"square"`, `"almond"` |
| `color` | string | ベースカラー（Hex Code 等） | `"#FF69B4"` |
| `texture` | string | テクスチャ識別子またはURL | `"glitter-silver"`, `"matte"` |
| `modelUrl` | string | 使用する3Dモデル（GLB）の Storage URL | `"gs://.../models/default.glb"` |
| `materialPreset` | string | マテリアル設定のプリセット名 | `"standard"`, `"metallic"`, `"glass"` |

## TypeScript 型定義

`src/lib/firestoreModel.ts` 等に導入予定の型定義案です。

```typescript
export interface Nail3DConfig {
  shape?: string;
  color?: string;
  texture?: string;
  modelUrl?: string;
  materialPreset?: string;
}

// NailItem への統合
export interface NailItem {
  // ... 既存フィールド ...
  title: string;
  imageUrl: string;
  // ...

  // Phase 8 追加フィールド (すべて optional)
  shape?: string;
  color?: string;
  texture?: string;
  modelUrl?: string;
  materialPreset?: string;
}
```

## マイグレーション戦略

### 方針: オンデマンド・ノーマイグレーション
- すべての新規フィールドを **Optional (省略可能)** とします。
- 既存のドキュメントにはこれらのフィールドが存在しませんが、アプリケーション側でデフォルト値を適用するか、3D表示をスキップすることで対応します。
- したがって、DB全体のデータ一括更新（マイグレーションスクリプトの実行）は不要です。

## Firestore Security Rules への影響

### 許可とバリデーション
新規フィールドの書き込みを許可するために `firestore.rules` の更新が必要になる場合があります（既存のルールが `hasOnly` などで厳密に制限している場合）。

現在の `firestore.rules` は `allow write: if request.auth.uid == userId` となっており、特定のフィールドセットへの制限は `nailItems` に対しては行われていません。将来的に型バリデーションを強化する場合は、以下のようなルールを追加検討します。

```javascript
// バリデーション案
allow update: if request.auth.uid == userId
               && (
                 !request.resource.data.diff(resource.data).affectedKeys().hasAny(['shape']) ||
                 request.resource.data.shape is string
               )
```

## 関連ドキュメント
- [3D_LIBRARY_EVALUATION.md](./3D_LIBRARY_EVALUATION.md): 3D ライブラリ選定経緯 (React Three Fiber)
- [ROADMAP.md](./ROADMAP.md): Phase 8 開発計画
- [FIRESTORE_SECURITY_RULES.md](../operations/FIRESTORE_SECURITY_RULES.md): セキュリティルール設計方針

---
## Human Gates
- **G3 (DB スキーマ変更)**: 本ドキュメントの設計内容について人間の承認を得ること。
- **G8 (ライブラリ追加)**: 3D 表示実装時に React Three Fiber 関連パッケージを追加することへの承認。
