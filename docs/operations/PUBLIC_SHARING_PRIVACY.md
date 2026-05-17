# Public Sharing Privacy Notes

> **Status: MVP implemented and browser QA passed on 2026-05-17**
> このドキュメントは、`publicShares/{shareId}` を使った public sharing 機能の privacy note と運用上の注意をまとめたものです。
> 対象読者は、共有リンクを使うユーザーと、この機能を保守する開発者の両方です。

---

## ユーザー向けガイド

### 共有リンクの仕組み

public sharing は **unlisted share link** 方式です。

- 共有リンクを知っている人は、このコレクションを閲覧できます
- 一般公開一覧や検索ページに積極的に載せる仕組みではありません
- public page には `noindex` を付与しており、検索エンジン掲載を意図していません
- ただし、リンクを受け取った人が別の人へ転送する可能性はあります

### 共有対象

public sharing で公開されるのは、共有作成時点の **snapshot** です。
元の `users/{uid}/nailItems` をそのまま公開するものではありません。

共有対象フィールド:

- `title`
- `tags`
- `createdAt`

共有対象外:

- `memo`
- `imageUrl`
- Storage image
- `ownerUid`
- owner email
- owner displayName

### Privacy note

UI に表示する privacy note の基本文言は以下です。

> 共有リンクを知っている人は、このコレクションを閲覧できます。MVPではメモと画像は共有対象に含まれません。個人情報を含む内容を共有しないよう確認してください。共有はいつでも停止できます。

### 共有停止

- 共有は `Disable share` で停止できます
- 停止後、その share URL では閲覧できません
- 停止は document delete ではなく、`isEnabled: false` による revoke です

### 利用上の注意

- タイトルやタグに個人情報を含めると、その情報は共有相手に見えます
- MVP では memo と画像を共有しませんが、`title` と `tags` は共有されます
- 不特定多数へ転送されても問題ない内容だけ共有してください

---

## 開発者向け設計メモ

### Data model

`publicShares/{shareId}` は以下の shape を想定します。

```ts
publicShares/{shareId} = {
  ownerUid: string, // rules用。UIには表示しない
  isEnabled: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  title: string,
  source: "snapshot",
  items: [
    {
      id: string,
      title: string,
      tags: string[],
      createdAt?: string
    }
  ]
}
```

実装上の TypeScript では `createdAt` は `Timestamp | null` を扱います。

### Snapshot方式を採用する理由

- `users/{uid}/nailItems` を直接公開すると private collection と public view の境界が曖昧になる
- 共有時点の内容を固定しやすく、公開対象フィールドを明示的に絞れる
- public page を read-only にしやすい
- revoke を `isEnabled: false` で扱いやすい

### `users/{uid}/nailItems` を直接公開しない理由

- private collection の owner-only rules を壊したくない
- 共有対象外の field が将来増えた場合に漏洩リスクが高い
- 通常アプリ用の CRUD / upload / summary / export と公開ページの責務を分離したい

### 除外フィールドの理由

`memo` を除外する理由:

- サロン名、価格、個人メモなど privacy risk が高い情報を含みやすいため

`imageUrl` / Storage image を除外する理由:

- 画像URLや Storage object を共有すると、意図しない二次利用や URL 拡散のリスクが上がるため
- MVP では Storage Rules を変更せず、画像共有の要件も切り離したいため

owner email / displayName を除外する理由:

- owner identity を public page に出さないため
- unlisted share link は collection の共有であり、owner profile 公開ではないため

### Firestore Rules の公開範囲

Firestore Rules は `publicShares/{shareId}` に対して次を許可します。

- `isEnabled == true` の document に対する未認証 read
- owner による create
- owner による update

禁止するもの:

- client-side delete
- 未認証 write
- 別ユーザーによる update

### revoke に delete ではなく disable を使う理由

- share URL を無効化する責務を `isEnabled` に集約できる
- audit 的に share document を残せる
- disabled state の safe UI を実装しやすい
- 将来、期限付きリンクや状態遷移を追加しやすい

### Public page の制約

- public page は read-only
- owner controls は表示しない
- auth UI、CRUD form、upload、export、share creation UI は public mode で表示しない
- `ownerUid` は rules 用 field として保持するが、UI では使用しない

### Future work

MVP の scope 外で、別 Issue / 別設計として検討する項目:

- 画像共有
- memo 共有
- 期限付き URL
- abuse / report 導線
- analytics
- owner-visible audit trail

---

## 関連ファイル

- [FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md)
- [ROADMAP.md](../product/ROADMAP.md)
- [publicShares.ts](../../src/lib/publicShares.ts)
- [firestore.rules](../../firestore.rules)
