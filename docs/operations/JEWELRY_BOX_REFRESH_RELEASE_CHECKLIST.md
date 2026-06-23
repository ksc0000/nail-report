# Jewelry Box Refresh Release Checklist

> Status: Phase 5 release checklist
> Updated: 2026-06-24

Use this checklist before marking a Jewelry Box Refresh PR or release candidate ready.
It is a release readiness checklist only; production deploy still requires explicit human approval.

## Release Context

- App: Nailous React/Firebase MVP moving incrementally toward the Jewelry Box concept.
- Scope: Jewelry Box UI/product refresh while preserving current Auth, CRUD, image upload, export, and public sharing behavior.
- Related docs:
  - [Production Release Runbook](./PRODUCTION_RELEASE_RUNBOOK.md)
  - [Production Smoke Test Checklist](./PRODUCTION_SMOKE_TEST_CHECKLIST.md)
  - [Commercial Launch QA Report](./COMMERCIAL_LAUNCH_QA_REPORT.md)
  - [Product Spec](../product/PRODUCT_SPEC.md)

## 1. Change Scope

- [ ] The release candidate is limited to the approved Jewelry Box Refresh issue scope.
- [ ] No Firebase deploy command was run by an AI agent.
- [ ] No `.env`, service account JSON, API key, or secret file is changed or staged.
- [ ] No `firestore.rules`, `storage.rules`, `src/main.tsx`, or `commands/` changes are included unless separately human-approved.
- [ ] No new package dependency is included without human approval.
- [ ] Public routes remain in scope for regression checks: `/`, `/share/:id`, `/privacy`, and `/terms`.

## 2. Build, Lint, and Test

- [ ] `npm install` has completed successfully when dependencies are not already installed.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Any available automated tests for the touched area pass.
- [ ] If no automated test exists for the touched area, manual QA coverage is recorded in the PR or QA report.
- [ ] GitHub CI is passing on the release commit.
- [ ] The PR diff was reviewed for unintended code, dependency, config, rules, or generated-file changes.

## 3. Jewelry Box Functional QA

- [ ] Signed-out Jewelry Box landing loads without a blank screen.
- [ ] Google sign-in and sign-out work.
- [ ] Signed-in Jewelry Box home/studio surface loads with saved item count.
- [ ] Create, edit, delete, and refresh persistence work for a nail item.
- [ ] Image upload with jpeg/png/webp under 5 MB works.
- [ ] Existing image preview, remove, replace, and delete cleanup behavior is still usable.
- [ ] Search, filters, sorting, and collection summary still reflect saved items correctly.
- [ ] Nail image detail viewer opens and closes without trapping the user.
- [ ] Comparison view works for two selected items and can be cleared.
- [ ] CSV and JSON export download expected item data.
- [ ] Public share create, copy/view in private window, and revoke flows work.
- [ ] Privacy and Terms links/routes load and remain public.

## 4. Mobile Visual QA

Record device/browser and evidence in the PR or [Commercial Launch QA Report](./COMMERCIAL_LAUNCH_QA_REPORT.md).

- [ ] Mobile Safari at approximately 390px width has no horizontal overflow.
- [ ] Compact mobile width around 320px remains usable for primary flows.
- [ ] Jewelry Box landing hero, signed-in hero, cards, forms, and action rows do not overlap.
- [ ] Tap targets for primary actions are comfortable and not hidden by safe-area or fixed controls.
- [ ] Image upload/camera picker can be opened on Mobile Safari.
- [ ] Detail viewer and comparison surfaces fit mobile viewports and can be dismissed.
- [ ] Public share page is readable on Mobile Safari without requiring sign-in.
- [ ] Privacy/Terms pages remain readable on mobile.
- [ ] Desktop Chrome or Safari remains visually stable after mobile-specific changes.

## 5. Release Notes and Evidence

- [ ] Release candidate commit SHA is recorded.
- [ ] Tested URL is recorded, using an approved preview URL or production URL.
- [ ] Tester and test date are recorded.
- [ ] Screenshots or notes cover both desktop and mobile visual QA.
- [ ] Known non-blocking issues are listed with follow-up issue links.
- [ ] Any blocking issue has reproduction steps, expected behavior, and owner.
- [ ] Rollback readiness is confirmed against the [Production Release Runbook](./PRODUCTION_RELEASE_RUNBOOK.md).

## 6. Go / No-Go

### Go

- [ ] Build, lint, CI, and applicable tests pass.
- [ ] Auth, CRUD, image upload, export, public share, and legal routes pass smoke QA.
- [ ] Mobile visual QA has no blocking layout or interaction issue.
- [ ] No unapproved deploy, Firebase rules, dependency, secret, or service-account change is present.
- [ ] Rollback path and release owner are clear.

### No-Go

- [ ] Auth, CRUD, image upload, export, public share, or legal routes fail.
- [ ] Mobile users cannot complete primary Jewelry Box flows.
- [ ] A secret, env file, service account, Firebase rules change, or dependency change is present without approval.
- [ ] Production deploy approval, release owner, or rollback path is unclear.
- [ ] Any issue is judged blocking by the human release owner.

## Final Decision

- Decision: `[GO / NO-GO]`
- Release owner:
- Tested URL:
- Commit SHA:
- Blocking issues:
- Non-blocking follow-ups:
- Notes:
