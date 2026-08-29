# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX. This task addresses Phase 2.3: Loading states, by implementing a loading skeleton for the main nail item list. This will improve the user experience by providing visual feedback while data is being fetched.

## Objective

Implement a skeleton loading UI for the nail item list, visible while the nail items are being fetched from Firestore.

## Allowed Scope

- `src/App.tsx` (to integrate the loading skeleton)
- `src/App.css` (to add styles for the loading skeleton)
- `src/components/` (to create a new `LoadingSkeleton.tsx` component if preferred)

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

## Worker prompt

1.  **Create a Skeleton Component (Optional but Recommended):**
    *   Create a new file `src/components/LoadingSkeleton.tsx` (or similar) to encapsulate the skeleton UI.
    *   This component should render a simplified, static representation of a few nail item cards, indicating where content will eventually load. For example, a few grey boxes resembling card shapes.

2.  **Add Styles for the Skeleton:**
    *   Add necessary CSS styles to `src/App.css` (or a dedicated CSS module if you create one for the skeleton component) to visually represent the loading skeleton. This might include background colors, animations for a "shimmer" effect, and dimensions matching typical nail item cards.

3.  **Integrate into `src/App.tsx`:**
    *   In `src/App.tsx`, identify the state that indicates whether the nail items are currently being loaded.
    *   Conditionally render the `LoadingSkeleton` component when the data is loading, and render the actual nail item list once the data has loaded.
    *   Ensure the skeleton provides a good visual placeholder that aligns with the existing list layout.

## Acceptance Criteria

- When the application is loading nail items (e.g., on initial load or refresh), a visible skeleton UI is displayed in place of the nail item list.
- The skeleton UI roughly mimics the structure of the nail item cards.
- Once nail items are loaded, the skeleton disappears, and the actual nail item list is rendered.
- No new npm packages are added to `package.json`.

## Required Test Commands

```bash
npm run build
npm run lint
```
