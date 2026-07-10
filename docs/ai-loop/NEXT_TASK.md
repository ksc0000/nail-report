# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task specifically addresses a key aspect of Accessibility (Phase 2.4).

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to enhance accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`) - Components, utility files.
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - Unlikely to be modified for this task, but generally allowed.
- `src/__tests__/` (new test files) - Not strictly required for this task, but if a component is heavily modified, adding a simple test for `aria-label` presence could be considered if it keeps the diff small.
- `src/App.css` (CSS improvements) - Unlikely to be modified for this task.

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
- Prefer adding tests when touching `src/lib/` files (not applicable here).
- Report follow-up items as comments, not additional code.
- Focus exclusively on adding `aria-label` attributes to buttons that primarily convey their purpose via an icon, ensuring the label accurately describes the button's action.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
