# Bundle Size Warning Acceptance

This note records the commercial MVP decision for the current Vite production bundle warning.

## Current State

`npm run build` succeeds, but Vite reports that the main JavaScript chunk is larger than 500 kB after minification.
At the time of this decision the app bundle is approximately 590 kB before gzip and approximately 181 kB after gzip.

## Decision

For the commercial MVP, this warning is accepted and does not block release.

The large chunk is primarily driven by the Firebase client SDK and the app's single-screen React structure. A previous broad code-splitting approach reduced the entry chunk, but required a large refactor of `src/App.tsx`, which is too risky for the MVP release window and exceeds the repository's small-PR guideline.

## Release Guardrails

- Keep `npm run build` and CI passing.
- Do not add new large runtime dependencies without human approval.
- Revisit route-level splitting after the MVP release, when there is time for focused regression testing.
- Treat any material increase in the gzip bundle size as a reason to re-open performance review.

## Follow-Up Candidate

Post-MVP, evaluate a smaller, testable split between public share routes and authenticated app routes, with manual QA for:

- Google Auth
- Nail item CRUD
- Image upload
- CSV / JSON export
- Public share create/view/revoke
- Mobile Safari
