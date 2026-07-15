# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. This includes adding user-friendly error handling. Your current task is to implement the foundational `ErrorBanner` component.

## Objective

Create a reusable `ErrorBanner` component to display user-friendly error messages and integrate it into `App.tsx` to demonstrate its basic functionality with a static error message.

## Allowed Scope

-   `src/components/` (new file for `ErrorBanner.tsx`)
-   `src/App.tsx` (for integration and demonstration)
-   `src/App.css` (for basic styling of the banner)
-   Any other `src/` file *if strictly necessary* and within the diff limit, excluding `src/main.tsx`.

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
-   Prefer adding tests when touching `src/lib/` files (not applicable here, as no `src/lib/` files are touched).
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to implement a reusable `ErrorBanner` component and integrate it to display a static error message in the main application component.

1.  **Create `src/components/ErrorBanner.tsx`**:
    *   This component should accept a `message: string` prop to display the error text.
    *   It should also optionally accept an `onRetry: () => void` prop. If `onRetry` is provided, a "Retry" button should be rendered within the banner.
    *   Implement basic styling for the banner and its elements.
2.  **Add Styling to `src/App.css`**:
    *   Include minimal CSS in `src/App.css` to style the `ErrorBanner` component. Ensure it's visually distinct (e.g., red background, white text) and provides a clear alert to the user.
3.  **Integrate into `src/App.tsx` for Demonstration**:
    *   Modify `src/App.tsx` to include the `ErrorBanner` component.
    *   For this task, the banner should display a *static, hardcoded error message* (e.g., "An unexpected error occurred. Please try again later.") and optionally a "Retry" button. You can use a local `useState` hook (e.g., `showErrorBanner`, initialized to `true` or toggled by a simple button) to control its visibility for demonstration purposes. The goal is to verify the component renders correctly and styles are applied.
    *   **Do not** connect it to actual Firebase error handling logic in this task to keep the diff small and focused. That will be a follow-up task.

The focus is on creating the component, styling it, and proving its basic render functionality within `App.tsx`.
