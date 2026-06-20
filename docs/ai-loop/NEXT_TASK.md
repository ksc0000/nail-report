# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key area is error handling to provide a better user experience when Firebase operations fail.

## Objective

Implement a user-friendly error banner component and integrate it to display errors encountered during Firebase Storage image uploads.

## Allowed Scope

- `src/components/` (e.g., `src/components/ErrorBanner.tsx`)
- `src/App.tsx` (for managing error state and rendering the banner)
- Any existing component files that handle Firebase Storage interactions (e.g., a form component responsible for image upload)
- `src/App.css` (for basic styling of the banner)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new React component `ErrorBanner.tsx` in `src/components/` that can display an error message.
- Implement state in `src/App.tsx` (or a suitable parent component) to hold the current error message.
- Modify an existing component responsible for image uploads (e.g., a form where images are selected and uploaded) to `try/catch` the Firebase Storage upload call.
- On catching an error from the Firebase Storage upload, set the error message state.
- Render the `ErrorBanner` component conditionally in `src/App.tsx` (or the parent component) when an error message is present.
- The banner should be dismissible (e.g., a close button or automatically hide after a few seconds).
- Ensure the application still builds and passes lint checks.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. For this task, `src/lib/` files should not be directly modified, but their error output should be handled at the call site.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task for the AI Loop:**

Add Vitest + unit tests for `src/lib/firestore.ts` helpers
