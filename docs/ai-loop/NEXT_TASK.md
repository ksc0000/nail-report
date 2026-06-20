```markdown
# Worker Prompt Template

## Context

The application needs to improve its user experience by providing clear visual feedback during data loading states. Currently, when the nail item list is being fetched from Firestore, there's no visual indication to the user that content is loading.

## Objective

Implement a basic loading skeleton for the main nail item list that displays while the data is being fetched.

## Allowed Scope

- `src/App.tsx`
- `src/App.css`
- `src/components/` (for a new skeleton component if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new, simple React functional component (e.g., `src/components/NailItemSkeleton.tsx`) to represent a single loading placeholder item, or inline the skeleton JSX directly within `App.tsx` if it's very minimal.
- The skeleton should visually mimic the general layout of a single nail item (e.g., a placeholder image, title, and some text lines).
- Modify `src/App.tsx` to conditionally render multiple instances of this skeleton component when the `nailItems` data is being loaded.
- Ensure the loading state (e.g., a boolean `isLoading` variable) is correctly utilized to toggle between the skeleton and the actual list.
- Keep the overall diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report any follow-up items as comments.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
