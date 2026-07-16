# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses an accessibility improvement from section 2.4.

## Objective

Implement accessibility improvements by adding `aria-label` attributes to all icon-only buttons throughout the application.

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

## Worker Prompt

Your task is to improve the accessibility of the `nail-report` application by adding `aria-label` attributes to all interactive elements that consist solely of an icon (e.g., buttons with only an SVG icon and no visible text).

**Steps:**

1.  **Identify Icon-Only Buttons:** Traverse through the React components in the `src/` directory. Look for `<button>` or similar interactive elements that visually present only an icon (e.g., `<button><svg>...</svg></button>`, `<button><IconComponent /></button>`).
2.  **Add `aria-label`:** For each identified icon-only button, add a descriptive `aria-label` attribute.
    *   The `aria-label` should clearly state the button's purpose for screen reader users.
    *   **Example:** If a button contains an SVG of a trash can icon and its function is to delete an item, add `aria-label="Delete item"`.
    *   Prioritize common actions such as "Edit", "Delete", "Add", "Share", "Close", "Back", "Menu", "Filter", etc.
3.  **Ensure Consistency:** Use concise and clear labels.
4.  **Verify:** After making changes, ensure the application still functions correctly.

**Acceptance Criteria:**

*   All icon-only buttons in the application have a meaningful `aria-label` attribute.
*   No new npm dependencies are introduced.
*   The total diff for the task is less than or equal to 150 lines.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
