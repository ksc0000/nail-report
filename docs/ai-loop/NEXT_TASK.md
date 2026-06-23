# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses the "Loading states" objective by enhancing the user experience during data fetching.

## Objective

Implement a loading skeleton UI for the nail item list to be displayed while data is being fetched.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (new component for the skeleton)
- `src/App.tsx` (to integrate the skeleton)
- `src/App.css` (for styling the skeleton)

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

---

## Worker prompt

Implement a loading skeleton for the nail item list in the `src/App.tsx` component.

1.  **Create a new component:** Create a new React component, e.g., `src/components/NailItemSkeletonList.tsx`, that renders a placeholder UI resembling the list of nail items (e.g., several grey rectangles or "card" shapes). This component should simulate the layout of a few nail items, but without actual data.
2.  **Integrate into `App.tsx`:** In `src/App.tsx`, modify the rendering logic for the nail item list. When the application is fetching `nailItems` (i.e., when a loading state is active, or `nailItems` is `null`/`undefined` and fetching is in progress), render the new `NailItemSkeletonList` component instead of the actual `NailItemList` or an empty state.
3.  **Styling:** Add minimal CSS to `src/App.css` to style the skeleton elements, ensuring they are visually distinct but not distracting. Use a subtle grey background and/or a pulse animation if feasible within the line limit.
4.  **Conditional Rendering:** Ensure the skeleton is only shown during the loading phase and is replaced by the actual `NailItemList` once data is available. If the list is empty after loading, the skeleton should not be shown.

**Acceptance Criteria:**

-   When the app is loading nail items, a skeleton UI is displayed in place of the list.
-   The skeleton UI visually represents multiple placeholder nail items.
-   Once nail items are loaded, the actual list is displayed.
-   If no nail items are found after loading, an "empty list" message is displayed, not the skeleton.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
