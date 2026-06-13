```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses accessibility enhancements as part of sub-phase 2.4.

## Objective

Implement accessibility by adding `aria-label` attributes to all icon-only buttons in the application.

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

Jules, your task is to identify and update all icon-only `<button>` elements across the `nail-report` application's `src/` directory (excluding `src/main.tsx`). For each such button, you must add an `aria-label` attribute with a clear, concise, and descriptive text value that explains the button's purpose or action.

For example:
- A button with a trash can icon should receive `aria-label="Delete item"`.
- A button with a plus icon should receive `aria-label="Add new item"`.
- A button with a settings cog icon should receive `aria-label="Open settings"`.

Ensure that the `aria-label` content provides sufficient context for assistive technologies. Prioritize areas with common user interactions, such as navigation, CRUD operations, and form controls.

### Acceptance Criteria

- All icon-only buttons throughout the application have a meaningful `aria-label` attribute.
- The `aria-label` content accurately describes the button's function.
- No new npm packages are installed.
- The total diff remains within the 150-line limit.

### Required Test Commands

```bash
npm run build
npm run lint
```
```
```
