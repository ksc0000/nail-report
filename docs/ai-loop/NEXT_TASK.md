```markdown
# Worker Prompt Template

## Context

The `nail-report` application needs to improve its user experience, particularly around loading states. Currently, the nail item list might appear blank while data is being fetched from Firebase. Implementing a skeleton loading UI will provide a better visual cue to the user that content is on its way.

## Objective

Implement a skeleton loading UI for the nail item list in `src/App.tsx` that displays while the nail items are being fetched from Firestore.

## Allowed Scope

-   `src/App.tsx` (for conditional rendering of the skeleton)
-   `src/components/` (if a new skeleton component is created)
-   `src/App.css` or new CSS module/file within `src/` (for styling the skeleton)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker prompt

### Task: Implement Skeleton Loading for Nail Item List

**Description:**
Enhance the user experience by adding a skeleton loading animation or placeholder when the nail item list is being fetched from Firestore. This will prevent a blank screen and provide a visual indication of activity.

**Steps:**

1.  **Identify Loading State:** Locate where the nail items are fetched in `src/App.tsx` (or related components) and identify the state variable that indicates whether data is currently loading. A common pattern is `isLoading` or `loadingNailItems`.
2.  **Create Skeleton UI:**
    *   Design a simple, visually appealing skeleton placeholder. This can be a series of gray boxes or lines that mimic the structure of a single nail item entry.
    *   Consider creating a dedicated, simple React component for this skeleton (e.g., `src/components/NailItemSkeleton.tsx`) if it simplifies `App.tsx`.
3.  **Conditional Rendering:** In `src/App.tsx`, modify the rendering logic for the nail item list. When the loading state is true, render multiple instances of the skeleton UI. When the data is loaded, render the actual `NailItem` components.
4.  **Styling:** Add necessary CSS to `src/App.css` (or a new CSS file if you create a component) to style the skeleton. Use basic CSS properties like `background-color`, `border-radius`, `height`, and perhaps a subtle animation (e.g., a pulse effect) if appropriate and simple to implement.

**Acceptance Criteria:**

*   When the application is in the process of fetching nail items (e.g., on initial load or after a data refresh), a skeleton loading UI is displayed in place of the actual list.
*   The skeleton UI should visually resemble the general layout of one or more `NailItem` components, but without actual data.
*   Once the nail items are successfully loaded from Firestore, the actual list of `NailItem` components replaces the skeleton UI.
*   No new npm dependencies are added to `package.json`.
*   The overall solution is clean, maintainable, and adheres to the line limit.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
