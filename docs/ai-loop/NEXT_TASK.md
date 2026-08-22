```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add `aria-label` attributes to all icon-only buttons in the application to improve accessibility.

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

## Worker Prompt

### Summary of what changed
This task focuses on improving the application's accessibility by adding `aria-label` attributes to all interactive elements that use only an icon without visible text. This includes buttons for actions like "edit," "delete," "share," "close," etc., ensuring screen reader users understand the purpose of these controls.

### Changed files list
Likely `src/App.tsx` and various component files within `src/components/` that contain icon-only buttons. Examples include `src/components/NailItemCard.tsx`, `src/components/NailItemDetail.tsx`, and any navigation or form components.

### Commands run and results
```bash
npm install # Ensure all dependencies are up to date
npm run build
# Expected: Build completes successfully without errors.
npm run lint
# Expected: Linting completes successfully without errors or new warnings.
```

### Known issues or limitations
- No known issues or limitations are anticipated for this specific task. The changes should be purely additive and enhance accessibility without altering visual presentation or core functionality.

### Suggested next task
Add Vitest + unit tests for `src/lib/firestore.ts` helpers.
```
