# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key aspect of UX improvement is accessibility. This task focuses on enhancing the accessibility of interactive elements.

## Objective

Identify all icon-only buttons within the application and add appropriate `aria-label` attributes to improve their accessibility for screen reader users.

## Allowed Scope

- `src/components/` (any component files where icon buttons are defined)
- `src/` (any other component files where icon buttons are defined, except `src/main.tsx`)
- `src/App.css` (if minor styling adjustments are needed, though unlikely)

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
- Prefer adding tests when touching `src/lib/` files. (This task primarily modifies UI components, so new unit tests for `src/lib` are not expected, but existing component tests could be updated if applicable.)
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all buttons that display only an icon and no visible text.

**Detailed Steps:**

1.  **Locate Icon-Only Buttons:** Traverse through the React components in the `src/` directory to find all `<button>` elements that primarily use an icon (e.g., from an SVG or an icon font) without accompanying visible text to convey their purpose.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute with a concise and descriptive text that explains the button's action.
    *   **Examples:**
        *   A button with a trash can icon for deleting should have `aria-label="Delete item"`.
        *   A button with a share icon should have `aria-label="Share item"`.
        *   A button with a plus icon for adding should have `aria-label="Add new item"`.
        *   A button with a gear icon for settings should have `aria-label="Settings"`.
3.  **Review and Test:** Ensure that the `aria-label` texts are accurate and helpful. Visually confirm that the changes do not introduce any layout regressions.

**Acceptance Criteria:**

*   All icon-only buttons in the application (e.g., delete, edit, share, add, navigation icons) have a descriptive `aria-label` attribute.
*   The application builds successfully (`npm run build`).
*   There are no linting errors (`npm run lint`).
*   The diff size is within the 150-line limit.

**Required Test Commands:**

```bash
npm install
npm run build
npm run lint
```
