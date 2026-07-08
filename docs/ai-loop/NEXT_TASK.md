```markdown
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

## Context

The application needs improved accessibility. Specifically, icon-only buttons lack proper labels for screen readers, which is a key part of Phase 2.4 of the roadmap.

## Objective

Add `aria-label` attributes to all icon-only buttons throughout the application to enhance accessibility for screen reader users.

## Allowed Scope

- `src/components/` (e.g., button components, list items with action buttons)
- `src/pages/` (any page using icon-only buttons)
- `src/App.tsx` (if a top-level button is found, though less likely)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps
- Firebase deploy commands
- Secrets and credentials

## Requirements

- **Identify:** Locate all interactive elements that function as buttons but display only an icon without visible text.
- **Implement `aria-label`:** For each identified icon-only button, add an `aria-label` attribute.
- **Descriptive Labels:** The `aria-label` content must clearly and concisely describe the button's intended action or purpose (e.g., "Delete item", "Edit item", "Add tag", "Close modal", "View details").
- **No New Dependencies:** Do not add any new npm packages.
- **Small Diff:** The changes should be focused on adding `aria-label` attributes and should result in a diff of no more than 150 lines.
- **Code Quality:** Ensure `npm run build` and `npm run lint` pass successfully after changes.
- **Follow-up:** If any icon-only buttons are found to be complex (e.g., dynamically changing icons/actions) and a simple `aria-label` isn't sufficient, report it as a comment for a follow-up task.

## Acceptance Criteria

- All icon-only buttons in the application have a descriptive `aria-label` attribute.
- The application builds without errors (`npm run build`).
- Linting passes (`npm run lint`).

## Required Test Commands

```bash
npm install
npm run build
npm run lint
```
```
```
