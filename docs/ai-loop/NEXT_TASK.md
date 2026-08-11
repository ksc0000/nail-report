# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task directly addresses Phase 2.4 Accessibility by ensuring interactive elements are properly labeled for assistive technologies.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each of them. The `aria-label` should describe the button's action or purpose.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modify existing component files to add `aria-label`)
- `src/App.tsx` (if icon buttons exist here)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- For each icon-only button, add an `aria-label` attribute.
- The `aria-label` text must be descriptive and concise (e.g., "Delete item", "Edit tag", "Upload image").
- Do not modify buttons that already have visible text labels or clear `aria-labelledby` references.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
