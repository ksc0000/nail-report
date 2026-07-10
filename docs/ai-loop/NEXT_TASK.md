# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.4: Accessibility, by improving screen reader support for interactive elements.

## Objective

Identify all icon-only buttons within the application and add a descriptive `aria-label` attribute to each. This will ensure that users relying on screen readers can understand the purpose of these buttons.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/App.tsx` (modifying existing JSX)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI-focused task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons.

1.  **Identify Icon-Only Buttons**: Traverse the `src/` directory, focusing on `src/components/` and `src/App.tsx`. Look for `<button>` elements that contain only an icon (e.g., an SVG, an `<i>` tag with an icon class) and no visible text.
2.  **Add `aria-label`**: For each identified icon-only button, add an `aria-label` attribute. The value of the `aria-label` should be a short, descriptive phrase that explains the button's action.
    *   Examples:
        *   For a delete icon button: `<button aria-label="Delete item">...</button>`
        *   For an edit icon button: `<button aria-label="Edit item">...</button>`
        *   For a sign-out icon button: `<button aria-label="Sign out">...</button>`
        *   For a settings icon button: `<button aria-label="Settings">...</button>`
3.  **Review**: Ensure that every icon-only button has an appropriate `aria-label` and that the labels are clear and concise. Do not add `aria-label` to buttons that already have visible text content or are inherently descriptive through other means (e.g., an image with an `alt` attribute that acts as a button).

**Acceptance Criteria:**
*   All icon-only buttons within the application have a descriptive `aria-label` attribute.
*   The application functions correctly without regressions.
*   The changes adhere to the line diff limit.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
