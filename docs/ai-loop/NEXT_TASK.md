# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This includes enhancing accessibility. The current state shows no specific accessibility tasks are in progress.

## Objective

Implement accessibility improvements by identifying all icon-only buttons within the application and adding appropriate `aria-label` attributes to each of them.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing components to add attributes)
- `src/pages/` (modifying page-level components to add attributes)
- `src/App.tsx` (if icon buttons are directly in the main app component)

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
- Ensure `aria-label` values are descriptive and helpful for screen reader users (e.g., "Delete item", "Edit profile", "Share link").
- Focus only on buttons that contain *only* an icon and no visible text.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
