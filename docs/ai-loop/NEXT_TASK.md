# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This includes enhancing accessibility. The AI Loop needs to pick a small, bounded task that can be completed in a single PR, without adding new npm dependencies, and within the allowed scope for Jules.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only interactive buttons in the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - *No changes expected here for this task.*
- `src/__tests__/` (new test files) - *No new tests required for this task.*
- `src/App.css` (CSS improvements) - *No changes expected here for this task.*

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to identify all interactive elements that are visually represented solely by icons (e.g., delete buttons, edit buttons, upload buttons) and add a descriptive `aria-label` attribute to them. This directly addresses Phase 2.4 (Accessibility) of the roadmap.

**Acceptance Criteria:**

1.  Locate all `<button>` or similar interactive elements that display only an icon and lack visible text.
2.  Add an `aria-label` attribute to each identified element.
3.  The `aria-label` content must be concise and clearly describe the button's action or purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit nail report"`, `aria-label="Upload image"`).
4.  Ensure no existing visual appearance or functionality of the buttons is altered.
5.  Verify that the changes are confined to the allowed scope and do not introduce any new npm dependencies.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
