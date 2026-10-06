# ScanObservation 入力契約と gap analysis（#405 / BenchTool ダンプ仕様）

> **Status: 仕様 + gap analysis。実装なし。**
> BenchTool の変更・実写収集・F2 骨格拘束のいずれにも着手していない。
> 関連: #405 / Epic #404 / [NAIL_SOCKET_POC_PLAN.md](./NAIL_SOCKET_POC_PLAN.md)
> 作成日: 2026-10-06

---

## 0. 結論サマリ

| 問い | 答え |
|---|---|
| 今の検出パイプラインから socket を推定できるか | **できない。** 出力は爪の観測ではなく **tip–DIP の 0.32 補間による中心点とクロップ箱**（`PhotoCropView.runHandPose`）であり、爪床の境界を含まない |
| それで PoC を回したらどうなるか | **意味のない「合格」が出る。** 骨格から作った点は爪が変わっても動かないので **M6 は自動的に通る**。socket の安定性ではなく**ランドマークの安定性を測ってしまう** |
| 最小限なにが必要か | 画像から観測した **爪床の近位端（キューティクル線）と左右端**。少なくとも 3 点、望ましくは 4 隅 |
| 2D→3D の扱い | Vision のランドマークは **2D のみ（深度なし）**。Stage 1 の推定器は 3D 入力を前提にしていたため、**lift を独立の層として分離**する必要がある |
| ブロッカーか | **爪床境界の観測はブロッカー。** それ以外（handedness・confidence・intrinsics）は代替または既定値で進められる |

---

## 1. 3 層分離（混ぜない）

```
┌─ Layer A: ScanObservation（raw・2D）─────────────────────────┐
│  画像から直接観測したものだけ。推定を含めない。                │
│  画素座標のランドマーク / 爪床ポリゴン / confidence / メタデータ │
│  ★ これを保存する。推定器を差し替えても作り直さない             │
└──────────────────────────────────────────────────────────────┘
          │ liftVersion で版管理される 2D→3D lift
          ▼
┌─ Layer B: CanonicalObservation（derived・3D / 正準フレーム）─┐
│  lift の仮定がすべてここに集まる。再計算可能・破棄可能          │
└──────────────────────────────────────────────────────────────┘
          │ reconstructionVersion
          ▼
┌─ Layer C: NormalizedNailSocket（Stage 1 の推定器の出力）─────┐
│  正規化単位。メートルではない                                  │
└──────────────────────────────────────────────────────────────┘
```

**規則:**

| # | |
|---|---|
| R1 | **Layer A に推定値を混ぜない。** 補間・外挿・既定値で埋めた値は Layer A ではない |
| R2 | **埋められない項目は推測で埋めず `missing` に列挙する。** 欠測と「値 0」を区別できないデータは再解析できない |
| R3 | 由来の違う値は `source` で区別する（`mask` / `skeletonInterpolation` / `manual` / `assumed`） |
| R4 | Layer B / C は Layer A から再生成できる。保存は任意（キャッシュ扱い） |
| R5 | Layer A は**画素座標**。正規化や 3D 化は Layer B の仕事 |

R1〜R3 がないと「推定器を差し替えて再解析する」ができない。**今の検出出力は骨格補間と爪観測が混ざっており、これがそのまま最大の問題になっている**（→ §5）。

---

## 2. 座標系の規約（取り違えが起きやすい）

| 項目 | 規約 |
|---|---|
| 原点 | **画像の左上**、x 右・y 下（CoreGraphics / 一般的な画像座標） |
| 単位 | **画素**（正規化しない） |
| 基準 | **`image.width` / `image.height` が示す、向きを適用済みの画像** |
| Vision からの変換 | `VNRecognizedPoint.location` は**正規化・左下原点・y 上**。`y_px = (1 - y_vision) * height`、`x_px = x_vision * width`。**変換後の値を記録する** |
| 向き | `image.exifOrientation` を記録し、座標は**向きを適用した後**のものにする |

> 生の Vision 座標をそのまま入れてはいけない。原点と y 軸の向きが違い、取り違えると爪が上下反転した位置に出る。
> 記録するのは常に変換後の画素座標で、`landmarkModel.coordinateConversion` に変換したことを明記する。

---

## 3. ScanObservation v1（Layer A）

```jsonc
{
  "schemaVersion": 1,
  "captureId": "cap_2026-10-06_001",
  "sessionId": "ses_2026-10-06_a",     // 手を一度どけて置き直す単位（PoC 計画 §2.1）
  "capturedAt": "2026-10-06T09:12:03Z",
  "device": { "class": "iPhone" },      // 粗い分類のみ。個体識別しない

  "image": {
    "fileName": "real_beige_right_01.jpg",  // 画像自体はリポジトリに入れない
    "width": 3024,
    "height": 4032,
    "exifOrientation": 1,
    "coordinateOrigin": "topLeft",
    "units": "pixels"
  },

  "camera": {                            // 省略可。ない場合は missing に列挙
    "focalLengthPx": 2850.0,
    "principalPointPx": [1512.0, 2016.0],
    "source": "avCameraCalibrationData"  // avCameraCalibrationData | exifDerived | assumed
  },

  "hand": {
    "handedness": "right",
    "handednessConfidence": 0.93,
    "handednessSource": "visionChirality" // visionChirality | userSelected | assumed
  },

  "landmarkModel": {
    "provider": "vision",
    "requestRevision": "VNDetectHumanHandPoseRequestRevision1",
    "dimensionality": "2d",              // ★ Vision は深度を返さない
    "coordinateConversion": "vision-normalized-bottomLeft -> pixel-topLeft"
  },

  "landmarks": [                          // 21 点。欠測は confidence 0 ではなく null で表す
    { "name": "wrist",        "x": 1402.5, "y": 3310.0, "confidence": 0.98 },
    { "name": "indexMCP",     "x": 1290.1, "y": 2740.4, "confidence": 0.95 },
    { "name": "indexTIP",     "x": 1248.0, "y": 1902.7, "confidence": 0.71 },
    { "name": "middleDIP",    "x": null,   "y": null,   "confidence": null }
  ],

  "nails": [
    {
      "finger": "index",
      "regionType": "bed",                // bed | fullNail | centerOnly | unknown
      "source": "manualAnnotation",       // mask | manualAnnotation | skeletonInterpolation
      "confidence": 0.9,

      // regionType = "bed" のときだけ socket 推定に使える（§5）
      "bedQuad": [[1203.0, 2010.5], [1288.4, 2004.1],
                  [1292.7, 1930.8], [1199.2, 1937.0]],

      // 任意。あれば free edge の分離が検証できる
      "fullNailOutline": [[1200.0, 2012.0], "..."],
      "freeEdgeBoundary": [[1199.2, 1937.0], [1292.7, 1930.8]],
      "cuticleLine":      [[1203.0, 2010.5], [1288.4, 2004.1]],

      "occluded": false
    }
  ],

  "frameQuality": {
    "blurScore": 0.12,                    // 小さいほど良い
    "nailAreaRatio": 0.018,
    "suggestsRetake": false               // 既存の #366 の判定をそのまま入れる
  },

  "missing": [                            // ★ 必須。空配列でも書く
    "camera.focalLengthPx",
    "nails[*].freeEdgeBoundary"
  ]
}
```

### 3.1 フィールド規約

| フィールド | 必須 | 備考 |
|---|:---:|---|
| `schemaVersion` | ✅ | additive-only。破壊的変更で上げる |
| `sessionId` | ✅ | **M5 の分散分解に必須**。同一セッション = 手をどけていない |
| `landmarks[].x/y` | ✅ | 欠測は `null`。**0 で埋めない** |
| `landmarks[].confidence` | ✅ | Vision のそのままの値。欠測は `null` |
| `nails[].regionType` | ✅ | **`fullNail` / `centerOnly` は socket 推定に使えない**（§5） |
| `nails[].source` | ✅ | 観測か骨格補間かを必ず区別する |
| `missing` | ✅ | 省略した項目をすべて列挙。**空なら `[]`** |

### 3.2 画像そのものは入れない

`image.fileName` は参照のみ。実写はオーナーのローカルに置き、**git に入れるのは数値だけ**
（PoC 計画 §1.2）。socket の安定性測定に画像は要らない。

---

## 4. CanonicalObservation（Layer B・derived）

```jsonc
{
  "schemaVersion": 1,
  "derivedFrom": { "captureId": "cap_2026-10-06_001", "scanObservationSha256": "…" },
  "liftMethod": "weakPerspective+skeletalPrior",
  "liftVersion": 3,
  "assumptions": [
    "nail bed is locally planar",
    "dorsal side faces the camera",
    "bone length ratios from a generic hand"
  ],
  "landmarks3d": [ { "name": "wrist", "x": …, "y": …, "z": … } ],
  "handFrame": { "origin": […], "basisX": […], "basisY": […], "basisZ": […], "scaleReferenceLength": 1.0 },
  "bedQuads3d": { "index": [ […], […], […], […] ] },
  "residuals": { "reprojectionRmsPx": 2.4, "depthAmbiguityResolved": true }
}
```

**`liftVersion` を上げれば Layer A から全部作り直せる。** これが「推定器を差し替えて再解析する」の実体。

---

## 5. nail bed と free edge の入力契約（Stage 1 の結論を強制する）

### 5.1 禁止

> **爪全体の輪郭（`fullNailOutline`）を `NailSocket` の推定に使ってはならない。**

Stage 1 の合成実験（`tests/nail3dStability.test.ts`）で実測した失敗:

| 入力 | M6（爪を伸ばした前後の socket 変位） |
|---|---|
| 爪床の四隅 | `bedLength` 変化 < 1e-9、法線 < 1e-4° |
| **爪全体の輪郭** | **`bedLength` が 50% 超ずれ、法線が 5° 超傾く** |

自由端は伸び、かつ先端が反る。これを含めると**爪が変わるたびに「手」が動く**。

### 5.2 受け入れる入力の優先順

| 順位 | `regionType` | 内容 | socket 推定 |
|---:|---|---|---|
| 1 | `bed` | 爪床の 4 隅（キューティクル側 2 点 ＋ 自由端境界 2 点） | **可** |
| 2 | `bed` | キューティクル線 2 点 ＋ 左右端。自由端境界は `freeEdgeBoundary` で明示 | **可** |
| 3 | `fullNail` ＋ `freeEdgeBoundary` | 全体輪郭から自由端を切り落として爪床を得る | **可**（切り出し精度は要検証） |
| 4 | `fullNail` のみ | 自由端を分離できない | **不可。推定器は拒否する** |
| 5 | `centerOnly` | 中心点のみ | **不可** |

> 4 と 5 は Layer A としては記録してよい（後で別の推定器が使えるかもしれない）。
> **socket 推定器が拒否する**という形で強制する。黙って使うのが一番危ない。

### 5.3 最小要件

socket は 7 自由度（origin 3・normal 3・tangent 3 のうち独立 5 ＋ 寸法 2）を持つが、
**画像から観測すべきは爪床の境界だけ**で足りる。最小:

- **キューティクル線の 2 点**（近位端・左右端） → `origin`・`bedWidth`・`tangent` の向き
- **自由端境界の 2 点または中点** → `bedLength`
- 平面の向き（`normal`）は 4 隅の射影の歪みから Layer B で推定する（§6）

---

## 6. 2D→3D lift を独立の層にする理由

### 6.1 Vision は 2D しか返さない

`VNDetectHumanHandPoseRequest` の `VNRecognizedPoint` は**正規化された 2D 座標と confidence だけ**で、
深度を持たない。MediaPipe の相対 z に相当するものがない。

**Stage 1 の推定器は 3D のランドマークと 3D の爪四隅を前提にしていた。**
合成ハンドが 3D を与えていたため成立していたのであって、**実写では lift が必ず間に入る**。
PoC 計画 §6-A の「限界」に挙げた点が、ここで具体的な作業になる。

### 6.2 lift の候補

| 案 | 内容 | 必要なもの | 難点 |
|---|---|---|---|
| **L1 弱透視 ＋ 平面仮定** | 爪床を平面とみなし、四角形の射影の歪みから法線を復元 | intrinsics（なければ FOV を仮定） | 平面の向きに**鏡像の 2 値曖昧性**。背側が見えている前提で解く |
| **L2 骨格事前分布** | 一般的な手の骨長比で 21 点を 2D→3D に持ち上げる | 骨長比の既定値 | 関節ごとに深度の符号曖昧性。手の個体差 |
| **L3 多視点三角測量** | #390 の複数フレームから三角測量 | フレーム間対応・カメラ運動 | 最も正確だが最も重い |
| **L4 深度センサ** | ARKit / LiDAR | 対応端末 | 端末限定。**絶対スケール問題も同時に解ける** |

**PoC の既定: L1 ＋ L2。** 曖昧性は「爪は手のひらの反対側を向く」「背側が写っている」という事前知識で解く。
`assumptions` に列挙し、`residuals.depthAmbiguityResolved` で解けたかを記録する。

### 6.3 どの段階で何を推定するか（明確化）

| 推定する量 | 層 | 根拠 |
|---|---|---|
| ランドマークの画素座標 | **A** | Vision の出力（観測） |
| 爪床の境界（画素） | **A** | 画像からの観測。**骨格補間は A ではない** |
| 深度 / 3D 位置 | **B** | lift の仮定に依存。版管理する |
| 正準ハンドフレーム | **B** | 3D ランドマークから |
| 爪床平面の法線 | **B** | 四角形の射影の歪みから |
| `NailSocket`（正規化） | **C** | Stage 1 の推定器 |
| メートル換算 | — | **未解決。本 PoC のスコープ外**（PoC 計画 §2.4） |

---

## 7. Gap analysis

出典は本リポジトリの Issue 本文のみ。**iOS 実装を読めないため、「確認要」は実コードでの裏取りが必要。**

| # | 必要な入力 | 現状 | 判定 | 代替 / 対応 |
|---:|---|---|---|---|
| 1 | **hand landmarks** | `VNDetectHumanHandPoseRequest` で 21 点取得済み（#390 / #386） | **取得可（2D のみ）** | 深度は §6 の lift で補う |
| 2 | **handedness** | Vision の `chirality` が使えるはず。**パイプラインが記録しているかは確認要**。記録単位が片手である決定（#392）から、撮影フローで選択している可能性もある | **取得可の見込み** | 取れなければ**ユーザー選択**で代替。`handednessSource` に明記。**ブロッカーではない** |
| 3 | **nail region / mask** | **実装されていない。** 前景マスクは #386 で「改善候補」として未着手と明記。`JEWELRY_BOX_REFRESH.md` も「AI セグメンテーションに直行せず手動クロップ」を方針としている。#394 の「マスク」は角度スキャン参照写真の別物で**確認要** | **欠落** | §5 の `bed` 四隅を**手動アノテーション**で与える（PoC は 1 指 18 枚なので現実的） |
| 4 | **nail bed の近位端・左右端** | **出ていない。** 現状は `PhotoCropView.runHandPose` の **tip–DIP ベクトルの 0.32 補間による中心点**と `cropHeight = segment * 1.2` のクロップ箱（#356）。爪床の境界ではない | **欠落（ブロッカー）** | 手動アノテーション。または骨格事前分布から初期値を出し人が補正 |
| 5 | **free edge との境界** | **出ていない。** 爪床と自由端を区別する概念が現状のパイプラインに存在しない | **欠落（ブロッカー）** | 手動アノテーション。将来はマスクの「肌と接する辺 / 背景と接する辺」で自動化しうる |
| 6 | **confidence** | ランドマークは Vision の値あり。**爪領域の confidence は領域自体がないため無い** | **部分的** | 爪側は手動アノテーション時に記録者が付与、または `null` |
| 7 | **image / frame 座標系** | Vision は正規化・左下原点。画像は左上原点。EXIF 向きも絡む | **取得可（要変換）** | §2 の規約を固定し、**変換後の画素座標**を記録する |
| 8 | **camera / image metadata** | intrinsics の取得状況は**確認要**。`IOS_CAPTURE_REQUIREMENTS.md` は **EXIF を保存しない**方針 | **不明 ＋ 方針衝突** | §10 参照。無ければ FOV を仮定して `source: "assumed"` とする。**ブロッカーではない** |

### 7.1 最大の落とし穴: 骨格由来の点で PoC が「合格」してしまう

現状の中心点は **tip と DIP の補間**、つまり**骨格から作った点**であって爪の観測ではない。
これをそのまま socket にすると:

| 指標 | 何が起きるか |
|---|---|
| **M6（差し替え不変性）** | **必ず通る。** 爪が変わってもランドマークは変わらないので socket も動かない |
| **M1（位置ばらつき）** | ランドマークの安定性をそのまま反映する。爪床との一致は測っていない |
| **M0** | 同上 |

> **つまり「socket は安定している」という結論が、爪を一度も見ずに出てしまう。**
> #356 が既に指摘しているとおり 0.32 は指の太さ・爪の長さに依存する固定係数であり、
> 爪床の真の位置からは系統的にずれる。**安定しているが間違っている**状態。

これを防ぐため、契約は `source: "skeletonInterpolation"` を**別物として記録**させ、
socket 推定器は `regionType: "centerOnly"` を**拒否**する。

### 7.2 ブロッカー判定

| | 項目 | 対応 |
|---|---|---|
| **ブロッカー** | 爪床の境界（#4・#5） | **手動アノテーションで回避可能。** PoC は 1 指 × 18 枚なので 72 点の指定で済む |
| 非ブロッカー | handedness・confidence・intrinsics | 代替・既定値・`missing` 明記で進められる |
| 将来の課題 | 爪床の自動検出 | 製品化には必要。PoC の合否には不要 |

**結論: PoC は BenchTool の大改修を待たずに開始できる。** ただし「爪床をどう与えるか」を手動に置き換える前提を明示すること。

---

## 8. BenchTool に求める最小変更

| # | 変更 | 必須 |
|---:|---|:---:|
| 1 | `scripts/bench-detect.sh` に `--dump-observation <out.json>` を追加し、§3 の Layer A を出力する | ✅ |
| 2 | ランドマークを**画素座標・左上原点に変換して**記録（§2） | ✅ |
| 3 | 取得できない項目を `missing` に列挙（**推測で埋めない**） | ✅ |
| 4 | `chirality` を取得できるなら記録、できなければ `missing` に入れる | ✅ |
| 5 | 既存の `suggestsRetake`（#366）と blur 指標があれば `frameQuality` に入れる | — |
| 6 | intrinsics を取得できるなら記録、できなければ `missing` | — |

**爪床の検出は BenchTool に求めない。** 手動アノテーションを別経路で合流させる（§9）。

---

## 9. 爪床アノテーションの与え方（PoC 用）

BenchTool の出力（ランドマークのみ）と、人手で付けた爪床四隅をマージして完全な ScanObservation を作る。

```
bench-detect --dump-observation  →  observation.partial.json   （landmarks ＋ metadata）
人手で爪床 4 隅を指定              →  bed-annotations.json
                      マージ       →  observation.json         （Layer A 完成）
```

アノテーション側に必要な情報は 1 指あたり 4 点（画素座標）と `freeEdgeBoundary` の 2 点だけ。
**この経路は本リポジトリ側で実装でき、iOS を触らずに済む**（PoC 計画 §1.3 の [2]）。

---

## 10. 未解決の論点

| # | 論点 | 必要な判断 |
|---:|---|---|
| 1 | **intrinsics とプライバシー方針の衝突。** 2D→3D lift は焦点距離があると安定するが、`IOS_CAPTURE_REQUIREMENTS.md` は EXIF を保存しない方針 | BenchTool は製品の保存経路ではないので PoC では問題にならない。**製品に入れる段になったら G6。** 焦点距離と主点のみを EXIF 丸ごとと区別して扱えるか |
| 2 | 爪床自動検出の方式（セグメンテーション vs 骨格事前分布 ＋ 人手補正） | 製品化時。PoC の結果を見てから |
| 3 | #394 の「マスク」が何を指すか | **確認要。** 角度スキャン参照写真に実際のマスクがあるなら #3 の欠落判定が変わる |
| 4 | `chirality` をパイプラインが記録しているか | **確認要。** 記録していなければユーザー選択で代替 |
| 5 | lift の曖昧性解消が実写で安定するか | Layer B の実装時に `residuals` で測る |

---

## 11. 参照

| | |
|---|---|
| [NAIL_SOCKET_POC_PLAN.md](./NAIL_SOCKET_POC_PLAN.md) | PoC 全体計画・Stage 1 / Stage 2 の結果 |
| [CANONICAL_NAIL_DATA_CONTRACT.md](./CANONICAL_NAIL_DATA_CONTRACT.md) | `NailSocket` の定義（`bedLength` は爪床であり自由端を含まない） |
| [IOS_CAPTURE_REQUIREMENTS.md](./IOS_CAPTURE_REQUIREMENTS.md) | EXIF / 位置情報を保存しない方針 |
| `src/lib/nail3dSocket.ts` | Stage 1 の baseline estimator（3D 入力を前提） |
| `tests/nail3dStability.test.ts` | 爪床 vs 爪全体輪郭の M6 比較 |
| #356 | tip–DIP の 0.32 補間・`cropHeight = segment * 1.2`・`fingerSpecs` |
| #386 | `NailDetector.swift` / `bench-detect.sh` / 前景マスクが未着手である明記 |
| #361 / #363 / #365 / #366 | ランドマーク品質の既知の弱点と撮り直し誘導 |
| #390 / #394 | 多視点フレームと片手 5 本分離 |
