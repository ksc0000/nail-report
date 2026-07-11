# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which involves improving stability, test coverage, and UX. This task specifically addresses accessibility improvements by adding ARIA attributes to interactive elements, aligning with Phase 2.4 (Accessibility).

## Objective

Identify all icon-only buttons within the application and add an appropriate `aria-label` attribute to each to enhance accessibility for screen reader users.

## Allowed Scope

- `src/components/` (modify existing component files to add `aria-label` to buttons)
- `src/App.tsx` (if any icon-only buttons are directly rendered here)
- Any other `src/` file that renders icon-only buttons (except `src/main.tsx`)
- `src/App.css` (only if minor styling adjustments are absolutely necessary, but not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/` files (unless an icon-only button is surprisingly found there, which is not expected)
- Adding new files (this task is focused on modifying existing files)

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only button, choose an `aria-label` that clearly describes its action (e.g., "Delete item", "Edit profile", "Share link", "Close dialog").
- Ensure all interactive icon-only elements that function as buttons have an `aria-label`.
- Run `npm run build && npm run lint` before finishing.
- No new npm dependencies.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
