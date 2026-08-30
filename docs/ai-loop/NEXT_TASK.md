# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task contributes to Phase 2.4, enhancing accessibility for the application. The goal is to make interactive elements more descriptive for assistive technologies without changing visual appearance or core functionality.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them. The `aria-label` should clearly describe the button's action.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/App.css` (minor adjustments if necessary for layout, but not expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Locate all buttons that contain only an icon and no visible text.
- Add an `aria-label="[descriptive text]"` attribute to these buttons.
- The `aria-label` content should be concise and accurately describe the button's purpose (e.g., "Delete item", "Edit tag", "Upload image").
- Do not add `aria-label` to buttons that already have visible text or an `aria-labelledby` attribute pointing to visible text.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (not applicable here as no `src/lib/` files are modified).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
