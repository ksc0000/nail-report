# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses an item under Phase 2.4: Accessibility.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/views/` (modifying existing view files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Identify all buttons that contain only an icon (i.e., no visible text label) and add an appropriate `aria-label` attribute.
- The `aria-label` should clearly describe the button's action (e.g., "Delete item", "Edit tag", "Share nail report").
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
