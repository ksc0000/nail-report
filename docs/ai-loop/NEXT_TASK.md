# Worker Prompt Template

## Context

The current phase (Phase 2) of the roadmap focuses on improving stability, test coverage, and user experience. A key aspect of UX is accessibility. This task focuses on enhancing the accessibility of interactive elements.

## Objective

Add `aria-label` attributes to all existing icon-only buttons across the application to improve usability for assistive technologies.

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

## Worker prompt

Implement `aria-label` attributes for all interactive elements that are visually represented by an icon but do not have visible text. For example, if a button uses an icon to indicate "delete", add `aria-label="Delete item"`.

**Acceptance Criteria:**

1.  Identify all buttons that display only an icon without accompanying text.
2.  For each identified button, add a descriptive `aria-label` attribute.
3.  The `aria-label` content must accurately describe the button's action or purpose.
4.  Ensure no new npm dependencies are introduced.
5.  The total line diff for the pull request must be ≤ 150 lines.

**Required Test Commands:**

```bash
npm run build && npm run lint
```
