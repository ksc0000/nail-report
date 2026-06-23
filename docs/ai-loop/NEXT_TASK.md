# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.3 targets "Loading states" by adding skeleton loading for the nail item list.

The current state indicates that no substantive tasks have been completed from Phase 2 yet. This task aims to address one of the explicit "Jules-ready Tasks" to add a loading skeleton.

## Objective

Implement a basic loading skeleton UI for the nail item list in `src/App.tsx` that displays while the data is being fetched.

## Allowed Scope

-   `src/App.tsx`
-   `src/components/` (if a new component is deemed necessary for the skeleton, but prefer in-place changes in `App.tsx` for simplicity and small diff)
-   `src/App.css`
-   `src/assets/` (if simple SVG or image placeholders are used, but prefer CSS-only skeletons)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/lib/` files (not relevant for this UI task)
-   `src/__tests__/` (not required for this UI task, though future tests could cover loading states)

## Requirements

-   Keep diff ≤ 150 lines.
-   When the nail items are loading (e.g., an `isLoading` state is true and the `nailItems` array is empty), display a simple skeleton UI.
-   The skeleton should mimic the general shape of a few nail item entries (e.g., rectangular blocks).
-   The skeleton should disappear once the `nailItems` data is loaded and rendered.
-   Ensure the solution uses CSS-only placeholders for the skeleton to avoid adding image assets.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
