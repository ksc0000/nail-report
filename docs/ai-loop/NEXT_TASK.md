```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that improving loading states is a priority in Phase 2.3. Currently, the application does not provide visual feedback to users while the list of nail items is being fetched from Firebase.

## Objective

Implement a skeleton loading UI for the nail item list to enhance user experience during data fetching. This involves showing a placeholder UI while items are being loaded, and then revealing the actual list once data is available.

## Allowed Scope

- `src/App.tsx` (for conditional rendering logic and integration)
- `src/App.css` (for styling the skeleton elements)
- New small components in `src/components/` if necessary for the skeleton, but prefer direct implementation in `App.tsx` if simple.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a state variable (e.g., `isLoading`) to manage the loading state of the nail item list.
- While `isLoading` is true, display a simple skeleton UI (e.g., a few placeholder rectangles that mimic the structure of a nail item card) instead of the actual list.
- Once the nail items are fetched and `isLoading` becomes false, render the actual `NailItem` components.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
