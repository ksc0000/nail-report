# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task addresses item 2.3 "Loading states" by implementing a skeleton loading UI for the main nail item list.

## Objective

Implement a skeleton loading state for the nail item list displayed in `src/App.tsx`. The skeleton should appear when the nail items are being fetched, providing a visual cue to the user that content is on its way, rather than a blank screen or a simple spinner.

## Allowed Scope

- `src/App.tsx` (for implementing the conditional rendering and skeleton component)
- `src/App.css` (for styling the skeleton elements)
- Any new component files within `src/components/` if a reusable skeleton component is desired (ensure it remains small and doesn't add new npm dependencies).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- When the application is loading the list of nail items, a placeholder skeleton UI should be displayed.
- The skeleton should visually represent the structure of a few nail items (e.g., rectangles for images, titles, and tags).
- Once the data is loaded, the actual nail item list should replace the skeleton.
- Keep the overall diff for this change under 150 lines.
- Run `npm run build && npm run lint` before finishing.
- No new npm dependencies should be added.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- When the app initially loads or data is refetched, a skeleton UI is visible where the nail item list would normally appear.
- The skeleton is replaced by the actual nail items once they are loaded from Firestore.
- The solution does not introduce any new npm packages.
- All code adheres to existing coding style and passes linting.

## Required Test Commands

```bash
npm install # Ensure dependencies are up-to-date
npm run build
npm run lint
npm run dev # Manually verify the skeleton loading in the browser
```
