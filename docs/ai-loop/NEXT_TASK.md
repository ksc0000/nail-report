# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement a loading skeleton for the nail item list to improve user experience during data fetching.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

Implement a loading skeleton component that displays while the list of nail items is being fetched.

1.  **Create a new component** (e.g., `src/components/NailItemSkeleton.tsx`) that represents a placeholder for a single nail item. This should visually mimic the structure of a nail item (e.g., a grey box for the image, a few lines for text).
2.  **Integrate the skeleton** into `src/App.tsx`.
    *   Introduce a loading state variable (e.g., `isLoadingNailItems`).
    *   Conditionally render multiple instances of the `NailItemSkeleton` component when `isLoadingNailItems` is `true`. A reasonable number would be 3-5 skeletons to fill the initial view.
    *   Once the nail items are successfully fetched, set `isLoadingNailItems` to `false` and render the actual `NailItemList`.
3.  **Add necessary CSS** to `src/App.css` (or a new component-specific CSS file if preferred and minor) to style the skeleton components, making them visually distinct and animating them if desired (e.g., subtle pulse effect).

### Acceptance Criteria

-   When the application first loads or when nail items are being fetched (before the data is retrieved from Firestore), a visual loading skeleton should be displayed in place of the nail item list.
-   The skeleton should disappear and be replaced by the actual nail item list once the data has loaded.
-   The skeleton should consist of placeholder elements (e.g., for image, title, tags) that visually resemble the structure of actual nail items.
-   No new npm dependencies are added to `package.json`.

### Required Test Commands

```bash
npm run build && npm run lint
```
