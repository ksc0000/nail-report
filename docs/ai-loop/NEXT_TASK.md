# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that no tasks have been completed yet in this phase. The next task should contribute to Phase 2 objectives, specifically improving user experience related to error handling.

## Objective

Implement a user-friendly error banner component to display Firestore or Storage related failures. This component should be styled clearly and integrated into the application where data fetching or storage operations can fail.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/components/` (new or existing components)
-   `src/lib/` (modifications to integrate the error banner, e.g., error propagation)
-   `src/App.css` (CSS for the new error banner)
-   `src/__tests__/` (new test files, if applicable for the component)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new React component (e.g., `ErrorBanner.tsx` in `src/components/`) that can display an error message.
-   The error banner should be dismissible by the user.
-   Integrate the `ErrorBanner` component into `src/App.tsx` or a relevant parent component that handles data fetching (e.g., fetching `nailItems` or during image upload/deletion).
-   When a Firestore or Storage operation fails (e.g., `getDocs`, `addDoc`, `uploadBytes`, `deleteObject`), capture the error and display a user-friendly message in the banner.
-   The error messages should be generic and not expose sensitive technical details (e.g., "Failed to load nail items. Please try again later." instead of "FirebaseError: permission-denied").
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Acceptance Criteria

-   A new `ErrorBanner` component is created and styled appropriately.
-   The application displays a dismissible error banner when a Firestore read/write or Firebase Storage upload/delete operation fails.
-   The error message is user-friendly and generic.
-   No new npm dependencies are added.

## Required Test Commands

```bash
npm install
npm run build
npm run lint
```
