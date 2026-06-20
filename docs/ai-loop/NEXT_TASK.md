# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability, test coverage, and UX in Phase 2. This task focuses on enhancing accessibility as part of Phase 2.4.

## Objective

Add `aria-label` attributes to icon-only buttons throughout the application to improve accessibility for screen reader users. The goal is to cover the most critical interactive elements in the main user flows (e.g., item list, detail view, common actions).

## Allowed Scope

- `src/components/` (modifying existing component `.tsx` files to add `aria-label` props)
- `src/App.tsx` (if there are icon-only buttons directly in the main app component)
- `src/App.css` (only if absolutely necessary for layout adjustments related to `aria-label` additions, but generally not expected)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/` (not expected to be modified for this task)

## Requirements

- Identify icon-only buttons (e.g., buttons containing only an `<img>`, `<svg>`, or icon font element without visible text) that are interactive.
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly explain the button's action (e.g., `aria-label="Delete item"`, `aria-label="Edit nail report"`, `aria-label="Upload image"`).
- Keep diff ≤ 150 lines. Focus on the most impactful buttons first if the total count is high.
- Run `npm run build && npm run lint` before finishing.
- Report any significant icon-only buttons that were intentionally omitted due to the line limit as a follow-up item.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Suggested next task

Add Vitest + unit tests for `src/lib/firestore.ts` helpers
