# Worker Prompt Template

## Context

The AI Loop is progressing through Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The current task aims to enhance error handling user experience.

## Objective

Implement a reusable `ErrorBanner` React component and integrate it into `src/App.tsx` to display user-friendly messages when an error occurs during the initial fetching of nail items from Firestore.

## Allowed Scope

- `src/components/ErrorBanner.tsx` (new file)
- `src/App.tsx` (modify to manage and display error state)
- `src/App.css` (add basic styling for the banner component)
- Other `src/` files for minor adjustments necessary for error propagation (e.g., if a fetch utility needs to throw or return an error for `App.tsx` to catch).
- Any existing test files in `src/__tests__/` if modifications are needed (though not expected for this task).

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

## Worker Prompt

1.  **Create `src/components/ErrorBanner.tsx`**:
    *   Implement a new functional React component named `ErrorBanner`.
    *   This component should accept `message: string` and `onDismiss: () => void` as props.
    *   It should display the `message` prominently.
    *   Include a dismiss button (e.g., an "X" icon or text button) that calls `onDismiss` when clicked.

2.  **Integrate into `src/App.tsx`**:
    *   Add state to `src/App.tsx` to manage a potential error message (e.g., `const [fetchError, setFetchError] = useState<string | null>(null);`).
    *   Locate the initial data fetching logic for nail items in `App.tsx`.
    *   Modify this logic to catch any errors that occur during the fetch.
    *   If an error occurs, set the `fetchError` state with a user-friendly message (e.g., "Failed to load nail items. Please check your internet connection or try again later.").
    *   Conditionally render the `ErrorBanner` component at an appropriate place in `App.tsx` when `fetchError` is not null.
    *   Pass the `fetchError` message to the `ErrorBanner`'s `message` prop.
    *   Pass a function to the `onDismiss` prop that clears the `fetchError` state (e.g., `() => setFetchError(null)`).

3.  **Add Styling to `src/App.css`**:
    *   Add minimal, basic CSS rules to `src/App.css` to style the `ErrorBanner` component.
    *   The banner should be visually distinct (e.g., red background, white text, padding) and clearly visible at the top or a prominent position in the layout.
    *   Ensure the dismiss button is clickable and visually clear.

4.  **Error Handling**:
    *   Focus on handling errors during the *initial fetch* of nail items specifically within `src/App.tsx`. Do not implement general error handling for all Firebase operations across the entire application in this task.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
