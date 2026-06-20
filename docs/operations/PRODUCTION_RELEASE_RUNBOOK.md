# Production Release Runbook

This runbook is for the commercial MVP release of Nailous on Firebase Hosting.
Do not run production deploy commands without explicit human approval.

## Approved Release Direction

- Hosting: Firebase Hosting
- Firebase projects: separate development and production projects
- Deploy owner: human operator
- CI deploy automation: deferred for MVP
- MVP scope: personal nail archive with Auth, CRUD, image upload, export, public sharing, and policy links
- Post-launch: AI, OCR, 3D, AR, PWA install support, automated account deletion UI, and full analytics

## Pre-Release Checks

1. Confirm the target Firebase project is the production project.
2. Confirm local `.env` or hosting environment values point to production Firebase config.
3. Confirm no secrets, service account JSON, or `.env` files are staged.
4. Run:

```bash
npm run build
npm run lint
```

5. Confirm GitHub CI is passing on the release commit.
6. Review open blocking issues for security, legal, privacy, and QA.
7. Confirm the production smoke checklist is ready:
   [PRODUCTION_SMOKE_TEST_CHECKLIST.md](./PRODUCTION_SMOKE_TEST_CHECKLIST.md)
8. Confirm the production Firebase preflight checklist is complete:
   [PRODUCTION_FIREBASE_PREFLIGHT.md](./PRODUCTION_FIREBASE_PREFLIGHT.md)

## Deploy Procedure

Production deploy is a human-gated operation.

```bash
firebase use <production-project-alias>
firebase projects:list
firebase deploy --only hosting
```

Before running `firebase deploy`, the operator must verbally or in writing confirm:

- the production Firebase project id
- the release commit SHA
- the production URL
- rollback owner and communication channel

## Post-Deploy Smoke Test

Run the production smoke checklist immediately after deploy:

- Auth
- Nail CRUD
- Image upload
- CSV/JSON export
- Public share create/view/revoke
- Mobile Safari
- Privacy/Terms links
- Error fallback where practical

Record go/no-go in the release notes or tracking issue.

## Rollback

If a blocking production issue is found:

1. Stop further deploys.
2. Identify the last known good Hosting version in Firebase Console.
3. Roll back Hosting to the last known good version from Firebase Console, or redeploy the previous known-good commit.
4. Re-run the smoke checklist.
5. Open a blocking bug with impact, reproduction steps, and rollback status.

## Emergency Stop

If public sharing or data exposure is suspected:

1. Disable or roll back the affected Hosting version.
2. Revoke affected public shares if possible.
3. Preserve logs and issue context.
4. Do not change Firestore or Storage rules without a separate human approval.
5. Record user-facing communication needs for human/legal review.
