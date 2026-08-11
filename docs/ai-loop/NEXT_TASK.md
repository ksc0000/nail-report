```markdown
# Worker Prompt Template

## Context

The current focus is on improving the application's stability, test coverage, and UX, specifically addressing accessibility as part of Phase 2.4 of the roadmap. Many interactive elements, such as buttons that display only an icon, lack proper accessibility labels for screen readers.

## Objective

Enhance the application's accessibility by identifying all icon-only buttons and adding appropriate `aria-label` attributes to them.

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
- Identify all `button` elements that render only an icon without visible text.
- Add a descriptive `aria-label` attribute to each identified button. The label should clearly communicate the button's purpose (e.g., "Delete item", "Edit tag", "Share report").
- Ensure the `aria-label` content is concise and helpful for screen reader users.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Acceptance Criteria

- All icon-only buttons throughout the application have a meaningful `aria-label` attribute.
- The application builds successfully and passes lint checks.

## Required Test Commands

```bash
npm run build
npm run lint
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
