```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.3 addresses "Loading states." This task focuses on implementing a visual indicator for data loading to improve user experience.

## Objective

Implement a skeleton loading UI for the nail item list displayed in `src/App.tsx`. This skeleton should appear when the application is fetching `nailItems` from Firestore.

## Allowed Scope

- `src/App.tsx` (to conditionally render the skeleton)
- `src/App.css` (to add styles for the skeleton)
- `src/components/` (to create a new `LoadingSkeleton` component if deemed necessary for reusability, but keep it simple)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

-   The loading skeleton should be displayed in `src/App.tsx` when the `nailItems` array is empty and data is still being fetched (i.e., before the actual items are rendered).
-   The skeleton should visually resemble the layout of a few (e.g., 3-5) `NailItemCard` components, providing a smooth transition once the actual data loads.
-   Utilize existing CSS classes where appropriate, and add new, well-scoped CSS rules to `src/App.css` for the skeleton's appearance.
-   Do not introduce any new npm dependencies.
-   Keep the diff size for this task below 150 lines.
-   Ensure the application builds and passes lint checks: `npm run build && npm run lint`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
