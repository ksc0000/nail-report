# Worker Prompt Template

## Context

The current roadmap prioritizes improving stability, test coverage, and UX in Phase 2. This task focuses on enhancing the user experience by adding visual feedback during data loading. The previous tasks were setup-related.

## Objective

Implement a skeleton loading UI for the nail item list displayed in the main application view (`src/App.tsx`) when data is being fetched from Firestore.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files, if applicable for new components)
- `src/App.css` (CSS improvements for the skeleton)
- `src/components/` (new components for the skeleton)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Identify Loading State:** In `src/App.tsx` (or a component it renders that displays the nail item list), identify the state variable that indicates if `nailItems` data is currently being fetched from Firestore. If such a state doesn't explicitly exist, create one (e.g., `isLoadingItems`).
2.  **Create Skeleton Component:** Create a new React component, for example, `src/components/NailItemSkeleton.tsx`. This component should render a simplified, visually abstract placeholder resembling a single nail item (e.g., gray boxes for image, title, and tags).
3.  **Implement Conditional Rendering:** Modify `src/App.tsx` (or the relevant list component) to conditionally render:
    *   Multiple instances of the `NailItemSkeleton` component (e.g., 3-5 times) when `isLoadingItems` is `true`.
    *   The actual `NailItemList` component (or the map of `nailItems`) when `isLoadingItems` is `false` and data is available.
4.  **Style the Skeleton:** Add necessary CSS to `src/App.css` to style the `NailItemSkeleton` component. This should include basic styling for the placeholder elements (e.g., background color, rounded corners, animation if desired, but keep it simple to stay within the diff limit).
5.  **Ensure No New Dependencies:** Verify that no new npm packages have been added to `package.json`.

**Acceptance Criteria:**

*   When the application is fetching `nailItems` from Firestore, a visual skeleton loading state is displayed where the list of nail items normally appears.
*   The skeleton UI should provide a visual representation of content loading without displaying actual data.
*   Once `nailItems` are successfully loaded, the skeleton disappears, and the actual list of nail items is rendered.
*   The implementation does not introduce any new npm dependencies.
*   The total diff for the change is less than or equal to 150 lines.

**Required Test Commands:**

```bash
npm install
npm run build
npm run lint
```
