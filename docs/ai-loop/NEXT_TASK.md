# Worker Prompt Template

## Context

The application needs to improve its user experience during data loading. Currently, when the nail item list is fetching data, there is no visual indicator for the user. Implementing a loading skeleton will provide a better perceived performance.

## Objective

Implement a simple loading skeleton component that displays while the nail item list data is being fetched. This should replace the empty space or previous content with a placeholder animation during loading.

## Allowed Scope

- `src/App.tsx` (to integrate the skeleton and manage loading state)
- `src/App.css` (for skeleton styling)
- `src/components/` (if a new skeleton component is created)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The skeleton should be visually distinct from actual list items.
- It should display only when the nail item list is actively loading.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task)
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
