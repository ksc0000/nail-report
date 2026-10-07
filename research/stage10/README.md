# Stage 10 — 実写小規模 PoC（撮影・抽出・アノテーション・解析の手順）

目的は精度を作り込むことではなく、**synthetic で成立した前提のうち、実写で最初に何が崩れるか**を特定すること。
定義（何を撮るか / 何を保存するか / 何を比べるか / 何をもって崩れたとするか）は
[docs/product/NAIL_SOCKET_POC_PLAN.md §6-L](../../docs/product/NAIL_SOCKET_POC_PLAN.md) にある。ここは作業手順だけ。

> **解析は撮影前に固定してある**（`kit.ts` / `criteria.ts`）。実写を見てから解析やアルゴリズムを変えない。
> 変えるときは別のコミット・別の解析として報告する（`analyze.ts` はコードが変わっていると報告の 1 行目に出す）。

## 0. 用意するもの

| | |
|---|---|
| 手 | **右手の人差し指**（H1 テンプレートが右手） |
| 端末 | いつもの iPhone。**望遠（2× 以上）で約 40 cm 以上離す**（遠いほど weak perspective に近い） |
| 固定 | スマホスタンド（三脚）。**V1 と V2 の 2 か所を机にテープで印**。印は最後まで動かさない |
| 背景・光 | 無地のマット背景、同じ室内照明。フラッシュなし |
| NailSet | **N0 = 素の爪**、**N1 = 長いネイルチップ**（指先から 5 mm 以上出る、不透明で可）。着脱の速い粘着グミ等で |
| Mac | `swift`（Xcode Command Line Tools）が動くこと |

## 1. 撮影（同じ日・1 回で）

手は**手の甲を上に、机にべったり置き、指を伸ばして軽く開く**。指先が写真の**上**を向くように。

| 位置 | 向き |
|---|---|
| **V1** | 真上から手の甲を見下ろす（画面に手全体） |
| **V2** | V1 から**親指側へ約 35°、指先側へ約 20°** 回り込み、人差し指を狙う（合計 約 40°） |

**手順**

1. **較正 CAL**: 素の爪で、V1 から **15 枚**。**1 枚ごとに手を机から離して置き直す**。→ `CAL-01` … `CAL-15`
2. **本番 12 セッション**: `S1`=N0, `S2`=N1, `S3`=N0, … `S12`=N1（**交互**。時間の影響と NailSet の影響を分けるため）
   - 各セッションで: 手を置く → **V1 で 2 枚**（シャッターを 2 回）→ スタンドを V2 の印へ → **V2 で 2 枚** → 手を離す → チップを付け外し
   - セッション内では手を動かさない。セッションの間で必ず手を離す
3. ファイル名を付け直す: `S<n>-<N0|N1>-<V1|V2>-<shot>`（例 `S3-N0-V2-1.heic`）。写真自体は**手元に保管し、git に入れない**

計 63 枚（較正 15 ＋ 本番 48）。撮れなかった・失敗した写真は**消さずに**、`conditions.json` の `deviations` に書く。

## 2. Vision のランドマーク抽出（Mac）

```bash
mkdir -p research/stage10/data/2026-10-xx
swift research/stage10/vision-dump.swift research/stage10/data/2026-10-xx/obs \
  --upright ~/stage10-upright  ~/stage10-photos/*.heic
```

- `obs/*.json` は Layer A（Vision の 21 点を画素・左上原点で。**推定値は入れない**）
- `--upright` の JPEG は**アノテーション専用の、向きを焼き込んだコピー**。git に入れない
- 各写真について `21/21 joints` と表示されること。21 未満や `chirality left` があればメモする

（BenchTool に `--dump-observation`（`SCAN_OBSERVATION_CONTRACT.md` §8）を足して同じ JSON を出してもよい）

## 3. 手動アノテーション（shot 1 の 24 枚だけ）

**必ず `--upright` のコピーの上で**、画素座標を取る（例: Fiji / ImageJ の Multi-point → Measure、または座標を表示できる任意のツール）。

| 点 | 定義 | N0 | N1 |
|---|---|:---:|:---:|
| `cuticleSideA` / `cuticleSideB` | 爪甲が後爪郭（甘皮）から出る線の両端。**A = 親指側**。チップ装着時も**皮膚のひだ**を取る（チップの縁ではない） | ✅ | ✅ |
| `freeEdgeSideA` / `freeEdgeSideB` | 爪床と自由縁の境界（ピンクと白の境）の両端。**爪の先端ではない** | ✅ | —（見えない） |
| `indexDIP` / `indexPIP` | 関節の**手の甲側のしわの中心**（指の中心線上） | ✅ | ✅ |

- **pass 1**: 上の表の点をすべて
- **pass 2**: pass 1 を**全部終えてから**、順番を変えて、pass 1 を見ずに `cuticleSideA/B`・`indexDIP`・`indexPIP` だけをもう一度（アノテーション自身のばらつきを測るため）

`annotations.csv`（1 行 1 点）:

```csv
captureId,pass,point,x,y
S1-N0-V1-1,1,cuticleSideA,1203.0,2010.5
S1-N0-V1-1,1,cuticleSideB,1288.4,2004.1
S1-N0-V1-1,2,cuticleSideA,1204.1,2011.0
```

約 220 クリック。見えない点は**書かない**（推測で埋めない）。

## 4. 条件の記録 `conditions.json`

```json
{
  "date": "2026-10-xx",
  "hand": "right",
  "finger": "index",
  "device": "iPhone 15 Pro",
  "lens": "3x",
  "distanceCm": 45,
  "support": "tripod, two taped marks",
  "lighting": "ceiling LED, no flash",
  "background": "grey matte board",
  "N0": "bare natural nail",
  "N1": "press-on tip, opaque, ~6 mm beyond the fingertip, gel tab",
  "viewV2": "~35° toward the thumb, ~20° toward the fingertips",
  "deviations": []
}
```

## 5. 解析

```bash
node --experimental-strip-types research/stage10/analyze.ts research/stage10/data/2026-10-xx
```

`report.md` / `report.json` が同じフォルダにできる。**コミットするのは `obs/*.json`・`annotations.csv`・`conditions.json`・`report.*` だけ**（`data/.gitignore` が画像を弾く）。

形式の確認だけなら、合成データでの空撃ち: `node --experimental-strip-types research/stage10/analyze.ts --dry-run`（**証拠ではない**と 1 行目に出る）。
