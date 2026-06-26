```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.2 addresses "Error handling UX" by aiming to show user-friendly error banners.

This is the first substantive task for the AI loop.

## Objective

Implement a new React component for displaying user-friendly, dismissible error banners and integrate it to handle Firebase Firestore and Storage-related errors within the application.

## Allowed Scope

- `src/` (create new component files, modify existing components to display the banner)
- `src/App.css` (for styling the banner)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new, reusable React component for an error banner.
- The banner should display a user-friendly error message.
- The banner must be dismissible by the user (e.g., with a close button).
- Integrate this banner to display errors originating from Firebase Firestore and Storage operations (e.g., failed item creation/update, image upload/deletion).
- Initially, focus on displaying a generic message like "An error occurred: [specific error message]" for these Firebase errors.
- Do not implement retry functionality in this task.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (though this task focuses on UI integration).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Create a new React component, for example `src/components/ErrorBanner.tsx`, that displays a user-friendly error message and can be dismissed.

Integrate this `ErrorBanner` component into `src/App.tsx` or other relevant parent components where Firebase Firestore and Storage operations are performed. The goal is to catch and display errors that occur during operations such as adding, updating, or deleting `nailItems` or uploading/deleting images.

For this task, ensure the banner shows a simple message like "Error: [actual error message]" and has a clear way for the user to close it. Do not add any retry logic or complex error parsing beyond displaying the message itself.

### Acceptance Criteria

- A new `ErrorBanner` component exists.
- The `ErrorBanner` component is integrated into the application to display real-time errors from Firestore/Storage operations.
- The error banner is visible to the user when an error occurs.
- The error banner can be dismissed by the user.

### Required test commands

```bash
npm run build
npm run lint
```
```
```
