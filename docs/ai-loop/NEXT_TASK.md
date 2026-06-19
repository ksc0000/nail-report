# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.4 addresses accessibility. This task focuses on a key accessibility improvement for interactive elements.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each, providing a descriptive text for screen reader users.

## Allowed Scope

- `src/**/*.tsx` (React components containing icon buttons)
- `src/**/*.ts` (if utility functions are involved in rendering buttons, unlikely for this task)
- `src/App.css` (No changes expected, but allowed if minor styling adjustments are needed due to attribute addition)

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
- Ensure the `aria-label` attribute accurately describes the button's action (e.g., "Delete item", "Edit tag", "Upload image").
- The visual appearance and functionality of the buttons must remain unchanged.
- No new npm dependencies should be added.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
1.  All interactive elements that are visually represented as "icon-only buttons" now include a descriptive `aria-label` attribute.
2.  The `aria-label` content clearly conveys the button's purpose to assistive technologies.
3.  The application's visual layout and functionality remain identical to their state before this change.
4.  `npm run build` and `npm run lint` execute successfully without warnings or errors.
