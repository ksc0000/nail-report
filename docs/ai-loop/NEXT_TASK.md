# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses a point in Phase 2.4, enhancing the application's accessibility.

## Objective

Identify all icon-only buttons throughout the application and add a descriptive `aria-label` attribute to each to improve accessibility for users of assistive technologies.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/App.css` (for minor style adjustments if absolutely necessary, but not the primary focus)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Locate all `<button>` or custom button-like elements that primarily display an icon (e.g., `<button><FontAwesomeIcon icon={faTrash} /></button>`) and do not have visible text content.
- For each identified button, add a meaningful `aria-label` attribute. The label should clearly and concisely describe the button's action (e.g., "Delete item", "Edit tag", "Share nail report").
- Ensure the `aria-label` accurately reflects the button's functionality in the given context.
- Keep the diff size for this change to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and include the results.
- Report any follow-up items or considerations as comments in the PR, rather than implementing additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
