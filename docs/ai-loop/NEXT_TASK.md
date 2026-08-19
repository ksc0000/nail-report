# Worker Prompt Template

## Context

The application needs improved accessibility. Many interactive elements, particularly buttons that display only an icon, lack proper semantic labeling for screen readers. This task focuses on addressing this by adding `aria-label` attributes to such elements.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to enhance accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files if applicable, though unlikely for this task)
- `src/App.css` (CSS improvements, though unlikely for this task)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

1.  **Identify Icon-Only Buttons:** Systematically review React components (`.tsx` files in `src/`) to identify all `<button>` elements or custom `IconButton` components that contain only an icon (e.g., an SVG, an `<i>` tag with an icon class, or an `<img>` tag) and no visible text label.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute with a concise, descriptive text that explains the button's action.
    *   **Example:** For a delete button displaying a trash can icon, add `aria-label="Delete item"`.
    *   **Example:** For an edit button displaying a pencil icon, add `aria-label="Edit item"`.
    *   **Example:** For a share button displaying a share icon, add `aria-label="Share item"`.
3.  **Verify Accessibility (Manual Check):** After applying changes, consider a quick manual review (e.g., inspecting elements in developer tools) to ensure `aria-label` attributes are correctly rendered.
4.  **Lint and Build:** Ensure the project lints and builds successfully.

### Acceptance Criteria

- All interactive icon-only buttons throughout the application have a descriptive `aria-label` attribute.
- The application builds successfully (`npm run build`).
- The code passes linting checks (`npm run lint`).
