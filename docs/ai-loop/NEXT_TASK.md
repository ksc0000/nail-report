# Worker Prompt Template

## Context

The application needs to improve its user experience by showing clear loading states. This task focuses on implementing a visual cue for users when the main list of nail items is being fetched from the database, aligning with Phase 2.3 (Loading states) of the product roadmap.

## Objective

Implement a skeleton loading component that displays while the nail item list is being fetched in `src/App.tsx`.

## Allowed Scope

- `src/App.tsx` (to integrate the skeleton loader)
- `src/components/` (if a new, dedicated skeleton component is created, e.g., `src/components/NailItemListSkeleton.tsx`)
- `src/App.css` (for styling the skeleton loader)

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
- The skeleton loader should be displayed when the application is in a loading state for the nail item list. Assume a boolean `isLoading` state variable or similar can be introduced or utilized within `App.tsx`'s scope to control visibility.
- The skeleton should visually represent a placeholder for a few (e.g., 3-5) individual nail items, including elements like a placeholder image, title, and tags.
- The skeleton loader should seamlessly disappear once the actual `nailItems` data is loaded and rendered.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task for Jules:** Add `aria-label` to all icon-only buttons.
