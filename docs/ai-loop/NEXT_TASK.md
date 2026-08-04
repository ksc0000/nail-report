# Worker Prompt Template

## Context

The application needs accessibility improvements. This task focuses on enhancing screen reader usability for interactive elements.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them. The `aria-label` should clearly describe the button's action or purpose for screen reader users.

## Allowed Scope

- `src/` (except `src/main.tsx`) - This task will primarily involve modifying existing React component files (`.tsx`).
- `src/App.css` (if minor styling adjustments are needed for accessibility, e.g., hidden text for screen readers)

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
- Ensure every icon-only button now has a descriptive `aria-label`.
- The `aria-label` text should be concise and functional. For example, a delete button with an trashcan icon should have `aria-label="Delete item"`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**

- All `button` elements that contain only an icon (or an icon and no visible text) must have an `aria-label` attribute.
- The value of `aria-label` must accurately describe the button's function.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
