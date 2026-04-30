# ジュエリーボックス体験仕様書

> **対象プロトタイプ**: `prototype/jewelry-box.html`  
> **バージョン**: v2（2026年4月時点）  
> **目的**: このドキュメントは Web プロトタイプで確認した体験設計を、React / iOS SwiftUI / RealityKit への移植指針として整理したものです。コードは流用しません。体験・パラメータ・UXロジックを継承します。

---

## 目次

1. [体験コンセプト](#1-体験コンセプト)
2. [画面構成](#2-画面構成)
3. [レイアウトモード](#3-レイアウトモード)
4. [スキン](#4-スキン)
5. [ネイルデータ構造](#5-ネイルデータ構造)
6. [ユーザー操作](#6-ユーザー操作)
7. [React 実装方針](#7-react-実装方針)
8. [iOS 実装方針](#8-ios-実装方針)
9. [今回やらないこと](#9-今回やらないこと)
10. [次の実装ステップ](#10-次の実装ステップ)

---

## 1. 体験コンセプト

### 基本思想

「ネイルを記録する」ではなく、**「コレクションとして魅せる」**体験を作る。

ネイルは消耗品だが、その瞬間の美しさは本物のジュエリーと同じ価値を持つ。Nail Jewelry Box はその瞬間をデジタルのジュエリーボックスに収め、ユーザーが自分のコレクションを「鑑賞する」ことを楽しめるようにする。

### 体験のキーワード

| キーワード | 意味 |
|---|---|
| **コレクション感** | 並べて見る、増えていく喜び |
| **高級感** | ダーク背景、ゴールドフレーム、光沢マテリアル |
| **没入感** | 全画面 3D、ドラッグで回転、爪が浮遊する |
| **選ぶ楽しさ** | スキン切り替え、レイアウト切り替え |
| **発見** | 球体が回転するうちに思わぬ爪が目に入る |

### ターゲット感情

ユーザーが「このアプリ、なんか高そう」「ジュエリーショップみたい」と感じることがゴール。  
「かわいいネイルアプリ」ではなく「大人向けのコレクションツール」として差別化する。

### デザイン原則

- **ダークベース**: 背景は `#050308`（ほぼ黒、わずかに紫寄り）
- **ゴールドアクセント**: フレームは `#ffd700`、ピンクアクセントは `#ec407a`
- **グラスモーフィズム**: UI要素は `backdrop-filter: blur(20px)` + 低透過背景
- **余白と密度**: 爪を詰め込まず、空間に漂わせる
- **タイポグラフィ**: 文字は細め（`font-weight: 200〜300`）、letter-spacing広め

---

## 2. 画面構成

全画面が 3D キャンバスで、UI はその上に浮遊するレイヤーとして配置される。スクロールは存在しない。

```
┌────────────────────────────────────┐
│  [JEWELRY BOX]   ← ヘッダー（中央）  │  z-index: 10
│  YOUR NAIL COLLECTION              │
├────────────────────────────────────┤
│  [SPHERE]               [20 / 30]  │  z-index: 10（左: レイアウト、右: カウンター）
│                                    │
│                                    │
│          3D ジュエリーボックス        │  z-index: 0（WebGL canvas 全画面）
│          （爪が浮遊・回転）           │
│                                    │
│                                    │
│  [+]     GLASS CASE ← スキン名     │  z-index: 10（左: アップロード、中央: スキン名）
│ [Glass][Snow Globe][Velvet][Showcase]│  z-index: 10（スキンセレクター）
└────────────────────────────────────┘

↓ 爪タップ時

┌────────────────────────────────────┐
│  ████████████（ぼかし背景）████████  │
│                                    │
│       選んだ爪が中央に大きく表示       │
│                                    │
├──────────────────────────────────  │
│  ——（ハンドル）——                   │
│  Pink Marble            ← 名前     │  ← ボトムシート（下から出現）
│  2026.04.15             ← 日付     │
│  [マーブル] [ピンク]     ← タグ     │
│  ─────────────────────────────    │
│  SHAPE     SALON     PRICE        │
│  Almond    VIP Nail  ¥6,000       │
└────────────────────────────────────┘
```

### 各エリアの仕様

| エリア | 位置 | 役割 | 注意点 |
|---|---|---|---|
| ヘッダー | `position: fixed; top: 0` | タイトル表示のみ、タップ不可 | `pointer-events: none` |
| 3D キャンバス | 全画面 fixed | 爪の 3D 表示、ドラッグ回転 | WebGL / RealityKit |
| レイアウトトグル | top-left pill | タップで Sphere→Grid→Spiral 循環 | テキスト表示のみで切り替え |
| カウンター | top-right pill | 「現在件数 / 上限」表示 | 読み取り専用 |
| スキン名表示 | bottom-center | スキン切り替え直後のみ 2.2 秒表示 | `opacity: 0→1→0` でフェード |
| スキンセレクター | bottom pill group | 4 ボタン、アクティブ反転（白地黒字） | 横並び、画面幅に合わせ wrap |
| アップロードボタン | bottom-left circle FAB | 写真追加。将来 AI 美化変換のトリガー | ピンク系アクセント |
| 詳細オーバーレイ | 全画面 | ぼかし背景 + ボトムシート | 上 60% タップで閉じる |

---

## 3. レイアウトモード

タップ 1 回でモードを順番に切り替える（Sphere → Grid → Spiral → Sphere ...）。  
切り替え時にアニメーションはなく、各爪が次フレームから新しい位置に向かって浮遊する。

### 3-1. Sphere（デフォルト）

**見た目**: 爪が球面上にランダムに分散し、グループ全体がゆっくり自転する。

**用途**: コレクション全体を「眺める」。どこに何があるか分からない偶発的な発見を楽しむ。

**配置アルゴリズム**: フィボナッチ球 + 黄金角

```
phi   = acos(1 - 2 * (i + 0.5) / n)   // 緯度
theta = PI * (1 + sqrt(5)) * i          // 黄金角による経度
r     = 2.4 + random() * 0.3           // わずかなランダム半径
x     = r * sin(phi) * cos(theta)
y     = r * sin(phi) * sin(theta)
z     = r * cos(phi)
```

**アニメーション**:
- グループ全体が `t * 0.05` rad/s で自動 Y 回転
- 各爪は個別に ±0.05〜0.08 の振幅で浮遊（sin/cos ベース）
- 各爪がランダム速度（約0.004 rad/frame）で個別自転

**実装上の注意**:
- アイテム数が変わると配置が再計算されるため、追加・削除時に `applyLayout()` を再呼び出しする
- Random radius により、毎回起動のたびにわずかに配置が変わる（意図的）

### 3-2. Grid

**見た目**: 爪が 4 列のグリッドに整列。正面を向いてゆっくり首を振る。

**用途**: 一覧性が高く、全件を比較したいときに使う。

**配置計算**:

```
cols = 4
col  = i % cols
row  = floor(i / cols)
x    = (col - cols/2 + 0.5) * 1.3    // 列間隔 1.3
y    = (1 - row) * 1.5               // 行間隔 1.5
z    = 0                             // 平面
```

**アニメーション**:
- グループ全体の自動回転なし
- 各爪は `rotation.y = sin(t * 0.3 + offset) * 0.3` で首振り
- X 軸 `cos(t * 0.4) * 0.15` でわずかなうなずき

**実装上の注意**:
- 爪の正面方向（法線）を統一する必要あり。Sphere/Spiral では各爪がランダム向きだが、Grid 切り替え時は `rotation.set(0,0,0)` にリセット
- 件数が 4 の倍数でない場合、最終行が左詰めになる

### 3-3. Spiral

**見た目**: 爪が螺旋状に並び、内側から外側へ広がりながら高さ方向にも延伸する。

**用途**: 時系列を意識したときの表示。中心から外に向かって古い順にするとタイムライン感が出る。

**配置計算**:

```
angle  = i * 0.7                   // 0.7 rad/item ≒ 40°
radius = 0.5 + i * 0.18           // 中心から外へ広がる
x      = radius * cos(angle)
y      = (i - n/2) * 0.3          // 高さ方向に分散
z      = radius * sin(angle)
```

**アニメーション**:
- Sphere と同じ個別自転（ランダム速度）
- グループ自動回転あり（Sphere と同速）

**実装上の注意**:
- 件数が増えると螺旋が外側へ大きく広がる。上限（30 件）を超えると視野外に出る可能性があるため、iOS 実装時はカメラ FOV の調整か半径の上限設定を検討する

---

## 4. スキン

スキン切り替え時は、既存の `boxGroup` の子を全削除して新しいスキンを追加する。爪オブジェクト自体は共通で変わらない。

### 4-1. Glass Case（デフォルト）

| 項目 | 値 |
|---|---|
| 背景色 | `#050308`（ほぼ黒・紫味） |
| 印象 | ミニマル、純粋、モダン |
| キャッチコピー | "Pure crystal display" |

**演出**:
- 床: 円形プレーン（radius 8）、`metalness: 0.9 / roughness: 0.3` の半反射
- パーティクル: ピンク光の粒子 60 個が緩やかに上昇（`0.001〜0.003` の速度）。画面上部に達したら下から再出現
- パーティクルカラー: `#ffd0e8`、size: 0.04、Additive Blending

**iOS 再現方針**: パーティクルは `ParticleEmitter`（RealityKit）または `SCNParticleSystem`（SceneKit）で実装。床の反射は環境マップで近似。

### 4-2. Snow Globe

| 項目 | 値 |
|---|---|
| 背景色 | `#020812`（深夜ブルー） |
| 印象 | ノスタルジック、冬、思い出 |
| キャッチコピー | "Winter memories floating" |

**演出**:
- ガラス球: radius 3.5、opacity 0.12 の半透明球（FrontSide）+ 内側に opacity 0.06 の BackSide 球でリム感
- 台座: ダークウッド色の円柱（`metalness: 0.6`）＋ゴールドリング 2 本（Torus）
- 雪: 250 個のパーティクルが球の内側を漂い、落下後に上部から再出現（球の内側境界 radius 3.3 で折り返し）

**iOS 再現方針**: ガラス球の透過感は RealityKit の `PhysicallyBasedMaterial` で `blending: .add` を活用。雪パーティクルは `ParticleEmitter` のループ設定で実装。

### 4-3. Velvet Box

| 項目 | 値 |
|---|---|
| 背景色 | `#0f0308`（深いワインレッド寄り） |
| 印象 | クラシック、高級宝飾店、ヴィンテージ |
| キャッチコピー | "Luxurious heritage" |

**演出**:
- 内張り: 6.5×6.5×6.5 の箱、内側面（BackSide）を `#5a0e2a`（ディープバーガンディ）、`roughness: 0.95` で布の質感
- ゴールドフレーム: 12 本のエッジを細い円柱（半径 0.08）で構成。`metalness: 1.0 / roughness: 0.15`
- パーティクルなし（静的な高級感を優先）

**iOS 再現方針**: 箱の内側は `SimpleMaterial` または `UnlitMaterial` で `color = burgundy`。フレームは細い `CylinderMesh` を 12 本配置。ジオメトリの複雑さは低いため SceneKit/RealityKit どちらでも容易。

### 4-4. Showcase

| 項目 | 値 |
|---|---|
| 背景色 | `#08060f`（ナイトパープル） |
| 印象 | ブティック、ホテルロビー、展示空間 |
| キャッチコピー | "Boutique collection" |

**演出**:
- ガラス棚: 2 枚（y = ±1.8）、`transmission: 0.7 / opacity: 0.4` の半透明ガラス
- 鏡面床: `metalness: 1.0 / roughness: 0.15` の反射床
- 背景パネル: 左右から 30° 傾いた 2 枚のパネルで「奥行きのある空間」を演出

**iOS 再現方針**: ガラス棚は RealityKit の `.clearcoat` マテリアルで近似。棚の配置で Grid レイアウトとの組み合わせが最も映える（Showcase + Grid が推奨デフォルト組み合わせ）。

### スキン × レイアウトの推奨組み合わせ

| スキン | おすすめレイアウト | 理由 |
|---|---|---|
| Glass Case | Sphere | 浮遊感とパーティクルが球体配置と合う |
| Snow Globe | Sphere | 球の中に球が漂う世界観が一致 |
| Velvet Box | Grid | 宝飾店の陳列棚のように整然と |
| Showcase | Grid | 棚との整合性。Grid で棚の上に乗っているように見える |

---

## 5. ネイルデータ構造

### 5-1. 現行プロトタイプのスキーマ（Web版）

```typescript
interface NailItem {
  id: number;          // ユニーク ID
  name: string;        // 表示名（例: "Pink Marble"）
  date: string;        // 日付文字列（例: "2026.04.15"）
  colors: string[];    // グラデーション用カラー配列（hex, 1〜3色）
  tags: string[];      // スタイルタグ（例: ["マーブル", "ピンク"]）
  shape: string;       // 爪の形（Almond / Oval / Square / Coffin / Stiletto / Round / Custom）
  salon: string;       // サロン名（例: "VIP Nail"）
  price: string;       // 施術価格（例: "¥6,000"）
  sparkle: boolean;    // ラメ有無（テクスチャ生成に影響）
  _customTexture?: any; // ユーザーがアップロードした写真テクスチャ（runtime only）
}
```

### 5-2. 移植用の提案スキーマ（React / iOS 共通）

```typescript
interface NailItem {
  id: string;              // UUID v4 推奨（数値IDはDB衝突リスク）
  title: string;           // 表示名
  imageUrl: string | null; // サムネイル画像URL（null = AI生成前）
  color: {
    base: string;          // メインカラー hex（代表色、サムネイル生成に使用）
    gradient: string[];    // グラデーション配列（1〜3色）
  };
  texture: 'plain' | 'marble' | 'glitter' | 'gradient' | 'floral' | 'custom';
  shape: 'almond' | 'oval' | 'square' | 'coffin' | 'stiletto' | 'round';
  parts: string[];         // スタイルタグ（自由入力 or 選択式）
  createdAt: string;       // ISO 8601 日時（例: "2026-04-15T00:00:00Z"）
  memo: string;            // フリーメモ（サロン名・価格など）
  favorite: boolean;       // お気に入りフラグ
  collectionType: 'real' | 'ai_generated' | 'uploaded';
                           // real: サロン記録, ai_generated: AI生成, uploaded: 写真アップロード
}
```

### 5-3. スキーマ変更のポイント

| 変更点 | 理由 |
|---|---|
| `id: number → string (UUID)` | DB マージや端末間同期で衝突しないため |
| `name → title` | i18n フレンドリーな命名 |
| `date → createdAt (ISO 8601)` | 日付のソート・フィルタが容易になる |
| `colors[] → color.base + color.gradient[]` | 代表色の検索インデックス化が容易 |
| `sparkle: boolean → texture: enum` | 将来のテクスチャ種類追加に対応 |
| `salon / price を memo に統合` | 任意情報の柔軟性向上 |
| `collectionType 追加` | AI 生成・アップロード・実記録の区別 |
| `favorite 追加` | コレクションフィルタ機能への対応 |

### 5-4. サンプルデータ（20件）の現状

プロトタイプには以下の爪形状バリエーションが含まれる:

| 形状 | 件数 | 代表例 |
|---|---|---|
| Almond | 8 | Pink Marble, Glitter Ombre, Nude Beige |
| Oval | 5 | Spring Floral, French Classic, Lavender Dream |
| Square | 2 | Royal Blue, Midnight Navy |
| Coffin | 3 | Ruby Red, Emerald Lux, Deep Plum |
| Stiletto | 2 | Galaxy, Blush & Gold |
| Round | 2 | Mint Frost, Rose Quartz |

---

## 6. ユーザー操作

### 6-1. ネイルカードを選択する

**トリガー**: 250ms 以内のタップ、かつ移動距離 10px 未満  
**判定**: Raycaster で爪メッシュのヒットテスト  
**結果**:
1. タップした爪が画面中央へスムーズ移動（lerp 0.12/frame）
2. 1.8倍に拡大（scale lerp）
3. Y 軸でゆっくり自転（0.012 rad/frame）
4. 他の爪は opacity 0.15 にフェード
5. フォーカス専用 SpotLight（intensity 0→2.5）点灯
6. ボトムシートが下から出現（`transform: translateY(0)`、easing: cubic-bezier(0.16, 1, 0.3, 1)）

**閉じ方**: 上部 60% 領域をタップ

### 6-2. レイアウトを切り替える

**トリガー**: 左上 pill ボタンをタップ  
**順序**: Sphere → Grid → Spiral → Sphere（循環）  
**ボタン表示**: 現在のモード名（"SPHERE" / "GRID" / "SPIRAL"）  
**アニメーション**: 次フレームから新位置へ浮遊で移行（瞬間切り替えではなく、浮遊ロジックが自然に新位置へ向かう）

### 6-3. スキンを切り替える

**トリガー**: 下部 pill ボタン群のいずれかをタップ  
**アクティブ状態**: 白背景・黒文字（他は半透明・白文字）  
**副作用**:
- 画面全体の背景色が変わる（CSS transition 0.6s）
- スキン名が中央に 2.2 秒間表示（フェードイン・アウト）

### 6-4. 詳細を見る

**表示項目**: タイトル、日付、スタイルタグ（ピルバッジ）、爪の形・サロン名・価格（3列メタ情報）  
**デザイン**: ハンドル（ドラッグ可能を示すバー）→ 名前 → 日付 → タグ → メタ情報の順

### 6-5. お気に入り登録する（未実装・方針）

**配置**: 詳細ボトムシート内に「ハートアイコン」ボタンを追加  
**挙動**: タップで `favorite: true/false` をトグル。一覧表示では星やハートのバッジを重ねて表示  
**フィルタ**: レイアウトトグルの横に「お気に入りのみ」切り替えを追加予定

### 6-6. SNS 共有する（未実装・方針）

**配置**: 詳細ボトムシート最下部に「Share」ボタン  
**Web**: `navigator.share()` API でネイティブシェートシートを呼び出す（iOS Safari 対応済み）  
**iOS**: `ShareLink`（SwiftUI）/ `UIActivityViewController`（UIKit）  
**共有コンテンツ**: スクリーンショット or 生成画像 + アプリリンク

---

## 7. React 実装方針

### 7-1. 2D CSS vs Three.js の判断基準

| 条件 | 推奨技術 |
|---|---|
| まず動くものを作りたい、検証優先 | **2D CSS アニメーション**（transform, perspective） |
| iPhone Safari で 60fps を保証したい | **Three.js**（プロトタイプと同構成） |
| 将来 iOS RealityKit に移行するまでの中継ぎ | 2D CSS で十分 |
| ジュエリーボックスの「ツヤ感・浮遊感」を本番品質で出したい | Three.js（WebGL必須） |

**MVP 推奨**: まず 2D CSS でシェルを作り、ユーザー検証後に Three.js へ置き換える。

### 7-2. コンポーネント分割案

```
src/
├── components/
│   ├── JewelryBox/
│   │   ├── JewelryBox.tsx          # メインコンテナ（Three.js canvas or 2D fallback）
│   │   ├── NailCard.tsx            # 個別の爪オブジェクト
│   │   ├── LayoutController.tsx    # Sphere/Grid/Spiral 切り替え
│   │   └── SkinSelector.tsx        # 4スキン切り替え
│   ├── Detail/
│   │   ├── DetailOverlay.tsx       # 詳細表示全体（背景ぼかし）
│   │   └── DetailSheet.tsx         # ボトムシート本体
│   ├── Upload/
│   │   └── UploadButton.tsx        # + ボタン、ファイル入力
│   └── UI/
│       ├── Header.tsx              # タイトル
│       ├── Counter.tsx             # 件数表示
│       └── Toast.tsx               # 追加完了トースト
├── hooks/
│   ├── useNailCollection.ts        # コレクション状態管理
│   ├── useLayout.ts                # レイアウトモード管理
│   └── useSkin.ts                  # スキン管理
├── types/
│   └── nail.ts                     # NailItem 型定義
└── data/
    └── sampleNails.ts              # 20件のサンプルデータ
```

### 7-3. 状態管理方針

**MVP（小規模）**: `useState` + `Context API` で十分  
**スケール後**: Zustand を検討（Redux は過剰）

```typescript
// useNailCollection の責務
{
  nails: NailItem[];
  addNail: (nail: NailItem) => void;
  removeNail: (id: string) => void;
  toggleFavorite: (id: string) => void;
  selectedNail: NailItem | null;
  selectNail: (nail: NailItem | null) => void;
}
```

### 7-4. CSS 管理方針

- **CSS Modules** を採用（グローバル汚染を避ける）
- カラー変数は `src/styles/variables.css` に集約:

```css
:root {
  --color-bg:        #050308;
  --color-primary:   #ec407a;
  --color-deep:      #c2185b;
  --color-soft:      #f8bbd0;
  --color-gold:      #ffd700;
  --glass-bg:        rgba(255,255,255,0.06);
  --glass-border:    rgba(255,255,255,0.12);
  --blur:            blur(20px);
  --easing-spring:   cubic-bezier(0.16, 1, 0.3, 1);
}
```

- フォント: `-apple-system, BlinkMacSystemFont, "Hiragino Sans"` 系を継続

---

## 8. iOS 実装方針

### 8-1. SwiftUI で再現する場合（2D ベース）

Grid レイアウト相当なら、SwiftUI の標準コンポーネントで実装可能。

```swift
// コレクション画面のイメージ
struct JewelryBoxView: View {
    @StateObject private var store = NailStore()
    
    var body: some View {
        ZStack {
            Color(hex: "050308").ignoresSafeArea()
            
            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3)) {
                    ForEach(store.nails) { nail in
                        NailCardView(nail: nail)
                            .onTapGesture { store.select(nail) }
                    }
                }
            }
            
            if let selected = store.selectedNail {
                DetailOverlayView(nail: selected)
                    .transition(.move(edge: .bottom))
            }
        }
    }
}
```

**SwiftUI で出せる表現**:
- `.ultraThinMaterial` でグラスモーフィズム
- `matchedGeometryEffect` で爪カードの拡大アニメーション
- `withAnimation(.spring(response: 0.5, dampingFraction: 0.7))` でボトムシート

**SwiftUI で難しい表現**（別途 RealityKit 必要）:
- Sphere/Spiral の 3D 浮遊配置
- MeshPhysical の clearcoat 光沢感
- リアルタイムパーティクル

### 8-2. RealityKit / SceneKit を使う場合

Sphere レイアウトや光沢感の完全再現には RealityKit が必要。

| 対応表（Three.js → RealityKit） | Three.js | RealityKit |
|---|---|---|
| MeshPhysicalMaterial | `MeshPhysicalMaterial` | `PhysicallyBasedMaterial` |
| clearcoat | `clearcoat: 1.0` | `.clearcoat` プロパティ |
| ゴールドメタリック | `metalness: 1.0` | `metallic: 1.0` |
| ExtrudeGeometry（爪形状） | `ExtrudeGeometry` | カスタム USDZ or `MeshResource.generate` |
| SpotLight | `SpotLight` | `SpotLight` コンポーネント |
| パーティクル | `PointsMaterial` | `ParticleEmitter` コンポーネント |
| Raycaster タップ | `raycaster.intersectObjects` | `scene.raycast` / `Entity.tap` |

**爪形状の移植戦略**:
- Web 版の Bezier curve パラメータを USDZ に変換するスクリプトを作成
- または Reality Composer Pro で爪シェイプを手動モデリング
- MVP では簡略化した卵形（`MeshResource.generateSphere` を変形）で代替可

### 8-3. MVP でどこまでやるべきか

| 機能 | MVP | Phase 2 以降 |
|---|---|---|
| コレクション一覧（Grid 相当） | SwiftUI LazyVGrid | ✅ |
| ネイルカードタップ → 詳細 | `matchedGeometryEffect` | ✅ |
| 4 スキンの背景色切り替え | 背景色変更のみ | ✅ |
| Sphere/Spiral 3D 配置 | — | RealityKit で実装 |
| clearcoat 光沢爪 | 2D 画像で代替 | RealityKit マテリアル |
| Snow Globe パーティクル | — | `ParticleEmitter` |
| お気に入り登録 | ✅（SwiftData） | — |
| 写真アップロード | ✅（PhotoKit） | — |

---

## 9. 今回やらないこと

以下は体験の核心ではなく、Phase 2 以降または別フェーズで扱う。

| スコープ外 | 理由 |
|---|---|
| **AI 画像生成連携**（Gemini / Nano Banana 2） | API キー管理・バックエンド設計が必要。Phase 1 は体験設計の確定を優先 |
| **本番 DB 連携**（Supabase / CloudKit） | ローカルデータ（SwiftData / localStorage）で検証期間は十分 |
| **認証**（Sign in with Apple など） | App Store 公開時の必須要件だが、UX 検証には不要 |
| **課金**（StoreKit 2） | Phase 3 以降 |
| **3D モデル自動生成** | Core ML / ml-stable-diffusion が必要。Phase 4 |
| **ネイル写真の自動切り抜き** | Vision Framework の爪セグメンテーション。Phase 4 |
| **ソーシャル機能**（フォロー・フィード） | Phase 5 |
| **Android 対応** | Phase 6 以降、iOS での Product-Market Fit 確認後 |

---

## 10. 次の実装ステップ

Phase 1 完了後、React 版シェルの作成から始める。

### Step 1: React 版シェル作成（推定: 1〜2日）

- `src/components/JewelryBox/` ディレクトリ作成
- 既存の `src/App.tsx` とは別に `JewelryBoxPage.tsx` を新設
- ルーティング: React Router 追加 or `/?view=jewelry-box` のクエリパラメータで切り替え
- 初期表示: ダーク背景 + ヘッダー + スキンセレクター（機能なし）のシェル

### Step 2: サンプルデータ 20 件の型定義と実装（推定: 0.5日）

- `src/types/nail.ts` に `NailItem` インターフェース定義
- `src/data/sampleNails.ts` に 20 件のモックデータ
- `prototype/jewelry-box.html` のデータをそのまま移植し、型を当てる

### Step 3: Grid レイアウト実装（推定: 1日）

- `LazyVGrid` 相当の CSS Grid で 4 列表示
- 各爪カード: 爪形状の CSS clip-path 近似 + グラデーション塗り
- グラスモーフィズム pill ボタンの共通コンポーネント化

### Step 4: スキン切り替え実装（推定: 0.5日）

- 背景色・アクセントカラーを CSS 変数で管理
- スキン選択で CSS 変数を書き換え（アニメーションは transition で）
- スキン名フェードイン・アウトの Toast 実装

### Step 5: 詳細表示実装（推定: 1日）

- ボトムシートコンポーネント（CSS transform アニメーション）
- 選択時に対象カードが「前面に出る」演出（z-index + scale）
- 他カードの opacity 低下

### Step 6: iPhone Safari 検証（推定: 0.5日）

- ローカルの IP アドレスで `npm run dev` を起動
- iPhone Safari でアクセス
- タッチ操作・レイアウト崩れ・パフォーマンスを確認
- 確認項目: スクロール挙動・タップ判定・フォントサイズ・セーフエリア

### 推奨ブランチ戦略

```
main
 └── feat/jewelry-box-react-shell     # Step 1-2
      └── feat/jewelry-box-layout     # Step 3-4
           └── feat/jewelry-box-detail # Step 5-6
```

---

## 付録: カラーパレット

| 変数名 | 値 | 用途 |
|---|---|---|
| `--color-bg` | `#050308` | Glass スキン背景 |
| `--color-bg-snow` | `#020812` | Snow Globe 背景 |
| `--color-bg-velvet` | `#0f0308` | Velvet 背景 |
| `--color-bg-showcase` | `#08060f` | Showcase 背景 |
| `--color-primary` | `#ec407a` | アクセント（ピンク） |
| `--color-primary-deep` | `#c2185b` | ディープピンク |
| `--color-primary-soft` | `#f8bbd0` | ライトピンク |
| `--color-gold` | `#ffd700` | フレーム・アクセントゴールド |
| `--text-primary` | `rgba(255,255,255,0.95)` | 主要テキスト |
| `--text-secondary` | `rgba(255,255,255,0.45)` | サブテキスト |
| `--text-muted` | `rgba(255,255,255,0.4)` | ラベル |

## 付録: アニメーションパラメータ

| 演出 | パラメータ |
|---|---|
| ボトムシート出現 | `cubic-bezier(0.16, 1, 0.3, 1)`, duration: 500ms |
| フォーカス爪移動 | lerp factor: 0.12/frame（約 60fps 前提） |
| フォーカス爪拡大 | lerp → scale 1.8（元 0.65）|
| グループ自動回転（Sphere） | `0.05 rad/s` |
| 爪個別浮遊振幅 | ±0.05〜0.08 units |
| フォーカスライト立ち上がり | lerp factor 0.1/frame、最大 intensity: 2.5 |
| スキン名フェード表示時間 | 2200ms |
| 背景色切り替え | CSS `transition: background 0.6s ease` |

---

*最終更新: 2026年4月 / 作成: feat/jewelry-box-demo ブランチ*
