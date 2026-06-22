# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is active, focusing on stability, test coverage, and UX improvements. This task specifically addresses the "2.3 Loading states" goal by implementing a visual loading indicator for the main nail item list.

## Objective

Implement a loading skeleton component for the nail item list in `src/App.tsx` to display while data is being fetched. This will improve the perceived performance and user experience during initial data loading or refreshes.

## Allowed Scope

- `src/App.tsx` (to integrate the skeleton and manage its visibility)
- `src/components/` (to create a new `NailItemSkeleton.tsx` component, if necessary)
- `src/App.css` (to add styling for the skeleton component)
- `src/styles/` (to create a new CSS module for the skeleton, if necessary)

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
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task).
- Report follow-up items as comments, not additional code.
- **Implement a placeholder loading skeleton:** The skeleton should visually represent the layout of a nail item (e.g., a grey rectangle for an image, a few lines for text) to indicate content is loading.
- **Integrate into `src/App.tsx`:** The skeleton should be conditionally rendered when nail items are being fetched, replacing or appearing before the actual list of nail items.
- **No new npm dependencies:** The implementation should use existing project dependencies and plain CSS.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
