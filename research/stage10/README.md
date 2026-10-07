# Stage 10 — 実写小規模 PoC（撮影・抽出・アノテーション・解析の手順）

目的は精度を作り込むことではなく、**synthetic で成立した前提のうち、実写で最初に何が崩れるか**を特定すること。
定義（何を撮るか / 何を保存するか / 何を比べるか / 何をもって崩れたとするか）は
[docs/product/NAIL_SOCKET_POC_PLAN.md §6-L](../../docs/product/NAIL_SOCKET_POC_PLAN.md) にある。ここは作業手順だけ。

> **解析は撮影前に固定してある**（`kit.ts` / `criteria.ts`）。実写を見てから解析やアルゴリズムを変えない。
> 変えるときは別のコミット・別の解析として報告する（`analyze.ts` はコードが変わっていると報告の 1 行目に出す）。

## Stage 10A — 本収集の前の smoke test（パイプラインが Mac 上で一周するかだけ）

63 枚の前に、**実写 → `vision-dump.swift` → upright 座標 → 手動アノテーション → Layer A → frozen analyzer** が一周するかを数枚で確かめる。
**Stage 10B の統計には使わない。accuracy / repeatability / F0 vs F3dNoTip の結論は出さない**（`analyze.ts --smoke` は判定も指標も出さない）。
FAIL のときに直してよいのは I/O・座標変換・format・script / runtime bug だけ（frame・pose・lift・判定・閾値・配分・12 セッション・synthetic 基準は変えない）。

**撮るもの（8 枚 ＋ 鏡像 1 枚）**: 下の §0〜§1 と同じ置き方・同じ 2 か所の印で。

| ファイル名 | 内容 |
|---|---|
| `CAL-01`, `CAL-02` | V1、素の爪（置き直して 2 枚） |
| `S1-N0-V1-1`, `S1-N0-V1-2` | V1、素の爪、**スマホを縦に**持って |
| `S1-N0-V2-1`, `S1-N0-V2-2` | V2、素の爪 |
| `S2-N1-V1-1`, `S2-N1-V2-1` | 長いチップを付けて、**スマホを横に**持って（EXIF の向きが変わる場合を通す） |
| `MIRROR-S1-N0-V1-1` | **左右反転したコピー（negative control）**: `sips -s format jpeg -f horizontal S1-N0-V1-1.HEIC --out MIRROR-S1-N0-V1-1.jpg` |

```bash
D=research/stage10/data/smoke-2026-10-xx
swift research/stage10/vision-dump.swift $D/obs --upright ~/stage10a-upright ~/stage10a-photos/*
# annotate on ~/stage10a-upright/*.jpg  (§3 と同じ定義で、約 30 クリック):
#   S1-N0-V1-1, S1-N0-V2-1 : pass 1 = cuticleSideA/B, freeEdgeSideA/B, indexDIP, indexPIP
#   S1-N0-V1-1             : pass 2 = cuticleSideA/B, indexDIP, indexPIP
#   S2-N1-V1-1, S2-N1-V2-1 : pass 1 = cuticleSideA/B, indexDIP, indexPIP
#   -> $D/annotations.csv
node --experimental-strip-types research/stage10/smoke-check.ts $D ~/stage10a-upright
```

`smoke-check.ts` が `$D/smoke-check.md` を書き、frozen analyzer を `--smoke` で走らせ（`smoke-report.md/json`）、`~/stage10a-upright/*.overlay.svg` を描く:

| | 確かめること | 方法 |
|---|---|---|
| S1 | Vision export script が実機写真で動く | 写真ごとに JSON があり、21 点がこのリポジトリの名前で揃う（欠けたら FAIL — 凍結した F0 は 2 view とも 21 点を要する） |
| S2 | EXIF / orientation / mirroring | JSON の幅高さ = upright コピーの幅高さ（1/4 回転のずれを検出）。右手の甲の向きの符号（wrist→indexMCP→pinkyMCP）と Vision の chirality。**`MIRROR-*` が無い、または鏡像と判定されないと FAIL**。EXIF の向きが 1 種類しかなければ LOOK（回転の経路を通っていない） |
| S3 | upright 画像と landmark 座標の一致 | 全点が画像内。**overlay を目で見る（LOOK）**: 黄色の点が関節に、× が付けた点に乗っていること |
| S4 | annotation CSV と画像座標の一致 | 画像内・付けた DIP/PIP に最も近い Vision の点が同じ名前・cuticle が Vision の DIP と TIP の間・A が親指側・自由縁が cuticle より遠位 |
| S5 | DIP / PIP / TIP の landmark ID | 各指 MCP→TIP が手首から外へ順に並ぶ、indexDIP が indexPIP と indexTIP の間、親指の隣が index |
| S6 | Layer A JSON が parser を通る | 単体でも、手で付けた爪床を合わせても |
| S7 | frozen analyzer が実データを最後まで読む | `analyze.ts --smoke` が終了コード 0 で、少なくとも 1 ペアが F0 と F3dNoTip の socket origin まで届く |
| S8 | 写真が git に入らない | `research/` に追跡中の画像がなく、リポジトリに追加されうる画像がない |

**コミットするもの**: `$D/obs/*.json`・`annotations.csv`・`conditions.json`・`smoke-check.md`・`smoke-report.md/json` だけ。写真・upright・overlay は入れない（`data/.gitignore` が弾く）。

### 10B の前の独立レビュー（Codex CLI）

依頼文は [`review/REVIEW_REQUEST_10B_GATE.md`](review/REVIEW_REQUEST_10B_GATE.md)（結論を含めない。レビュアーがリポジトリを自分で読む）。ログイン済みの Codex CLI がある端末で、このブランチの最新を読ませる:

```bash
git fetch origin claude/festive-lovelace-5teapy && git checkout claude/festive-lovelace-5teapy && git pull
npm ci   # レビュアーがテストを走らせられるように
codex exec -m gpt-6-astra -s read-only -C "$PWD" --ephemeral \
  -o ~/astra-10b-gate.md - < research/stage10/review/REVIEW_REQUEST_10B_GATE.md
```

`-s read-only` なのでレビュアーはファイルを書けない。結果（`~/astra-10b-gate.md`）は `research/stage10/review/` に置いてコミットするか、次の指示に添える。指摘は自動では直さない。

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
