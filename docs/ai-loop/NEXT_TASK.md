```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This includes enhancing accessibility. The current state shows no substantive tasks completed yet, and the AI Loop has several pending "Jules-ready Tasks."

## Objective

Implement `aria-label` attributes for all icon-only buttons in the application to improve accessibility, as outlined in Phase 2.4 of the roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`) - This task will primarily involve modifying existing React component files to add `aria-label` attributes to icon-only buttons.
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts) - Unlikely to be modified for this task, but allowed if strictly necessary.
- `src/__tests__/` (new test files) - Not directly applicable as this is a UI accessibility improvement, not a `src/lib` logic change.
- `src/App.css` (CSS improvements) - Unlikely to be modified for this task, but allowed.

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

Your task is to identify all buttons within the `nail-report` application that display only an icon without visible text and add an appropriate `aria-label` attribute to each. The `aria-label` should provide a concise, descriptive text alternative for the icon's purpose.

For example, if a button has an "X" icon to close a modal, its `aria-label` might be "Close". If it has a trash can icon to delete an item, it might be "Delete item".

Focus on common interactive elements suchike:
- Delete buttons
- Edit buttons
- Close/Cancel buttons
- Navigation buttons (e.g., back, next)
- Share buttons
- Upload/Download buttons
- Sorting or filtering buttons
- Sign-out buttons

**Steps:**
1.  Search the `src/` directory for `<button>` elements or custom components (e.g., `IconButton` if present) that render only an icon.
2.  For each identified icon-only button, add an `aria-label="[descriptive text]"` attribute.
3.  Ensure the descriptive text accurately conveys the button's action.
4.  Verify `npm run build` and `npm run lint` pass without errors or warnings.

**Acceptance Criteria:**
- All icon-only buttons found in the `src/` directory (excluding `src/main.tsx`) have a descriptive `aria-label` attribute.
- The `aria-label` values are contextually accurate.
- The application builds successfully.
- Linting passes without errors.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
```
