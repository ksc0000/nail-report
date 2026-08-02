# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task specifically addresses the "Loading states" objective by adding a visual indication while data is being fetched.

## Objective

Implement a skeleton loading UI that displays when the list of nail items is being fetched from Firestore.

## Allowed Scope

- `src/App.tsx`
- `src/App.css`
- `src/components/` (for new loading skeleton component, if created)
- `src/hooks/` (if data fetching logic needs adjustment for loading state)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- When the application is fetching `nailItems` (e.g., on initial load or after a refresh), display a skeleton loading UI in the area where the nail item list would normally appear.
- The skeleton should visually represent multiple nail item placeholders (e.g., a few grey rectangles for images/text areas).
- The loading skeleton should disappear, and the actual nail item list should render once the data is available.
- Integrate the loading state logic into `src/App.tsx` or an appropriate child component responsible for displaying the list.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
