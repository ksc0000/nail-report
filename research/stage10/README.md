# Stage 10 — 実写小規模 PoC（撮影・抽出・アノテーション・解析の手順）

目的は精度を作り込むことではなく、**synthetic で成立した前提のうち、実写で最初に何が崩れるか**を特定すること。
定義（何を撮るか / 何を保存するか / 何を比べるか / 何をもって崩れたとするか）は
[docs/product/NAIL_SOCKET_POC_PLAN.md §6-L](../../docs/product/NAIL_SOCKET_POC_PLAN.md) にある。ここは作業手順だけ。

> **解析は撮影前に固定してある**（`kit.ts` / `criteria.ts`、**kit v2**）。独立レビュー（GO WITH CHANGES）を受けて**1 回だけ**改訂し、写真を撮る前に再固定した。
> 実写を見てから解析やアルゴリズムを変えない。変えるときは別のコミット・別の解析として報告する（`analyze.ts` はコードが変わっていると報告の 1 行目に出す）。

## Stage 10A — 本収集の前の smoke test（パイプラインが Mac 上で一周するかだけ）

63 枚の前に、**実写 → `vision-dump.swift` → upright 座標 → アノテーション（爪は upright、DIP/PIP はブラインドの切り抜き）→ Layer A → frozen analyzer** が
**N0 と N1 の両方で**一周するかを数枚で確かめる。
**Stage 10A の写真は Stage 10B に使わない。accuracy / repeatability / F0 vs F3dNoTip の結論は出さない**（`analyze.ts --smoke` は判定も指標も出さない）。
FAIL のときに直してよいのは I/O・座標変換・format・script / runtime bug だけ（frame・pose・lift・判定・閾値・配分・12 セッション・synthetic 基準は変えない）。

**撮るもの（10 枚 ＋ 鏡像 1 枚）**: 下の §0〜§1 と同じ置き方・同じ 2 か所の印・同じ順番で。

| ファイル名 | 内容 |
|---|---|
| `CAL-01`, `CAL-02` | V1、素の爪（置き直して 2 枚） |
| `S1-N0-V1-1`, `S1-N0-V1-2` → `S1-N0-V2-1`, `S1-N0-V2-2` → `S1-N0-V1-3` | 素の爪。V1 で 2 枚 → V2 で 2 枚 → **V1 に戻ってもう 1 枚（return-to-V1）** |
| `S2-N1-V1-1` → `S2-N1-V2-1` → `S2-N1-V1-3` | 長いチップを付けて。**スマホを横向きに付け替えて**（EXIF の向きが変わる経路を通す）。V1 → V2 → V1 に戻る |
| `MIRROR-S1-N0-V1-1` | **左右反転したコピー（negative control）**: `sips -s format jpeg -f horizontal S1-N0-V1-1.HEIC --out MIRROR-S1-N0-V1-1.jpg` |

```bash
D=research/stage10/data/smoke-2026-10-xx
swift research/stage10/vision-dump.swift $D/obs --upright ~/stage10a-upright ~/stage10a-photos/*
# 1) 爪の点（爪そのものなのでブラインドにできない）: ~/stage10a-upright/*.jpg の上で -> $D/annotations.csv
#      S1-N0-V1-1, S1-N0-V2-1 : pass 1 = cuticleSideA/B, freeEdgeSideA/B   pass 2 = cuticleSideA/B
#      S2-N1-V1-1, S2-N1-V2-1 : pass 1 = cuticleSideA/B                    pass 2 = cuticleSideA/B
# 2) DIP / PIP はブラインドの切り抜きの上で（§3）
node --experimental-strip-types research/stage10/blind-cli.ts plan $D ~/stage10a-blind
swift research/stage10/blind-crops.swift $D/blind/key.json ~/stage10a-upright ~/stage10a-blind
#      ~/stage10a-blind/pass1/order.txt の順に indexDIP / indexPIP -> pass1/marks.csv、終えてから pass2 も
node --experimental-strip-types research/stage10/blind-cli.ts merge $D ~/stage10a-blind/pass1/marks.csv ~/stage10a-blind/pass2/marks.csv
# 3) $D/conditions.json を書く（§4。2 セッション分の sessionLog）
node --experimental-strip-types research/stage10/smoke-check.ts $D ~/stage10a-upright
```

`smoke-check.ts` が `$D/smoke-check.md` を書き、frozen analyzer を `--smoke` で走らせ（`smoke-report.md/json`）、`~/stage10a-upright/*.overlay.svg` を描く。
**合格 = FAIL が 0 件、かつ LOOK をすべて目で確かめたこと。** 片方の condition だけ通っても合格にならない。

| | 確かめること | 方法 |
|---|---|---|
| S1 | Vision export script が実機写真で動く・必要な landmark が両 view に入る | 写真ごとに JSON があり、21 点がこのリポジトリの名前で揃う（欠けたら FAIL — 凍結した F0 は 2 view とも 21 点を要する） |
| S2 | EXIF / orientation / mirroring | JSON の幅高さ = upright コピーの幅高さ（1/4 回転のずれを検出）。右手の甲の向きの符号と Vision の chirality。**`MIRROR-*` が無い、または鏡像と判定されないと FAIL**。EXIF の向きが 1 種類だけなら LOOK |
| S3 | upright 画像と landmark 座標の一致 | 全点が画像内。**overlay を目で見る（LOOK）**: 黄色の点が関節に、× が付けた点に乗っていること。**N1 の overlay で cuticle の × がチップの縁ではなく皮膚のひだにあること** |
| S4 | annotation と画像座標の一致 | 画像内・ブラインドから戻した DIP/PIP に最も近い Vision の点が同じ名前・cuticle が Vision の DIP と TIP の間・A が親指側・自由縁が cuticle より遠位。N0 と N1 の cuticle が DIP のしわから同じくらい先にあるかを表示 |
| S5 | DIP / PIP / TIP の landmark ID | 各指 MCP→TIP が手首から外へ順に並ぶ、indexDIP が indexPIP と indexTIP の間、親指の隣が index |
| S6 | Layer A JSON が parser を通る | 単体でも、手で付けた爪床を合わせても |
| S7 | frozen analyzer が実データを最後まで読む — **N0 と N1 の両方で** | N0 の経路・N1 の経路（どちらも F0 と F3dNoTip の origin まで）、N0 の full socket（両 view の爪床 4 点）、N1 の cuticle、pass 2 の経路（cuticle pass 2 と DIP/PIP pass 2 が origin まで）。どれか 1 つでも欠けたら FAIL |
| S8 | 写真が git に入らない | `research/` に追跡中の画像がなく、リポジトリに追加されうる画像がない |
| S9 | **物理的な移動の確認（return-to-V1）** | V1-3 を V1-1 と比べる。手のひらの相似あてはめのあとの人差し指のずれが Vision の PIP–DIP 長の 3% 以下で PASS、6% 超で FAIL（指が動いた）。手のひら全体のずれ・回転・拡大（カメラの終点が戻っていない、または手全体が動いた — 区別できない）が 5% / 1° / 1% を超えたら LOOK。return の写真が無ければ FAIL |
| S10 | **ブラインド DIP/PIP の経路** | key があり、shot 1 の各写真に pass 1・2 の切り抜きがある・ID が写真を明かさない・戻した点が自分の切り抜きの中に落ちる・`annotations.csv` に DIP/PIP が無い。**切り抜きを目で見る（LOOK）**: しわが入っていて、爪とチップが入っていないこと |
| S11 | 撮影の記録 | `conditions.json` に両 view のレンズ・ズーム・距離・終点の再現方法、手と前腕の支え、sessionLog がある・全写真に撮影時刻がある・撮影順が V1 1, 2 → V2 1, 2 → V1 3・レンズ（EXIF）が全写真で同じ（違えば LOOK） |

**コミットするもの**: `$D/obs/*.json`・`annotations.csv`・`annotations-blind.csv`・`blind/key.json`・`conditions.json`・`smoke-check.md`・`smoke-report.md/json` だけ。
写真・upright・切り抜き・overlay は入れない（`data/.gitignore` が弾く。upright と切り抜きはそもそもリポジトリの外に置く）。

### 10B の前の独立レビュー（Codex CLI）— 実施済み

依頼文は [`review/REVIEW_REQUEST_10B_GATE.md`](review/REVIEW_REQUEST_10B_GATE.md)（結論を含めない。レビュアーがリポジトリを自分で読む）。
判定は **GO WITH CHANGES**。採用した変更は §6-L の「kit v2」にまとめ、この手順と解析に反映した。もう一度かけるなら:

```bash
git fetch origin claude/festive-lovelace-5teapy && git checkout claude/festive-lovelace-5teapy && git pull
npm ci   # レビュアーがテストを走らせられるように
codex exec -m gpt-6-astra -s read-only -C "$PWD" --ephemeral \
  -o ~/astra-10b-gate.md - < research/stage10/review/REVIEW_REQUEST_10B_GATE.md
```

## 0. 用意するもの

| | |
|---|---|
| 手 | **右手の人差し指**（H1 テンプレートが右手） |
| 端末・レンズ | いつもの iPhone。**望遠（2× 以上）に固定**する。カメラアプリは暗さや近さで勝手にレンズを替えることがあるので、明るさと距離を十分にとり、Stage 10A で EXIF のレンズが全写真で同じことを確かめる（S11） |
| 距離 | **約 40 cm 以上、望遠が手全体を収められる範囲でなるべく遠く**（lift は weak perspective を仮定している。V2 の約 40° では、40 cm だと手のひらの奥行きで尺度が ±7% 程度ずれる。遠近を補正する新しいアルゴリズムは作らない — 崩れたらそれを実写の証拠として扱う） |
| カメラの終点 | 三脚を V1・V2 の 2 か所に置く。**位置だけでなく向きも再現できるように**: 脚の位置を机にテープで印、雲台はロックしたまま、パン・チルトの角度（目盛りか水準器アプリの値）を `conditions.json` に記録。スマホの取り付け向きも固定。カメラを動かすのは V1 ↔ V2 の移動だけ |
| 手と前腕の支え | 前腕を台（たたんだタオル等）に載せ、手首の位置を机に印。置き直しのたびにそこへ戻す（毎回ぴったりでなくてよい） |
| シャッター | リモートシャッター（Bluetooth）か 2 秒タイマー。スマホに触れて動かさない |
| 背景・光 | 無地のマット背景、同じ室内照明。フラッシュなし |
| NailSet | **N0 = 素の爪**、**N1 = 長いネイルチップ**（指先から 5 mm 以上出る、不透明で可）。着脱の速い粘着グミ等で |
| Mac | `swift`（Xcode Command Line Tools）が動くこと |

## 1. 撮影（同じ日・1 回で）

手は**手の甲を上に、机にべったり置き、指を伸ばして軽く開く**。指先が写真の**上**を向くように。

| 位置 | 向き |
|---|---|
| **V1** | 真上から手の甲を見下ろす（画面に手全体） |
| **V2** | V1 から**親指側へ約 35°、指先側へ約 20°** 回り込み、人差し指を狙う（合計 約 40°） |

**順番は ABBA × 3（時間に対して釣り合わせる）**: 交互（ABAB）だと N1 が平均で 1 セッション遅く、1 日の中のゆっくりした変化が NailSet の差に見えてしまう。

| S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| N0 | N1 | N1 | N0 | N0 | N1 | N1 | N0 | N0 | N1 | N1 | N0 |

**手順**

1. **較正 CAL**: 素の爪で、V1 から **15 枚**。**1 枚ごとに手を机から離して置き直す**。→ `CAL-01` … `CAL-15`
2. **本番 12 セッション**（上の順）。各セッションで:
   - 手を置く。**毎回置き直す** — 同じ条件が 2 回続いても（S2→S3 など）前のセッションの続きにしない。N1 は**毎回チップを付け直す**（前が N1 でも一度外して付け直す）
   - **V1 で 2 枚**（リモートで 2 回）→ スタンドを V2 の印へ（向きも記録どおりに）→ **V2 で 2 枚** → 手を離す
   - セッション内では手を動かさない。セッションの間で必ず手を離す
   - `conditions.json` の `sessionLog` に、開始時刻・チップの付け外しの問題・やり直し・気づいたことを書く
3. ファイル名を付け直す: `S<n>-<N0|N1>-<V1|V2>-<shot>`（例 `S3-N1-V2-1.heic`）。写真自体は**手元に保管し、git に入れない**

計 63 枚（較正 15 ＋ 本番 48）。撮れなかった・失敗した写真は**消さずに**、`conditions.json` の `deviations` に書く（解析はそのセッションを理由つきで除外し、黙って捨てない）。
撮影時刻（EXIF）で順番を確かめるので、写真の時刻は書き換えない。

## 2. Vision のランドマーク抽出（Mac）

```bash
mkdir -p research/stage10/data/2026-10-xx
swift research/stage10/vision-dump.swift research/stage10/data/2026-10-xx/obs \
  --upright ~/stage10-upright  ~/stage10-photos/*.heic
```

- `obs/*.json` は Layer A（Vision の 21 点を画素・左上原点で。**推定値は入れない**）。撮影時刻とレンズ（EXIF）も残る
- `--upright` の JPEG は**アノテーション専用の、向きを焼き込んだコピー**。git に入れない
- 各写真について `21/21 joints` と表示されること。21 未満や `chirality left` があればメモする

（BenchTool に `--dump-observation`（`SCAN_OBSERVATION_CONTRACT.md` §8）を足して同じ JSON を出してもよい）

## 3. アノテーション（shot 1 の 24 枚だけ）

| 点 | 定義 | N0 | N1 | どこで |
|---|---|:---:|:---:|---|
| `cuticleSideA` / `cuticleSideB` | 爪甲が後爪郭（甘皮）から出る線の両端。**A = 親指側**。チップ装着時も**皮膚のひだ**を取る（チップの縁ではない） | ✅ | ✅ | upright コピー |
| `freeEdgeSideA` / `freeEdgeSideB` | 爪床と自由縁の境界（ピンクと白の境）の両端。**爪の先端ではない** | ✅ | —（見えない） | upright コピー |
| `indexDIP` / `indexPIP` | 関節の**手の甲側のしわの中心**（指の中心線上） | ✅ | ✅ | **ブラインドの切り抜き** |

**爪の点（cuticle・free edge）**は爪そのものなので条件を隠せない。`--upright` のコピーの上で画素座標を取る（例: Fiji / ImageJ の Multi-point → Measure）→ `annotations.csv`:

```csv
captureId,pass,point,x,y
S1-N0-V1-1,1,cuticleSideA,1203.0,2010.5
S1-N0-V1-1,2,cuticleSideA,1204.1,2011.0
```

**DIP / PIP はブラインドで**付ける（どの NailSet の写真か分からない状態で）:

```bash
node --experimental-strip-types research/stage10/blind-cli.ts plan research/stage10/data/2026-10-xx ~/stage10-blind
swift research/stage10/blind-crops.swift research/stage10/data/2026-10-xx/blind/key.json ~/stage10-upright ~/stage10-blind
```

- 切り抜きは**指が上を向くように回転**し、**Vision の DIP の少し先（爪のひだより手前）で切ってある**ので、爪もチップも写らない。ID はランダム、順番もランダム、Vision の点も前の印も描かない
- `~/stage10-blind/pass1/order.txt` の順に切り抜きを開き、`indexDIP` と `indexPIP` を付けて `pass1/marks.csv`（`blindId,point,x,y`、切り抜きの画素）へ。しわが見えない切り抜きは**書かない**（推測で埋めない）
- **pass 1 を全部終えてから** pass 2（別の ID・別の順番・少しずらした窓）を同じように → `pass2/marks.csv`
- 付け終わるまで、`blind/key.json`・データフォルダ・overlay は開かない
- 終わったら戻す: `node --experimental-strip-types research/stage10/blind-cli.ts merge research/stage10/data/2026-10-xx ~/stage10-blind/pass1/marks.csv ~/stage10-blind/pass2/marks.csv` → `annotations-blind.csv`（元画像の画素に戻した DIP/PIP）

**pass 2**（アノテーション自身のばらつきを測るため）: 爪の点は `cuticleSideA/B` だけを、pass 1 を全部終えてから順番を変えて、pass 1 を見ずにもう一度。DIP/PIP は上のとおりブラインドの pass 2。

約 120 クリック（爪）＋ 96 クリック（48 切り抜き × 2 点）。

## 4. 条件の記録 `conditions.json`

解析は欠けた項目を報告する（黙って埋めない）。

```json
{
  "date": "2026-10-xx",
  "hand": "right",
  "finger": "index",
  "device": "iPhone 15 Pro",
  "views": {
    "V1": { "lens": "3x telephoto, locked", "zoom": 3, "distanceCm": 60, "endpoint": "tripod on marks A, head locked: pan 0°, tilt -90° (level app)" },
    "V2": { "lens": "3x telephoto, locked", "zoom": 3, "distanceCm": 62, "endpoint": "tripod on marks B, head locked: pan 35° toward the thumb, tilt -70°" }
  },
  "endpointReproduction": "feet on taped marks, ball head locked, angles read off the level app before every shot",
  "handSupport": "forearm on a folded towel, wrist on a taped mark",
  "lighting": "ceiling LED, no flash",
  "background": "grey matte board",
  "N0": "bare natural nail",
  "N1": "press-on tip, opaque, ~6 mm beyond the fingertip, gel tab, re-attached every N1 session",
  "sessionLog": [
    { "session": "S1", "nailSet": "N0", "startedAt": "10:02", "attachment": "n/a", "notes": "" },
    { "session": "S2", "nailSet": "N1", "startedAt": "10:07", "attachment": "ok", "notes": "" }
  ],
  "deviations": []
}
```

## 5. 解析

```bash
node --experimental-strip-types research/stage10/analyze.ts research/stage10/data/2026-10-xx
```

`report.md` / `report.json` が同じフォルダにできる。報告には、条件ごとの**データの勘定**（attempted / available / pose accepted / frame accepted / primary comparison eligible / Q5 matched と、
外れたセッションごとの理由）、**プロトコルからの逸脱**（ABBA の順・撮影時刻の順）、判定（**BREAK / WEAKENED / HOLD / INCONCLUSIVE**）、
B2 と B5 のセッション単位の不確かさ、**B6 の姿勢診断**、Q5 の参照差し替えの感度、**次に疑うボトルネックと未解決の説明**が入る。

- **HOLD は「この実験の感度の範囲で崩れは見つからなかった」だけを意味し、同等・不変ではない。**
- **B6 は判定ではなく診断**: BREAK は姿勢の不整合の証拠、HOLD は姿勢が再現したことも姿勢のばらつきが除外されたことも意味しない、INCONCLUSIVE は姿勢について何も言わない。
  B1 が BREAK で B6 が BREAK でなければ、検出器ノイズ・姿勢・その相互作用は区別できない
- 報告は**ボトルネックを特定しない**。具体的な failure mode を前に出すのは独立した break の証拠（B3・B2・B6 の BREAK）があるときだけで、それ以外は未解決の説明を並べる。Q5 は感度であって因果ではない

**コミットするのは `obs/*.json`・`annotations.csv`・`annotations-blind.csv`・`blind/key.json`・`conditions.json`・`report.*` だけ**（`data/.gitignore` が画像を弾く）。

形式の確認だけなら、合成データでの空撃ち: `node --experimental-strip-types research/stage10/analyze.ts --dry-run`（**証拠ではない**と 1 行目に出る）。
