# ScanObservation 入力契約と gap analysis（#405 / BenchTool ダンプ仕様）

> **Status: 仕様 + gap analysis。実装なし。**
> BenchTool の変更・実写収集・F2 骨格拘束のいずれにも着手していない。
> 関連: #405 / Epic #404 / [NAIL_SOCKET_POC_PLAN.md](./NAIL_SOCKET_POC_PLAN.md)
> 作成日: 2026-10-06

---

## 0. 結論サマリ

> **2026-10-06 改訂。** 初版は「ピクセルレベルの爪マスクは存在しない」と判定していたが、**誤りだった**。
> #389 のコメントで確認した結果、`NailAngleMeasurer.swift` に実在する。§7.0 に確認結果、§7 に修正後の表を置く。

| 問い | 答え |
|---|---|
| ピクセルレベルの爪マスクは存在するか | **存在する。** `NailAngleMeasurer.swift` が `VNGenerateForegroundInstanceMaskRequest`（被写体マスク）＋ 肌色 chroma 判定で**爪マスク**を生成。bbox や ROI ではない。**UIKit 非依存で macOS ホストのベンチツールから呼べる** |
| では socket を推定できるか | **まだできない。** マスクが覆うのは**見えている爪（nail plate）全体**で、**爪床と自由端を分ける情報は計算されていない**。Stage 1 の結論により爪全体の輪郭は socket に使えない |
| 他に何が足りないか | **ランドマークと爪マスクは別経路・別コードで、同一フレームで両方を出した実績が確認できない。** 正準フレームにはランドマーク、爪床にはマスクが要る |
| 2D→3D の扱い | Vision のランドマークは **2D のみ（深度なし）**。Stage 1 の推定器は 3D 入力を前提にしていたため、**lift を独立の層として分離**する必要がある |
| ブロッカーか | **爪床 / 自由端の分離だけがブロッカー。** マスクという素材は既にあるので、初版の想定より近い。handedness・confidence・intrinsics は代替可 |

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

### 7.0 確認結果（2026-10-06）

iOS 実装はこのリポジトリに無いため、**オーナー本人が書いた Issue コメント**のみを根拠にした。
確認できなかったものは **unknown** のままにしてある。

#### 確認できた事実

| 出典 | 内容 |
|---|---|
| #389 コメント① | **`NailAngleMeasurer.swift` が `VNGenerateForegroundInstanceMaskRequest` の被写体マスク ＋ `NailCleanup` と同じ肌色 chroma 判定（cb/cr 窓）で「爪マスク」を作る。** top 用の幅プロファイル、side 用の centerline 反り、猫の手用の幅バルジ比を抽出。**UIKit 非依存にしたので macOS ホストのベンチツールからも呼べる** |
| #389 コメント② | `NailAngleMeasurer.mask()` は写真を解析グリッドにリサンプルする（正方形化のバグを修正しアスペクト比を保持するようにした） |
| #389 コメント③ | シミュレータは前景マスクが動かない。実機 or macOS ホストが必要 |
| #363 コメント | `NailDetector.runHandPose` は **4 方向 × 最大 2 手**の試行。指ごとの候補に `cropHeight` と tip+dip の confidence があり、距離 ＋ confidence 比で重複排除する |
| #363 コメント | **BenchTool は独立した Swift ツール**（`ios/BenchTool/main.swift` ＋ `NailDetector.swift` を `xcrun swiftc -O` でビルド）。`-benchDetect` 診断フラグあり。`meanCenterOffsetPx` を出力 |
| #356 | 検出マーカーは **tip–DIP ベクトルの 0.32 補間**、`cropHeight = segment * 1.2`、指別係数 `fingerSpecs` |
| #399 / #393 | 記録は手の別を持つ（「右手のセット（束、5本）」、デバッグフラグ `-seedHand right`）。`NailRecord.nailCount` / `fingerPhotoData` / `fingerShapes` |
| Apple ドキュメント | `VNHumanHandPoseObservation` に `chirality`（`VNChirality`）が存在する |

#### 初版の誤りの訂正

> 初版は「ピクセルレベルの爪マスクは存在しない」「#394 の『マスク』は別物で確認要」と書いたが、**誤り**。
> #386 で未着手とされていた「前景マスク」は**検出経路（`NailDetector`）**の話であり、
> **角度スキャン経路（`NailAngleMeasurer`）には実際にピクセルレベルの爪マスクが実装済み**だった。
> #394 の「参照写真のマスクを連結成分で5つに分け」はこの爪マスクを指す。

#### 2 つの経路は別物

| | 検出経路 | 角度スキャン経路 |
|---|---|---|
| コード | `NailDetector.swift` / `PhotoCropView.runHandPose` | `NailAngleMeasurer.swift` / `AutoScanEstimator.swift` |
| 入力 | 手の写真（最大 2 手） | 4 方向の角度写真 |
| 出力 | **21 ランドマーク** ＋ 補間中心点 ＋ クロップ箱 | **ピクセル爪マスク** ＋ 幅プロファイル / 反り / バルジ比 |
| 爪マスク | **なし** | **あり** |
| ランドマーク | **あり** | **言及なし（unknown）** |

> **socket 推定は両方を同じフレームで必要とする** —— 正準フレームにランドマーク、爪床にマスク。
> **同一フレームで両方を出した実績は確認できなかった。** 原理的には同じ画像に両方を掛けられるはずだが、
> 実装がそうなっているかは unknown。

#### unknown のまま残すもの

| # | 項目 | なぜ確認できないか |
|---:|---|---|
| U1 | `chirality` をパイプラインが読んでいるか | **どの Issue にも `chirality` の言及がない。** 記録の手の別がユーザー選択か自動判定かも、どこにも書かれていない |
| U2 | 記録の handedness がどこで決まるか | 同上。`-seedHand right` はデモ用シードであって取得経路ではない |
| U3 | `NailAngleMeasurer` がマスク**そのもの**を外に返すか | コメントは「幅プロファイル / 反り / バルジ比を抽出」とあり、スカラー指標の抽出までを述べている。マスクや輪郭を API として出すかは不明 |
| U4 | 角度写真でランドマークが取れるか | 角度スキャン経路でランドマークに触れた記述がない |
| U5 | 爪マスクから爪床 / 自由端を分離できるか | 分離を試みた記述がない。素材（爪マスク・肌マスク・被写体マスク）は揃っているので**原理的には可能そうだが未検証** |
| U6 | camera intrinsics の取得状況 | 言及なし |

### 7.1 Gap 表（改訂後）

| # | 必要な入力 | 現状 | 判定 | 代替 / 対応 |
|---:|---|---|---|---|
| 1 | **hand landmarks** | `VNDetectHumanHandPoseRequest` で 21 点取得済み。指別の tip/dip confidence もある（#363） | **取得可（2D のみ）** | 深度は §6 の lift で補う |
| 2 | **handedness** | `VNHumanHandPoseObservation.chirality` は**存在する API**。既存コードが `VNGenerateForegroundInstanceMaskRequest`（iOS 17+）を使っている以上、可用性の問題はない。ただし**読んでいるかは unknown**（U1・U2） | **API としては取得可／利用状況 unknown** | 取れなければ**ユーザー選択**で代替。`handednessSource` に明記。**ブロッカーではない** |
| 3 | **nail region / mask** | **存在する。** `NailAngleMeasurer.swift` のピクセルレベル爪マスク（被写体マスク ＋ 肌色 chroma）。**macOS ホストのベンチツールから呼べる** | **取得可**（マスクを外に出す API の有無は U3） | ダンプするにはマスク or 輪郭を公開する必要があるかもしれない |
| 4 | **nail bed の近位端・左右端** | **計算されていない。** マスクは爪全体を覆い、キューティクル線を切り出す処理がない。検出経路側は 0.32 補間の中心点のみ（#356） | **欠落（ブロッカー）** | ① マスクの近位側境界から導出（U5・未検証）② **手動アノテーション**（PoC なら 1 指 18 枚 = 72 点） |
| 5 | **free edge との境界** | **計算されていない。** 爪床と自由端を区別する概念が無い | **欠落（ブロッカー）** | ① 爪マスクと肌マスクの隣接関係から導出（U5・未検証）② 手動アノテーション |
| 6 | **confidence** | ランドマークは Vision の値あり（#363）。爪マスク側の confidence は言及なし | **部分的** | 爪側は手動アノテーション時に付与、または `null` |
| 7 | **image / frame 座標系** | Vision は正規化・左下原点。画像は左上原点。EXIF 向きも絡む。`NailAngleMeasurer.mask()` は解析グリッドへのリサンプルを挟む（**座標の持ち帰りに注意**） | **取得可（要変換）** | §2 の規約を固定し、**変換後の画素座標**を記録する。リサンプル前の原寸座標に戻すこと |
| 8 | **camera / image metadata** | 言及なし（U6）。`IOS_CAPTURE_REQUIREMENTS.md` は **EXIF を保存しない**方針 | **unknown ＋ 方針衝突** | §10 参照。無ければ FOV を仮定し `source: "assumed"`。**ブロッカーではない** |

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

### 7.2 ブロッカー判定（改訂後）

| | 項目 | 対応 |
|---|---|---|
| **ブロッカー** | 爪床 / 自由端の分離（#4・#5） | ① 既存の爪マスクから導出（U5・未検証）② **手動アノテーション**（1 指 × 18 枚 = 72 点） |
| **要確認** | ランドマークと爪マスクを**同一フレームで**出せるか | 出せなければ、正準フレーム用と爪床用で別の写真を使うことになり、**両者の位置合わせが新たな誤差源**になる |
| 非ブロッカー | handedness・confidence・intrinsics | 代替・既定値・`missing` 明記で進められる |
| 将来の課題 | 爪床の自動検出 | 製品化には必要。PoC の合否には不要 |

**結論は変わらない: PoC は BenchTool の大改修を待たずに開始できる。**
ただし初版より見通しは良い —— **素材（ピクセル爪マスク）は既にあり、macOS ホストから呼べる**ので、
爪床の切り出しは「ゼロから作る」ではなく「既存マスクに境界判定を足す」話になる。

---

### 7.3 iOS 実装リポジトリの探索結果（2026-10-06）— **特定できなかった**

U1〜U5 を実コードで確認するため、iOS 実装の所在を探索した。**見つからなかった。**

#### 探索したこと

| # | 探索 | 結果 |
|---:|---|---|
| 1 | `ksc0000/nail-report` の**全ブランチ**（80 本）を列挙 | iOS コードを含むブランチは**無い**。すべて Web / docs |
| 2 | アカウントのリポジトリ一覧（`list_repos`、27 件） | Nailous に対応する iOS リポジトリは**無い** |
| 3 | コード検索 `NailAngleMeasurer` | ヒット 1 件 —— **本リポジトリの私の設計ドキュメントのみ** |
| 4 | コード検索 `AutoScanEstimator` / `NailShapeEstimator` / `NailPlateParams` | **0 件** |
| 5 | コード検索 `PhotoCropView` / `NailDetector` / `BenchmarkAssets`（Swift） | **0 件** |
| 6 | コード検索 `VNDetectHumanHandPoseRequest` / `VNGenerateForegroundInstanceMaskRequest`（`user:ksc0000`） | **0 件** |
| 7 | コード検索 `Nailous NailRecord fingerPhotoData` | **0 件** |
| 8 | `user:ksc0000 filename:project.pbxproj` | **2 件のみ** —— `WanHeat` と `club-forge`。どちらも Nailous ではない |

#### 「見つからない」が意味を持つことの確認（検索範囲の較正）

私有リポジトリが検索対象外なだけ、という可能性を潰した。

- `user:ksc0000 language:swift` → **56 件**。すべて **private リポジトリ `ksc0000/WanHeat`** から
- `repo:ksc0000/nallie …` → **147 件**（private）

→ **private リポジトリは検索・インデックス対象に入っている。** したがって Nailous の Swift ソースが
0 件なのは「見えていない」からではなく、**このアカウントの GitHub 上に存在しない**ためと判断できる。

#### 紛らわしい候補の除外

| リポジトリ | 実体 | 判定 |
|---|---|---|
| `ksc0000/nallie`（private, 最終 push 2026-04-16） | **TypeScript / React + Supabase + Three.js** のネイルカスタマイズアプリ（`src/features/nail-customize/`、`src/features/three-d/types/nail-input.ts`、`supabase/migrations/…_nail_designs.sql`） | **別プロジェクト。** Swift ではなく、Nailous ではない |
| `ksc0000/nallie_p`（public, 2026-04-06） | 同系統 | 同上 |
| `ksc0000/WanHeat` | 犬の散歩・天気アプリ（Swift） | 無関係 |
| `ksc0000/club-forge` | ClubForge（Swift） | 無関係 |

#### 結論

**Nailous の iOS 実装はオーナーのローカル環境にのみ存在する。**
`add_repo` で追加できる候補が無いため、**U1〜U5 は本セッションでは検証できない。**
推測で埋めることはせず、unknown のままとする。

### 7.4 U1〜U5 を解消するために必要なもの

いずれか 1 つで足りる。

1. **Nailous を private リポジトリに push し、このセッションに追加する**（最も確実。以後の確認もすべて可能になる）
2. オーナーがローカルで下記を確認して回答する
3. 該当ファイルの内容をセッションに貼る

#### オーナーがローカルで実行できる確認コマンド

```bash
# U1: chirality を読んでいるか
grep -rn "chirality\|VNChirality" ios/

# U2: 記録の handedness がどこで決まるか
grep -rn "handedness\|isRight\|\.right\|seedHand" ios/Nailous/ | grep -vi "alignment\|trailing"

# U3: NailAngleMeasurer の公開 API（マスク／輪郭を外に出すか）
grep -n "func \|struct \|class \|return " ios/Nailous/NailAngleMeasurer.swift | head -60

# U4: ランドマークと爪マスクが同一画像に掛かるか（呼び出し元）
grep -rn "NailAngleMeasurer\|AutoScanEstimator" ios/ --include=*.swift
grep -rn "runHandPose\|VNDetectHumanHandPose" ios/ --include=*.swift

# U5: マスクが爪床/自由端の手がかりを保持しているか
#     肌マスクを別に保持しているか、爪マスクと同時に取り出せるか
grep -n "skin\|chroma\|cb\|cr\|foreground\|instanceMask\|CVPixelBuffer\|mask("      ios/Nailous/NailAngleMeasurer.swift

# 利用可能な fixture
ls ios/BenchmarkAssets/ ios/BenchmarkAssets/angles/ 2>/dev/null
```

#### U5 について特に見たいもの

「原理的にできそう」で止めないために、**実データで**次を確認したい。

| 確認項目 | 見たいもの |
|---|---|
| マスクの保持形態 | `mask()` が**二値ビットマップ／輪郭を返す**のか、幅プロファイル等の**スカラーに畳んで捨てている**のか |
| 肌マスクの可用性 | 爪マスクを作る際の**肌色 chroma 判定の結果を別に取り出せる**か（取り出せれば「爪∩肌隣接 = 爪床側」「爪∩背景隣接 = 自由端側」の判定に使える） |
| cuticle 側の保持 | マスクの近位端が**キューティクルで切れている**のか、指の皮膚まで含んでいるのか |
| lateral edges | 側壁（爪の左右）が**マスクの境界として出ている**か、肌に埋もれて途切れるか |
| free edge 側 | 自由端が**背景と接しているか**（接していれば分離の手がかりになる）。ベンチ実写での見え方 |

`ios/BenchmarkAssets/angles/` の実写 1 セットでマスクを可視化できれば、上記はすべて目視で判定できる。

### 7.5 この状態で進められること / 進められないこと

| | |
|---|---|
| **進められない** | U5 を根拠にした「既存マスクから爪床を切り出す」実装。**U5 が unknown のまま作ると、分離できない前提で作り直しになる** |
| **進められない** | BenchTool の `--dump-observation`（U3 でマスクを外に出せるかが未確定） |
| **進められる** | 手動アノテーション前提の経路（ScanObservation パーサ、アノテーションのマージ）。**マスクの有無に依存しない** |
| **進められる** | 2D→3D lift（Layer B）の実装。入力は landmarks と爪床四隅であり、それがマスク由来か手動かに依存しない |

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

| 7 | **爪マスク（または輪郭ポリゴン）を `nails[].fullNailOutline` として出力する。** `NailAngleMeasurer` は既に macOS ホストから呼べるので、マスクを公開できれば追加の検出実装は要らない（U3 次第） | — |

**爪床 / 自由端の分離は BenchTool に求めない。** 手動アノテーションを別経路で合流させる（§9）。
マスク（7）が出せるなら、アノテーションは「マスクの上でキューティクル線と自由端境界を引く」だけになり、
四隅をゼロから指定するより速く正確になる。

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
| 3 | ~~#394 の「マスク」が何を指すか~~ | **解決（2026-10-06）。** `NailAngleMeasurer` のピクセルレベル爪マスク。bbox ではない |
| 4 | `chirality` をパイプラインが読んでいるか / 記録の handedness がどこで決まるか | **unknown のまま（U1・U2）。** どの Issue にも言及がない。実コードの確認が要る。読んでいなければユーザー選択で代替 |
| 6 | `NailAngleMeasurer` が爪マスク / 輪郭を API として外に出すか | **unknown（U3）。** ダンプ実装時に判明する |
| 7 | ランドマークと爪マスクを同一フレームで出せるか | **unknown（U4）。** 出せない場合は写真間の位置合わせが新たな誤差源になる |
| 8 | 爪マスクから爪床 / 自由端を分離できるか | **unknown（U5）。** 素材は揃っており原理的には可能そうだが、試した記録がない |
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
