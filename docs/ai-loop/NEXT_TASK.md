# Worker Prompt Template

## Context

The application currently displays a blank screen or an empty list while `nailItems` are being fetched from Firestore. Improving the user experience during loading times is a key focus of Phase 2.3 of the roadmap.

## Objective

Implement a loading skeleton UI for the nail item list in `src/App.tsx` that appears while data is being fetched.

## Allowed Scope

- `src/App.tsx`
- `src/App.css`
- New components within `src/components/` if necessary (e.g., `src/components/NailItemSkeleton.tsx`)
- `src/__tests__/` (new test files if component is created)

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

1.  **Identify Loading State**: Determine the appropriate state variable(s) in `src/App.tsx` that indicate when `nailItems` are being fetched (e.g., an `isLoading` flag, or when `nailItems` is empty and a fetch is in progress).
2.  **Create Skeleton UI**:
    *   Design a simple visual skeleton using HTML/CSS that mimics the approximate size and shape of a single `NailItem` component. You can create this directly within `src/App.tsx` or as a small, new component (e.g., `src/components/NailItemSkeleton.tsx`).
    *   Add the necessary CSS rules to `src/App.css` to style this skeleton (e.g., gray background, pulse animation if desired).
3.  **Conditional Rendering**: Modify the rendering logic in `src/App.tsx` to:
    *   Display multiple instances of the skeleton UI (e.g., 3-5 items) when the loading state is active.
    *   Replace the skeletons with the actual `NailItem` components once the `nailItems` data has successfully loaded.
4.  **Acceptance Criteria**:
    *   When the application first loads or refreshes, a placeholder skeleton UI is visible where the nail item list would normally appear.
    *   The skeleton UI disappears and is replaced by the actual nail item list once data fetching is complete.
    *   The visual style of the skeleton is consistent with the app's aesthetic (e.g., uses subtle gray tones).
    *   No new npm dependencies are added.
    *   The total line diff for the PR is less than or equal to 150 lines.

## Suggested next task

Add Vitest + unit tests for `src/lib/firestore.ts` helpers
