# Public Share Expiration Plan

> This document is a design plan for future public share expiration support.
> It does not change application code, Firestore Rules, data, or deployments.

---

## 1. Background

The current public sharing MVP stores unlisted share snapshots in `publicShares/{shareId}`.

Current behavior:

- `isEnabled == true` shares can be read by anyone with the URL.
- Owners can create shares from the app.
- Owners can list their own enabled and disabled shares in `共有リンク管理`.
- Owners can revoke enabled shares by setting `isEnabled:false` and `updatedAt`.
- Disabled shares remain visible to the owner.
- Client-side delete is denied.
- Re-enable is denied.
- `ownerUid`, `source`, `createdAt`, `title`, and `items` are immutable after create.
- Shared snapshots intentionally exclude `memo`, `imageUrl`, owner email, and owner display name.

Expiration is useful because unlisted URLs can be copied, forwarded, or forgotten. A time limit reduces the long-term exposure window while preserving the current revoke model.

---

## 2. Goals

- Add expiration support to public share links.
- Prevent public access after expiration.
- Keep owner management visibility for enabled, disabled, expired, and legacy shares.
- Keep the existing revoke behavior.
- Preserve the current security hardening for immutable fields, no delete, and no re-enable.
- Keep the implementation incremental and easy to validate.

---

## 3. Non-Goals

- No image sharing.
- No memo sharing.
- No client-side delete support.
- No re-enable support.
- No broad public page redesign.
- No production deploy as part of this design task.
- No migration or backfill in this design task.

---

## 4. Data Model Proposal

Add an `expiresAt` field to `publicShares/{shareId}`.

Recommended field:

```text
expiresAt: Timestamp | null
```

### Field Semantics

| Topic | Recommendation |
|---|---|
| Type | Firestore `Timestamp` |
| New shares | Required by the create flow, but may be `null` only if "never expires" is explicitly selected |
| Existing shares without `expiresAt` | Treat as legacy non-expiring shares for compatibility |
| `expiresAt:null` | Means never expires |
| Owner editing after create | Do not allow editing in the MVP |
| Default options | 7 days, 30 days, never |
| Recommended MVP default | 30 days |

### Compatibility Decision

Existing public share documents may not have `expiresAt`.

Options:

| Option | Pros | Cons |
|---|---|---|
| Grandfather existing shares as non-expiring | No sudden link breakage; no migration required | Existing links keep current exposure until revoked |
| Treat missing `expiresAt` as expired | Strongest privacy posture | Breaks existing links unexpectedly |
| Backfill existing shares | Explicit data state | Requires migration and human review |
| Allow missing `expiresAt` only for legacy docs | Compatible and explicit | Rules and UI need legacy handling |

Recommended MVP: allow missing `expiresAt` only for legacy docs and treat missing as non-expiring.

This avoids breaking existing links while making new shares explicit. A later migration can backfill legacy shares with either `expiresAt:null` or a chosen expiration date after human approval.

---

## 5. Firestore Rules Proposal

Public read should eventually be allowed only when:

```text
resource.data.isEnabled == true
and share is not expired
```

Owner management read should allow the owner to read:

- enabled shares
- disabled shares
- expired shares
- legacy shares without `expiresAt`

### Expiration Predicate

For MVP compatibility, public read should treat these as not expired:

- `expiresAt == null`
- missing `expiresAt` on legacy docs
- `expiresAt > request.time`

Conceptual predicate:

```text
isNotExpiredForPublicRead =
  !('expiresAt' in resource.data)
  || resource.data.expiresAt == null
  || resource.data.expiresAt > request.time
```

Use `request.time` rather than client time in Firestore Rules. The app may display dates using client locale, but authorization must be server-evaluated.

### Update Behavior

Update behavior should remain constrained:

- owner-only
- revoke remains allowed
- no delete
- no re-enable
- no `title`, `items`, `source`, `ownerUid`, or `createdAt` tampering

Recommended MVP: `expiresAt` is immutable after create.

Rationale:

- Keeps Rules simple.
- Avoids public link extension after sharing.
- Avoids ambiguous UX around "renewing" expired shares.
- Keeps expiration behavior easy to reason about and test.

If expiration editing becomes necessary later, it should be a separate product/security decision with its own Rules Playground cases.

---

## 6. UI Proposal

Minimal UI changes:

- Share creation UI chooses an expiration option.
- Default option is 30 days.
- Options: 7 days, 30 days, never.
- Share management list shows expiration date.
- Share management list shows an expired status.
- Expired shares remain visible to the owner.
- Expired shares should not look active.
- Open/copy actions for expired shares should be disabled or visually warned.
- Public share page shows a friendly expired message.
- Revoke remains available for enabled shares if useful, even if expired.
- Avoid broad navigation or public page redesign.

Suggested labels:

- `有効`
- `無効`
- `期限切れ`
- `有効期限`
- `7日`
- `30日`
- `期限なし`
- `この共有リンクは期限切れです`

UI should distinguish disabled and expired:

- Disabled: owner intentionally stopped sharing.
- Expired: time limit ended public access.

---

## 7. Rules Playground Cases

Run these in Firebase Console Rules Playground before any real deploy.

| Case | Expected |
|---|---|
| unauthenticated read enabled + not expired | ALLOW |
| unauthenticated read enabled + expired | DENY |
| unauthenticated read disabled + not expired | DENY |
| unauthenticated read disabled + expired | DENY |
| owner read enabled + not expired | ALLOW |
| owner read enabled + expired | ALLOW |
| owner read disabled + expired | ALLOW |
| non-owner read enabled + expired | DENY |
| owner revoke enabled + not expired | ALLOW |
| owner re-enable disabled share | DENY |
| owner update `expiresAt` after create | DENY |
| unauthenticated update | DENY |
| owner delete | DENY |

Also test legacy docs without `expiresAt`:

| Case | Expected |
|---|---|
| unauthenticated read enabled legacy share without `expiresAt` | ALLOW |
| owner read disabled legacy share without `expiresAt` | ALLOW |

---

## 8. Implementation Slices

Proposed future tasks:

| Slice | Scope |
|---|---|
| E1 | Docs/design approval |
| E2 | Data model + create flow adds `expiresAt` |
| E3 | Firestore Rules update + Rules Playground verification |
| E4 | Management list expiration status |
| E5 | Public share page expired message |
| E6 | Dev deploy + smoke test |

Keep each slice small. Firestore Rules changes and real deploys require human approval.

---

## 9. Validation Plan

For implementation PRs:

```text
[ ] npm run build
[ ] npm run lint
[ ] firebase deploy --only firestore:rules --dry-run --project nail-report-dev-ksc0000
[ ] git diff --check
[ ] Rules Playground human verification
[ ] authenticated browser smoke test
[ ] public expired link smoke test
```

Do not run a real Firebase deploy until:

- code review is complete
- CI is green
- Rules Playground cases pass
- human approval is given

---

## 10. Risks and Decisions

| Risk / Decision | Notes |
|---|---|
| Existing data compatibility | Recommended MVP treats missing `expiresAt` as legacy non-expiring |
| Timezone handling | Store Firestore `Timestamp`; display with locale; enforce with `request.time` |
| Server time vs client time | Firestore Rules must use `request.time`; app display may use client time |
| Index requirements | Querying owner shares only by `ownerUid` needs no composite index; adding order/filter by `expiresAt` may require indexes |
| Disabled vs expired UX | Show distinct labels so owner understands whether a share was revoked or timed out |
| Owner visibility | Expired shares remain listed for owner management and auditability |
| Open/copy affordance | Expired shares should not be presented as active; disable or warn before copy/open |
| `expiresAt` mutability | Recommended MVP keeps it immutable after create |
| Legacy shares | Later backfill can make legacy state explicit, but should be a separate approved task |

---

## Recommended MVP Decision Summary

- Add `expiresAt: Timestamp | null`.
- New shares require an explicit expiration selection.
- Default expiration: 30 days.
- `null` means never expires.
- Missing `expiresAt` means legacy non-expiring.
- `expiresAt` is immutable after create.
- Public read requires `isEnabled == true` and not expired.
- Owner read continues to allow enabled, disabled, expired, and legacy shares.
- Revoke remains `isEnabled:false` + `updatedAt`.
- No delete and no re-enable.
