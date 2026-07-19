```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.4: Accessibility, which aims to enhance the user experience for assistive technologies.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them to improve accessibility for screen reader users.

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

## Worker Prompt

1.  **Identify Icon-Only Buttons:** Scan the `src/` directory, particularly components and main views (e.g., `src/App.tsx`, `src/components/`), to locate all interactive elements that are visually represented by an icon but lack visible text. These are typically `<button>` elements or `<a>` elements styled as buttons.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute with a concise and descriptive text that explains the button's purpose or action.
    *   Examples: "Upload image", "Delete item", "Edit tag", "Sign out", "Toggle navigation".
3.  **Review existing buttons:** Ensure that any existing buttons that might be icon-only but already have `aria-label` are correct and descriptive.
4.  **Test Accessibility (Manual):** Although not part of automated tests, perform a quick manual check (e.g., using browser developer tools accessibility tree or a screen reader if available) to ensure the labels are correctly exposed.
5.  **Run Checks:** Execute `npm run build` and `npm run lint` to ensure no new errors or warnings are introduced.

**Acceptance Criteria:**

*   All interactive icon-only buttons throughout the application have a descriptive `aria-label` attribute.
*   The `aria-label` text accurately conveys the button's function to screen reader users.
*   No new npm dependencies are added.
*   The application builds successfully (`npm run build`).
*   There are no new linting errors (`npm run lint`).
*   The visual appearance and functionality of the application remain unchanged for visual users.

**Required test commands:**

```bash
npm run build
npm run lint
```
```
