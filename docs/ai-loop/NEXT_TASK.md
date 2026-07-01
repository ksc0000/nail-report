# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2 of the roadmap is active, focusing on stability, test coverage, and UX improvements. This task specifically addresses accessibility improvements under section 2.4.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add `aria-label` attributes to all existing icon-only buttons in the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files to add `aria-label` attributes to button elements)
- `src/App.tsx` (if icon buttons are present directly in the main app component)
- Any other `.tsx` or `.jsx` files containing button elements that are icon-only.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Identify all `button` elements that exclusively use an icon (e.g., `<button><Icon /></button>`) and do not have visible text.
- For each identified button, add a descriptive `aria-label` attribute. The `aria-label` should clearly state the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit tag"`).
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (N/A for this task, as it's a UI/UX accessibility improvement).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
