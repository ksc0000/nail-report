# 3D Library Evaluation: `<model-viewer>` vs React Three Fiber

## 概要
Phase 8 (3D Preview Foundation) および Phase 9 (AR Try-on / Advanced Modeling) に向けて、ネイルチップの3DモデルをWebブラウザ上でレンダリング・操作するための技術選定スパイクです。

主要な候補である `<model-viewer>`（Google製のWeb Components）と、`React Three Fiber`（Three.jsのReact向けラッパー）を比較・評価します。

---

## 比較表

| 項目 | `<model-viewer>` | React Three Fiber (R3F) |
|---|---|---|
| **学習コスト** | 非常に低い（HTMLタグ感覚） | 高い（Three.jsとReactの深い知識が必要） |
| **セットアップ** | スクリプトを読み込むだけで完了 | パッケージ追加（`three`, `@react-three/fiber`等）が必要 |
| **AR対応 (モバイル)** | iOS(AR Quick Look) / Android(Scene Viewer) との連携が組み込み済 | `@react-three/xr` を用いたWebXR実装が必要。iOSでの制約あり |
| **マテリアルの動的変更** | JavaScript API経由で一部可能だが限定的 | 完全なコントロールが可能（色、テクスチャ、シェーダー） |
| **複雑なシーン・ライト** | 事前定義された環境光・シンプルなライトのみ | Three.jsの全機能を利用可能（自由なライト、影、ポストプロセス） |
| **ファイルサイズ** | 比較的軽量 | Three.js本体が含まれるためやや大きい |
| **Reactとの親和性** | Web ComponentsのためReactとの統合は一工夫必要 | Reactのエコシステムと完全に統合 |

---

## 各技術の詳細評価

### 1. `<model-viewer>`
**強み:**
とにかく簡単に3Dモデル（GLB）を表示でき、モバイル端末でのネイティブARビューアー（AR Quick Look / Scene Viewer）への橋渡しが非常にスムーズです。「ただモデルを表示して回して見る」という要件であれば圧倒的に早く実装できます。

**弱点:**
ネイルチップの色を動的に変えたり、ラメ（グリッター）の質感をシェーダーで表現したり、複数のネイルパーツを合成してカスタマイズするといった「Advanced Modeling (Phase 9)」の要件になると、途端に限界が見えます。ReactのStateと同期させるのもWeb Componentsのライフサイクルの違いから煩雑になることがあります。

### 2. React Three Fiber (R3F)
**強み:**
Reactのコンポーネントツリーの中でThree.jsの強力なレンダリングエンジンを宣言的に記述できます。ネイルの色やテクスチャの変更、ラメのような特殊なマテリアル（シェーダー）の適用、カメラ映像の上にモデルを重ねる独自のAR実装（WebXRや独自のCVライブラリとの連携）など、将来的な高度な要件にすべて対応できます。

**弱点:**
初期学習コストが高く、バンドルサイズが増加します。iOSデバイスでの「App-less AR (AR Quick Look)」を利用するには、別途USDZファイルをエクスポートする仕組みを自作するか、WebXRがiOS Safariで完全にサポートされるのを待つ（あるいはネイティブアプリ化する）必要があります。

---

## 結論と推奨方針

**推奨: React Three Fiber (R3F) の採用**

> **2026-10-06 更新 — 結論は維持、理由を差し替え。**
> 製品方向が「プリセットのネイルチップを試着する」から「実物の自分のネイルを復元して振り返る」へ変わったため
> （[NAIL_3D_PLATFORM_ARCHITECTURE.md](./NAIL_3D_PLATFORM_ARCHITECTURE.md)）、R3F を推奨する根拠も次のとおり更新する。
>
> | | 旧理由（プリセット前提） | 新理由（実物復元前提） |
> |---|---|---|
> | R3F が必要な理由 | プリセットの色・テクスチャを動的変更 | **Canonical Nail Data からのランタイム合成**（HandProfile ＋ NailSet）、テクスチャ投影、光沢・ラメのカスタムシェーダ |
>
> `<model-viewer>` は「完成した 1 つの GLB を表示する」ツールであり、**2 つの独立した Canonical オブジェクトを
> 実行時に合成する**用途に向かない。また GLB を永続データの正にしない方針
> （[CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md)）のもとでは、
> MVP で GLB を生成しないため `<model-viewer>` の前提そのものが成立しない。

### 理由
Nailousの将来のロードマップ（Phase 9）において、「カラーやテクスチャの動的なカスタマイズ」および「高度なモデリング（ストーンやラメの配置）」がスコープに含まれています。
`<model-viewer>` を採用した場合、初期の「3Dプレビュー（Phase 8）」は素早く実装できますが、Phase 9 に入った時点で技術的な壁にぶつかり、結局 Three.js (R3F) で作り直すリスクが高いです。

そのため、Phase 8の段階から **React Three Fiber** を導入し、GLBモデルのロードとカメラコントロールの基礎を構築することを推奨します。

### 次のステップ (Phase 8 実装)

> **2026-10-06 更新。** 下記 2・3 は GLB プリセット前提のため、実物復元経路では次のように読み替える。

1. `three`, `@react-three/fiber`, `@react-three/drei` の依存関係追加（G8 / G9）
2. ~~テスト用ネイルチップGLBモデルの作成/取得~~ → **Canonical Nail Data の JSON fixtures を用意**（GLB は MVP では生成しない）
3. ~~`<Canvas>` と `useGLTF` を用いたプレビューコンポーネントの実装~~ → **`<Canvas>` ＋ procedural geometry で CND からランタイム構築**（`useGLTF` は使わない）
4. 未知 `contractVersion` を L0 にフォールバックさせる契約パーサの実装（INV-3）
