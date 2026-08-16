# Worker Prompt Template

## Context

The application needs improved loading states for a better user experience, as outlined in Phase 2.3 of the product roadmap. The goal is to provide visual feedback to the user while data is being fetched, preventing perceived slowness.

## Objective

Implement a loading skeleton for the nail item list displayed on the main page (`src/App.tsx`). This skeleton should appear when the nail items are being loaded from Firestore.

## Allowed Scope

- `src/App.tsx`
- `src/App.css` (for new skeleton styles)
- `src/components/` (e.g., `src/components/NailItemSkeleton.tsx` if a new component is deemed appropriate)
- `src/hooks/` (if a custom hook helps manage loading state, though unlikely for this simple task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- When the `nailItems` data is being fetched (i.e., when the application is in a loading state for the list), display a skeleton UI instead of an empty list or a simple spinner.
- The loading skeleton should visually represent the layout of several individual `NailItem` components (e.g., placeholders for an image, title, and a few tags).
- Integrate the skeleton logic into `src/App.tsx` to conditionally render it based on the loading state.
- Ensure the UI remains responsive and visually consistent with the rest of the application.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
