# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement a loading skeleton for the nail item list in `src/App.tsx`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)
- `src/components/` (new component for the skeleton)

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

## Worker prompt

The application currently displays an empty list or a spinner while `nailItems` are being fetched from Firestore. To improve the user experience, implement a "skeleton loading" UI.

1.  **Identify Loading State**: In `src/App.tsx`, identify the state that indicates when `nailItems` are being loaded.
2.  **Create Skeleton Component**: Create a new React component, for example, `src/components/NailItemSkeleton.tsx`. This component should visually mimic the layout of a single `NailItem` card (e.g., using gray boxes for image, title, and tags). It does not need to be interactive or contain real data.
3.  **Conditional Rendering**: In `src/App.tsx`, when `nailItems` are in a loading state, render multiple instances (e.g., 3-5) of the `NailItemSkeleton` component instead of the actual `NailItem` list or any current loading indicator.
4.  **Styling**: Add basic CSS to `src/App.css` (or directly within `NailItemSkeleton.tsx` if using styled components or similar, though plain CSS in `App.css` is preferred for simplicity) to style the skeleton components, making them look like placeholders (e.g., `background-color: #eee; border-radius: 4px;`).
5.  **Display Actual List**: Once `nailItems` have finished loading and data is available, switch back to rendering the actual list of `NailItem` components.

**Acceptance Criteria:**

*   When the application initially loads or refreshes, a visual skeleton placeholder is displayed where the nail item list would normally appear.
*   The skeleton components should visually resemble the shape and size of the actual `NailItem` cards.
*   Once `nailItems` data is successfully fetched, the skeleton UI is replaced by the actual list of nail items.
*   The implementation should not add any new npm dependencies.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
