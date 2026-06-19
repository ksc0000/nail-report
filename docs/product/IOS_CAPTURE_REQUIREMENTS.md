# iOS Capture Requirements

> Phase 4.5 の iOS / PWA camera capture 要件。Docs-only。
> Native iOS、AR、AI detection、Firebase Rules、schema 追加、dependency 追加、deploy は含めない。

## 1. MVP Position

推奨 MVP は既存の browser file input capture を維持する。

```text
<input type="file" accept="image/*" capture="environment">
```

理由:

- user action 後にだけ picker / camera が開く
- 既存の upload, preview, Firebase Storage path を再利用できる
- unsupported device でも通常 upload に戻しやすい
- custom camera UI より permission / cleanup / compatibility risk が低い

## 2. Product Requirements

iOS capture flow は以下を満たすこと。

- camera は明示的な user action 後にだけ開始する
- upload / photo library fallback が常に残る
- preview before save がある
- save 前に replace / remove できる
- existing NailItem create/edit flow を壊さない
- private NailItem は owner-only のまま扱う
- external AI processing は MVP では行わない
- EXIF, location, device identifiers を保存しない
- `imageSource` は `upload` / `camera` / `unknown` の粗い source だけに留める

## 3. iOS Smoke Requirements

実機 iPhone Safari で最低限確認する。

- camera option opens system capture / source picker
- upload fallback opens photo library or file source
- capture success renders preview
- picker cancel leaves the form stable
- replace image works
- remove image works
- valid image can be saved
- oversized or unsupported image shows validation feedback
- saved item opens in detail viewer
- saved item can be used in comparison view

PWA 方針を採る場合は Safari と別に確認する。

- installed app can open the create/edit flow
- camera/source picker can launch from installed mode
- preview and save match Safari where possible
- dialogs and navigation remain usable with standalone browser chrome

PWA の挙動は通常 Safari の結果から推測しない。

## 4. Privacy Requirements

UI / docs / QA 記録では以下を前提にする。

- camera access is user-initiated
- photos stay private unless explicitly shared
- public share behavior remains unchanged
- no external AI image processing without future opt-in
- no intentional EXIF, location, or detailed device metadata storage
- no analytics around detailed camera metadata without schema/privacy approval

## 5. Data Model Position

Current app already has:

```text
imageSource: "upload" | "camera" | "unknown"
```

For the iOS MVP, keep this field coarse and user-action based.

Do not add these without a separate approved schema task:

```text
capturedAt: Timestamp | null
cameraFacingMode: "environment" | "user" | "unknown"
imageMetadata: { width?: number; height?: number }
```

Reasons:

- Firestore compatibility needs review
- exports and public share fallbacks need review
- privacy copy must be updated before richer source tracking

## 6. QA Evidence Required For #113

Before commercial launch QA can call iOS capture ready, record:

- iPhone model and iOS version
- Safari version or iOS version proxy
- whether Safari, PWA installed mode, or both were tested
- orientation and viewport notes
- pass/fail for the smoke requirements above
- screenshots or short notes for failures
- whether detail viewer and comparison still work after save

Minimum matrix:

| Environment | Required |
|---|---:|
| iPhone Safari portrait | Yes |
| iPhone Safari landscape | Should |
| iPhone PWA installed mode | If PWA direction is active |
| Desktop upload fallback | Yes |
| Android Chrome | Should |

## 7. Release Gate

iOS capture remains a release risk until:

- real iPhone Safari smoke test passes
- authenticated create/edit/save flow is verified
- upload fallback remains working
- privacy copy for camera/photos is reviewed
- blocking mobile UI bugs are filed separately

If these are incomplete, keep #113 open or record a conditional go / no-go.

## 8. Follow-Up Issues

Recommended next sequence:

1. `qa: run iPhone Safari camera capture smoke test`
2. `ux: polish camera permission and fallback copy`
3. `design: decide PWA vs native iOS release path`
