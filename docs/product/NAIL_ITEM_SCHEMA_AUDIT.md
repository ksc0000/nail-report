# NailItem Schema Audit

This document provides a detailed audit of the `NailItem` data model and its Firestore persistence structure as of the Jewelry Box Phase 1 refresh.

## Data Model (TypeScript)

The primary interface is defined in `src/lib/firestoreModel.ts`.

```typescript
export interface NailItem {
  title: string
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  memo: string
  imageSource?: 'upload' | 'camera' | 'unknown'
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export interface NailItemDoc extends NailItem {
  id: string
}
```

## Firestore Persistence Structure

### Document Path
`users/{userId}/nailItems/{itemId}`

### Field Details

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | The name or title of the nail design. |
| `imageUrl` | `string` | Yes | URL to the full-resolution image in Firebase Storage. |
| `thumbnailUrl` | `string` | Yes | URL to the thumbnail image. Currently mirrored from `imageUrl`. |
| `tags` | `string[]` | Yes | Array of tags (e.g., "pink", "office"). Max 10 tags. |
| `memo` | `string` | Yes | User notes about the item (e.g., salon name, price). |
| `imageSource` | `string` | No* | One of `'upload'`, `'camera'`, or `'unknown'`. |
| `createdAt` | `Timestamp` | Yes | Firestore server timestamp of creation. |
| `updatedAt` | `Timestamp` | Yes | Firestore server timestamp of last update. |

*\* Note: Defaults to `'unknown'` in creation/update logic if not provided.*

## Backward Compatibility Requirements

1.  **Optional Fields:** The `imageSource` field was added in a later sub-phase. Legacy documents created before this addition may lack this field. The application code must handle its absence (e.g., defaulting to 'unknown').
2.  **Memo Field:** The `memo` field was also an incremental addition. While now treated as required in the interface, code handles empty strings for legacy data.
3.  **Public Shares:** The `publicShares` collection stores snapshots of `NailItem` data. Specifically, `PublicShareItemSnapshot` includes `id`, `title`, `tags`, and `createdAt`. Any schema change to `NailItem` that should be reflected in shared views must also consider the snapshot structure in `src/lib/publicShares.ts`.

## Human Gate for Schema Changes

**G3 (DB Schema Change):** Any modification to the Firestore schema, including adding new required fields, changing field types, or altering the document hierarchy, requires explicit human approval.

Future fields proposed for 3D Preview (Phase 8+) such as `shape`, `color`, `texture`, `modelId`, etc., must not be implemented without triggering this gate. Refer to `docs/product/FIRESTORE_3D_SCHEMA_DESIGN.md` for the proposed design.

## Verification Checklist for Future Changes
- [ ] Update `NailItem` and `NailItemInput` interfaces in `src/lib/firestoreModel.ts`.
- [ ] Update build helpers (`buildCreateNailItemData`, `buildUpdateNailItemData`).
- [ ] Check impact on data export logic (CSV/JSON) in `src/App.tsx`.
- [ ] Check impact on public share snapshots in `src/lib/publicShares.ts`.
- [ ] Verify backward compatibility for existing documents.
- [ ] Update Firestore Security Rules if necessary (requires Human Gate G4).
