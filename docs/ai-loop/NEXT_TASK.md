# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task specifically addresses the "2.3 Loading states" section of the roadmap, aiming to improve the user experience by providing visual feedback during data loading.

## Objective

Implement a skeleton loading state for the main list of nail items in `src/App.tsx`. When the application is fetching the `nailItems` (or while a `isLoading` state is true for the list), a visual placeholder (skeleton) should be displayed instead of an empty screen or the full list.

## Allowed Scope

- `src/App.tsx`
- `src/App.css` (for new skeleton styles)
- `src/components/` (if creating a dedicated skeleton component, but aim for a simple, inline solution within `App.tsx` or a small component in `src/components` to minimize diff)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The skeleton loader should appear when the `nailItems` list is in a loading state.
- The skeleton should visually hint at the structure of a single nail item entry (e.g., a placeholder for an image, a title, and tags).
- Display approximately 3-5 skeleton items to fill the initial view.
- Ensure the actual `nailItems` list replaces the skeleton once data is loaded.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (though this task primarily involves UI, so `src/lib/` changes are not expected).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
