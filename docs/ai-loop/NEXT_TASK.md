# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.4, specifically enhancing accessibility by adding `aria-label` attributes to icon-only buttons. This will improve usability for users relying on assistive technologies.

## Objective

Identify and add an appropriate `aria-label` attribute to all icon-only buttons throughout the application.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - *Read-only, no modifications expected for this task.*
- `src/__tests__/` (new test files) - *Not expected for this task.*
- `src/App.css` (CSS improvements) - *Not expected for this task.*

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

1.  **Identify Icon-Only Buttons**: Go through the application's React components in the `src/` directory. Look for `<button>` elements that visually convey their purpose solely through an icon (e.g., an `<img>`, `<svg>`, or an icon component within them) without accompanying visible text.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute with a concise, descriptive text that explains the button's action.
    *   **Example**: A button showing a trash can icon should have `aria-label="Delete item"`. A button with a pencil icon should have `aria-label="Edit item"`. A "close" icon button should have `aria-label="Close"`.
    *   Ensure the `aria-label` accurately describes the button's function within its context.
3.  **Prioritize common actions**: Focus on buttons for common actions like:
    *   Edit, Delete, Add/Create
    *   Close, Back, Menu/More options
    *   Upload, Share
4.  **Verification**: Manually navigate the UI to confirm `aria-label`s are present on icon-only buttons.
5.  **Code Style**: Maintain existing code style.

## Acceptance Criteria

- All icon-only buttons that are found in the existing codebase have a descriptive `aria-label` attribute.
- The application builds successfully without errors (`npm run build`).
- The code passes lint checks (`npm run lint`).
- The changes adhere to the line diff limit (≤ 150 lines).

## Required Test Commands

```bash
npm run build
npm run lint
```
