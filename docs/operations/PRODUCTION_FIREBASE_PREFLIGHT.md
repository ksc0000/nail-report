# Production Firebase Preflight Checklist

This checklist must be completed and approved by a human operator before any production deployment.

**DO NOT PROCEED with production deploy without explicit human approval.**

## 1. Project Setup
- [ ] Confirm the current Firebase project is the **Production** project (e.g., `nailous-prod`).
- [ ] Confirm the production Firebase project name and Hosting site use the `nailous` brand.
- [ ] Verify that no development or staging data exists in the production Firestore/Storage.
- [ ] Ensure the billing account is active and limits are set if necessary.

## 2. Hosting Target
- [ ] Confirm `firebase.json` has the correct `public` directory (usually `dist`).
- [ ] Verify that security headers (CSP, HSTS, etc.) are configured for production.
- [ ] Check that `rewrites` for Single Page Application (SPA) routing are present.

## 3. Web App Config
- [ ] Confirm the production Web App is created in the Firebase Console.
- [ ] Verify that the local `.env` or build environment uses production API keys and IDs:
    - `VITE_FIREBASE_API_KEY`
    - `VITE_FIREBASE_AUTH_DOMAIN`
    - `VITE_FIREBASE_PROJECT_ID`
    - `VITE_FIREBASE_STORAGE_BUCKET`
    - `VITE_FIREBASE_MESSAGING_SENDER_ID`
    - `VITE_FIREBASE_APP_ID`
- [ ] Confirm whether AI tag suggestion is enabled for this release:
    - `VITE_ENABLE_AI_TAG_SUGGESTION=false` or unset for the default commercial MVP path.
    - `VITE_ENABLE_AI_TAG_SUGGESTION=true` only after the AI production gate is approved.
- [ ] If AI tag suggestion is enabled, confirm Firebase AI / Gemini backend, billing, privacy policy coverage, and rollback plan.

## 4. Auth Providers
- [ ] Confirm Google Auth is enabled in the production Firebase Console.
- [ ] Verify that `nailous-prod.web.app`, `nailous-prod.firebaseapp.com`, and the custom domain if used are added to the "Authorized domains" list in Firebase Auth settings.

## 5. Firestore & Storage Rules
- [ ] Review `firestore.rules` for production readiness (no open access, user-specific locks).
- [ ] Review `storage.rules` for production readiness (size limits, type checks).
- [ ] Confirm that rules are deployed to the production project:
    ```bash
    firebase deploy --only firestore:rules,storage:rules
    ```

## 6. Custom Domain (Optional)
- [ ] Decide the launch domain. Recommended order: `nailous.app`, `nailous.jp`, then a practical fallback such as `nailous-nail.app` if the shorter domains are unavailable.
- [ ] If using a custom domain, confirm DNS records are propagated.
- [ ] Verify SSL certificate status in the Firebase Hosting console.

## 7. Rollback Readiness
- [ ] Identify the "last known good" version in the Hosting history.
- [ ] Confirm the operator has access to the Firebase Console to perform a one-click rollback if needed.
- [ ] Verify that the previous build artifact/commit is available for redeploy.

## 8. Final Human Approval
- [ ] Production Build (`npm run build`) passes.
- [ ] Linting (`npm run lint`) passes.
- [ ] Pre-release smoke tests pass in a staging environment.
- [ ] **Human Approver Name:** ____________________
- [ ] **Date:** ____________________

---
*Refer to [PRODUCTION_RELEASE_RUNBOOK.md](./PRODUCTION_RELEASE_RUNBOOK.md) for the full deploy procedure.*
