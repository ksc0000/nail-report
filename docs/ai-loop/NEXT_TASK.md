```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that no substantive application-level tasks have been completed or are in progress yet, allowing us to pick a clear next step.

## Objective

Implement a loading skeleton for the nail item list to improve the user experience during data fetching.

## Allowed Scope

- `src/App.tsx` (for conditional rendering of the skeleton)
- `src/components/` (for a new skeleton component, e.g., `src/components/NailItemSkeleton.tsx`)
- `src/App.css` or `src/components/NailItemSkeleton.css` (for styling the skeleton)

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

You are tasked with enhancing the user experience of the `nail-report` application by adding a loading skeleton to the main nail item list. This skeleton should be displayed while the nail items are being fetched from Firestore.

1.  **Create a new component** for the loading skeleton. A good place would be `src/components/NailItemSkeleton.tsx`. This component should visually represent a placeholder for a single nail item (e.g., a grey box for the image, a few lines for text, etc.).
2.  **Add styling** for the new skeleton component. This can be done in a new CSS file like `src/components/NailItemSkeleton.css` or by integrating styles into `src/App.css`. Use basic CSS to create the placeholder appearance.
3.  **Integrate the skeleton into `src/App.tsx`**.
    *   Identify where the nail items are fetched and rendered.
    *   Introduce a loading state variable (if not already present) that is true when data fetching begins and false when data fetching completes (successfully or with an error).
    *   When the loading state is true, render multiple instances of your `NailItemSkeleton` component (e.g., 3-5 instances) instead of the actual nail item list.
    *   When the loading state is false and data is available, render the existing nail item list as usual.
4.  **Ensure responsive design** for the skeleton, matching the general layout of the actual nail items.

**Acceptance Criteria:**

*   A visual loading skeleton is displayed in the main list area when the application is fetching nail items.
*   The skeleton disappears and is replaced by the actual nail item list once data is loaded.
*   No new npm packages are added.
*   The code adheres to the specified diff limit.

**Required test commands:**

```bash
npm install
npm run build
npm run lint
```

```
```
