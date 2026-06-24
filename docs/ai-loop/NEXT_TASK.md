# Worker Prompt Template

## Context

The current application lacks visual feedback during data fetching. When the list of nail items is loading, the user sees an empty screen until the data arrives. Improving loading states is a key part of Phase 2 of the roadmap.

## Objective

Implement a loading skeleton UI for the nail item list to provide a better user experience while data is being fetched from Firebase. The skeleton should be displayed in `src/App.tsx` when `nailItems` are being loaded.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (for a new skeleton component)
- `src/App.tsx` (for integration logic)
- `src/App.css` (for styling the skeleton)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new React component (e.g., `src/components/NailItemSkeleton.tsx`) that renders a placeholder for a single nail item. This component should visually resemble the layout of an actual `NailItem` component but with "shimmer" effects or simple grey blocks.
- Modify `src/App.tsx` to conditionally render several instances of the `NailItemSkeleton` component when the application is in a loading state for the nail item list (e.g., `nailItems` is empty and a `isLoading` flag is true).
- The loading state should be managed appropriately within `App.tsx` to toggle between the skeleton and the actual list.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
