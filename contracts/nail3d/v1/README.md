# Canonical Nail Data — contract v1 fixtures

> **これらの fixtures は iOS / Web 間の契約そのものである。**
> 仕様本文: [`docs/product/CANONICAL_NAIL_DATA_CONTRACT.md`](../../../docs/product/CANONICAL_NAIL_DATA_CONTRACT.md)

`contractVersion: 1`。このディレクトリはプラットフォーム非依存であり、`src/` にも iOS 実装にも依存しない。

## 使い方

| 側 | 使い方 |
|---|---|
| **Web**（実装済み） | `tests/nail3dContract.test.ts` がこの JSON をディスクから読み、`src/lib/nail3dContract.ts` のパーサ挙動を検証する |
| **iOS**（未実装） | 同じ JSON を読み、(a) `valid-*` を自分のデコーダが受理すること、(b) `malformed-*` を拒否すること、(c) 自分の writer の出力が `valid-full` と同じ形であることを検証する |

**iOS 側は契約を単独で変更しない。** 変更が必要な場合は本リポジトリの Issue で仕様 → fixtures → 両実装の順に進める。

## fixtures 一覧

### HandProfile

| ファイル | 期待される扱い |
|---|---|
| `handprofile-valid-right.json` | 受理。5 socket |
| `handprofile-valid-left.json` | 受理。`handedness: left`（右手 NailSet との不一致検証用） |
| `handprofile-valid-partial-sockets.json` | 受理。socket 3 個のみ（欠けた指の爪は描画対象から外れる） |
| `handprofile-unsupported-version.json` | 拒否（`contractVersion: 999`）→ HandProfile なし扱い |
| `handprofile-malformed-socket.json` | 拒否（`origin` が vec3 でない） |
| `handprofile-malformed-bonelengths.json` | 拒否（`boneLengths` が 20 要素でない） |

### NailSet

| ファイル | 期待される扱い |
|---|---|
| `nailset-valid-full.json` | 受理。5 本・`completeness: full`・heightMap あり |
| `nailset-valid-partial.json` | 受理。3 本・`completeness: partial` |
| `nailset-valid-no-heightmap.json` | 受理。ただし heightMap が無いため HandProfile 不在時は L1 に落ちられない |
| `nailset-unknown-contract-version.json` | **L0**（`contractVersion: 999` は未知） |
| `nailset-invalid-contract-version.json` | **L0**（`"1"` は文字列） |
| `nailset-missing-contract-version.json` | **L0**（欠落） |
| `nailset-malformed-missing-geometry-field.json` | **L0**（`geometry.curveV` 欠落） |
| `nailset-malformed-handedness.json` | **L0**（`"both"` は enum 外） |
| `nailset-malformed-completeness-mismatch.json` | **L0**（`full` なのに 3 本） |
| `nailset-malformed-duplicate-socket.json` | **L0**（`socketRef` 重複） |
| `nailset-malformed-uvtransform.json` | **L0**（mat3 が 9 要素でない） |

## 不変条件（fixtures が守らせるもの）

| | |
|---|---|
| **INV-1** | 写真記録は常に成立する。L0 は異常ではなく正常な結果 |
| **INV-2** | 3D の失敗を `NailItem` 本体に書き戻さない。失敗は「NailSet ドキュメント不在」で表す |
| **INV-3** | 未知 `contractVersion` / malformed / HandProfile 不在 / texture 取得不可は**例外を投げず**に下位レベルへ降格する |

## 降格レベル

```text
L2  HandProfile + NailSet（パラメトリック 5 本を socket に配置）
L1  2.5D（heightMap のみ。HandProfile 不要）
L0  写真のみ（常に有効）
```

`L3`（手 ＋ 10 本）は NailSet 2 つの合成であり、単一 NailSet を見る
`planNail3DRender()` の外側で決まる。

## 追加・変更のルール

1. **additive-only。** フィールド追加で `contractVersion` を上げない。未知フィールドは無視される（テスト済み）
2. フィールドの削除・型変更・意味変更は `contractVersion` を上げ、`v2/` を新設する
3. fixtures を追加したら `tests/nail3dContract.test.ts` に期待値を追加する
4. `valid-*` / `malformed-*` の命名を守る
