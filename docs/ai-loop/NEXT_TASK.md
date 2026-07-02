# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses an accessibility improvement from Phase 2.4.

## Objective

Identify all icon-only buttons within the application and add an appropriate `aria-label` attribute to each for improved accessibility.

## Allowed Scope

- `src/` (specifically component files containing icon-only buttons)
- `src/App.css` (if minor styling adjustments are needed, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each `button` element that only contains an icon (and no visible text label), add an `aria-label` attribute with a descriptive text value corresponding to the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit item"`).
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (not applicable for this task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
