# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability, test coverage, and UX in Phase 2. This task focuses on enhancing the user experience by providing clear loading indicators.

## Objective

Implement a skeleton loading state for the nail item list within `src/App.tsx`. When `nailItems` are being fetched or loaded, display a placeholder skeleton instead of an empty list or a simple spinner.

## Allowed Scope

- `src/App.tsx` (for implementing the skeleton loading logic and UI)
- `src/App.css` (for styling the skeleton components)
- `src/components/` (if a new, small presentational component is needed for the skeleton itself)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The skeleton should appear when `nailItems` are in a loading state (e.g., when the fetch operation is in progress).
- The skeleton should simulate the structure of a few nail items (e.g., rectangles for image, title, and tags).
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement a skeleton loading component for the nail item list.

1.  **Identify Loading State**: Determine the appropriate state variable in `src/App.tsx` that indicates when `nailItems` are being fetched. If a clear loading state doesn't exist, create a simple `isLoading` boolean state.
2.  **Create Skeleton UI**:
    *   Add JSX within `src/App.tsx` to display a placeholder skeleton.
    *   Alternatively, create a new small presentational component (e.g., `src/components/NailItemSkeleton.tsx`) if the skeleton structure is complex enough to warrant it.
    *   The skeleton should mimic the layout of 2-3 `NailItem` components, showing placeholder shapes for images, titles, and tags.
3.  **Conditional Rendering**: Render the skeleton when the loading state is active, and render the actual `NailItem` list once `nailItems` are loaded.
4.  **Styling**: Add minimal CSS in `src/App.css` to style the skeleton elements (e.g., background color, pulsating animation if desired, rounded corners).

**Acceptance Criteria**:
- When the application is loading nail items (e.g., on initial load or data refetch), a visual skeleton replaces the `NailItem` list.
- The skeleton provides a clear visual cue that content is loading.

**Required Test Commands**:
```bash
npm install
npm run build
npm run lint
```
Manually verify by running `npm run dev` and observing the loading behavior.
