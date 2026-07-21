# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

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

# Worker Prompt

## Objective

Implement Phase 2.4 Accessibility by adding `aria-label` attributes to all existing icon-only buttons throughout the application.

## Acceptance Criteria

1.  Identify all buttons that solely rely on an icon for their meaning (i.e., have no visible text label).
2.  Add an appropriate `aria-label` attribute to each identified button.
3.  The `aria-label` text must clearly and concisely describe the button's intended action (e.g., "Delete item", "Edit item", "Add new tag", "Sign out", "Upload image").
4.  No visible text labels should be added to these buttons; only the `aria-label` attribute should be used for accessibility.

## Required Test Commands

-   `npm run build` completes successfully with no errors.
-   `npm run lint` completes successfully with no new warnings or errors.
-   Manually verify the application in a web browser:
    -   Ensure all icon-only buttons are still visually present and functional.
    -   Use browser developer tools (e.g., Chrome Lighthouse or Accessibility tab) to inspect buttons and confirm the `aria-label` attribute is present and meaningful.

## Suggested next task

Add Vitest + unit tests for `src/lib/firestore.ts` helpers.
