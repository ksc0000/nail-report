# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that the AI Loop is ready to tackle its first substantive product feature task. One key area for UX improvement is handling loading states to provide better perceived performance.

## Objective

Implement a skeleton loading UI for the nail item list in `src/App.tsx` to improve user experience during data fetching.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)
- `src/components/` (new or existing components)

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

Implement a loading skeleton for the nail item list within `src/App.tsx`.

1.  **Identify Loading State:** Determine the appropriate state in `src/App.tsx` that indicates the `nailItems` are currently being fetched (e.g., `nailItems` is `null` or an empty array initially before data arrives).
2.  **Implement Skeleton UI:** When the loading state is active, render a simple skeleton UI instead of the actual list of nail items.
    *   The skeleton should consist of a few placeholder elements (e.g., grey rectangles or simple blocks) that visually mimic the shape of individual nail items.
    *   This can be implemented directly within `App.tsx` using conditional rendering, or by creating a small, dedicated `NailItemSkeleton` component in `src/components/NailItemSkeleton.tsx` if it keeps `App.tsx` cleaner and remains within the diff limit.
    *   Add necessary CSS to `src/App.css` or a new dedicated CSS module for the skeleton styles (e.g., `src/components/NailItemSkeleton.module.css`).
3.  **Conditional Rendering:** Ensure that once `nailItems` data is successfully loaded, the skeleton UI is replaced by the actual rendered list of nail items.

**Acceptance Criteria:**
*   When the application first loads and `nailItems` are not yet available, a visually distinct skeleton loading UI is displayed in place of the nail item list.
*   Once `nailItems` are loaded, the skeleton disappears, and the actual list of nail items is rendered.
*   The skeleton should be a basic, non-interactive placeholder.
*   No new npm packages are added to `package.json`.
*   The overall diff remains within approximately 150 lines.

**Required Test Commands:**
`npm run build && npm run lint`
