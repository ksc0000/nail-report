```markdown
# Worker Prompt Template

## Context

The nail-report application needs to improve its user experience by providing visual feedback during data loading. The product roadmap specifies adding a skeleton loading state for the nail item list as part of Phase 2.3 (Loading states).

## Objective

Implement a loading skeleton component and integrate it into `src/App.tsx` to display while nail items are being fetched from Firebase.

## Allowed Scope

- `src/App.tsx`
- `src/components/` (for creating a new skeleton component, if necessary)
- `src/App.css` (for styling the skeleton component)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- When the application is in a loading state for `nailItems` (e.g., before the initial data fetch completes or during a refresh), display a skeleton loading UI.
- The skeleton should visually represent the structure of a typical nail item (e.g., placeholders for an image, title, and tags).
- Display a small number of skeleton items (e.g., 3-5) to indicate that a list is loading.
- Once the `nailItems` data is successfully loaded, the actual list of nail items should replace the skeleton.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
