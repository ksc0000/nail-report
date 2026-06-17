# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability, test coverage, and UX in Phase 2. The current state indicates that the AI-Loop setup is complete, and the first substantive task is pending. This task focuses on improving accessibility, a key part of Phase 2 UX enhancements.

## Objective

Implement the accessibility improvement: Add `aria-label` attributes to all icon-only buttons throughout the application to enhance screen reader compatibility.

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

---

## Worker prompt

Your task is to identify all buttons in the application that consist solely of an icon (without visible text) and add an appropriate `aria-label` attribute to each of them. The `aria-label` should clearly describe the button's action for screen reader users.

**Steps:**

1.  Review the React components in the `src/` directory to locate icon-only buttons. Common places include navigation, item actions (edit, delete), and interactive elements.
2.  For each identified icon-only button, add an `aria-label` attribute with a descriptive text. For example, a delete button with a trash icon might get `aria-label="Delete item"`.
3.  Ensure the `aria-label` provides sufficient context without being redundant.
4.  Do not modify buttons that already have visible text or an `aria-labelledby` referencing visible text.
5.  After making changes, run `npm run build` and `npm run lint` to confirm no errors or warnings were introduced.

**Acceptance Criteria:**

- All icon-only buttons in the application now have a meaningful `aria-label` attribute.
- The application builds successfully without errors (`npm run build`).
- The linter passes without warnings or errors (`npm run lint`).
- No new npm packages were added.
- The code changes adhere to the diff limit of 150 lines.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
