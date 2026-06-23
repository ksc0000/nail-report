# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This includes accessibility enhancements. The current state shows that initial setup tasks are complete, and we're ready for the first substantive code task.

## Objective

Identify all icon-only buttons within the application and add an appropriate `aria-label` attribute to each of them to improve accessibility for screen reader users.

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

Your task is to enhance the accessibility of the nail-report application by ensuring all icon-only buttons have meaningful `aria-label` attributes.

1.  **Locate Icon-Only Buttons:** Traverse the `src/` directory (excluding `src/main.tsx`) to find all HTML `<button>` elements that contain only an icon (e.g., an `<img>`, `<svg>`, or an icon font element) and no visible text label. These buttons are typically designed to be self-explanatory visually but lack textual context for screen readers.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute. The value of this attribute should be a concise, descriptive text that explains the button's action or purpose (e.g., `aria-label="Delete item"`, `aria-label="Edit nail report"`, `aria-label="Upload image"`, `aria-label="Open menu"`).
3.  **Review existing buttons:** If any icon-only buttons already have an `aria-label`, ensure it is descriptive and accurate.
4.  **No New Components or Logic:** This task is purely about adding the `aria-label` attribute to existing button elements. Do not introduce new components or change existing application logic.

### Acceptance Criteria:

- All icon-only buttons in the application have an `aria-label` attribute.
- The `aria-label` values accurately describe the function of each button.
- No new npm dependencies are introduced.
- The `npm run build` and `npm run lint` commands complete without errors.

### Required Test Commands:

```bash
npm run build
npm run lint
```
