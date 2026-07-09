```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses accessibility improvements under Phase 2.4.

## Objective

Identify all icon-only buttons in the application and add appropriate `aria-label` attributes to improve accessibility for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only buttons. This is a crucial step for screen reader users to understand the purpose of interactive elements that lack visible text labels.

**Steps:**

1.  **Identify Icon-Only Buttons:** Systematically review the application's UI components, particularly in areas like the nail item list, detail view, tag management, and header, to find buttons that contain only an icon and no visible text. These are typically `button` elements wrapping an SVG icon or an icon font component.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute with a concise and descriptive text that explains its action.
    *   **Examples:**
        *   A trash can icon button for deleting an item should have `aria-label="Delete item"`.
        *   A pencil icon button for editing an item should have `aria-label="Edit item"`.
        *   A plus icon button for adding a new item should have `aria-label="Add new item"`.
        *   A share icon button should have `aria-label="Share item"`.
        *   A camera or upload icon button should have `aria-label="Upload image"`.
        *   A close or 'x' icon button (e.g., in a modal or tag) should have `aria-label="Close"`.
3.  **Ensure Clarity:** The `aria-label` text should be clear, unambiguous, and immediately understandable out of context for a screen reader user.
4.  **Verify Functionality:** Ensure that adding `aria-label` attributes does not alter the visual styling or existing functionality of the buttons.

**Acceptance Criteria:**

-   All icon-only buttons throughout the application have a descriptive `aria-label` attribute.
-   The application builds successfully (`npm run build`).
-   The application passes lint checks (`npm run lint`).
-   The changes are within the 150-line diff limit.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
```
