```markdown
# Worker Prompt Template

## Context

The product roadmap indicates "Phase 2 - Active" is focused on improving stability, test coverage, and UX. Specifically, Phase 2.3 targets "Loading states" including "Skeleton loading for the nail item list". This task addresses that objective.

## Objective

Implement a skeleton loading UI for the nail item list. When the application is fetching the `nailItems` (e.g., on initial load), a skeleton loader should be displayed instead of an empty list or a simple spinner.

## Allowed Scope

- `src/App.tsx` (for integrating the skeleton loader)
- `src/components/` (to create a new component for the skeleton loader, e.g., `src/components/NailItemSkeleton.tsx`)
- `src/App.css` (for styling the skeleton loader)
- `src/types/` (if new types are strictly necessary for the skeleton component)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new React component (e.g., `NailItemSkeleton.tsx`) that visually represents a placeholder for a single nail item (e.g., a grey box for an image, lines for text).
- In `src/App.tsx`, detect when `nailItems` are being loaded (you might need to introduce or leverage an existing loading state variable).
- When `nailItems` are loading, render multiple instances of the `NailItemSkeleton` component (e.g., 3-5 of them) instead of the actual `NailItem` components.
- Ensure the skeleton loader provides a smooth visual experience and matches the general layout of actual nail items.
- Keep the total line diff of the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build errors.
- Report any follow-up items as comments (e.g., if the loading state logic needs refactoring or if other lists could benefit from similar skeletons).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
