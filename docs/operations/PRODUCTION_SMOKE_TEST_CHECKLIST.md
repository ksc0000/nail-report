# Production Smoke Test Checklist

Use this checklist before and after a production Firebase Hosting release.
Record the tested URL, Firebase project, tester, date, and result in the PR or release notes.

## Release Context

- Production host: Firebase Hosting
- Production Firebase project: separate from development
- Deploy owner: human operator
- Deploy approval: explicit human approval required

## Checklist

| Area | Steps | Expected result |
|---|---|---|
| App load | Open the production URL on desktop Chrome or Safari. | The app loads without a blank screen or console-blocking error. |
| Google Auth | Sign in with Google, then sign out. | Sign-in and sign-out complete, and the signed-out screen returns. |
| Nail CRUD | Create, edit, and delete one test nail item. | The item persists after refresh, updates correctly, and deletes after confirmation. |
| Image upload | Add a jpeg, png, or webp image under 5 MB. | The image uploads, previews, displays in the card, and is removed when the item is deleted. |
| Search/filter | Search by title and filter by tag/month if test data exists. | Matching items remain visible and clearing filters restores the list. |
| Export | Download CSV and JSON from the collection. | Files download and contain expected item fields without private app metadata. |
| Public share create | Create a public share for selected items. | A share URL is generated and can be copied. |
| Public share view | Open the share URL in an incognito/private window. | The public read-only page loads without requiring sign-in. |
| Public share revoke | Disable the share and reload the public URL. | The public page no longer exposes the shared collection. |
| Mobile Safari | Repeat app load, auth, list view, and public share view on Mobile Safari. | Layout remains usable and no content overlaps. |
| Privacy/Terms | Open Privacy Policy and Terms links once implemented. | Links are visible, routes load, and text matches the approved policy draft. |
| Error fallback | Temporarily test with a failed network or invalid share URL if practical. | User-facing error states are understandable and do not expose sensitive details. |

## Go / No-Go

- Go: all critical flows pass, or only documented non-blocking issues remain.
- No-go: auth, CRUD, upload, public share, or rollback readiness fails.
