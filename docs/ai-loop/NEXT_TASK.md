# Worker Prompt Template

## Context

The application needs to improve its overall accessibility, starting with interactive elements.

## Objective

Identify and add an appropriate `aria-label` attribute to all icon-only buttons across the application. This will enhance usability for screen reader users by providing a descriptive name for each button's action.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/features/` (modifying existing feature component files)

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

### Worker Prompt

The goal is to improve accessibility for screen readers. Scan through the React components in `src/components/` and `src/features/`. For every `<button>` element that contains only an icon (e.g., `<button><Icon /></button>`) and no visible text, add an `aria-label="Descriptive Text"` attribute. The descriptive text should clearly communicate the button's purpose (e.g., "Delete item", "Edit profile", "Share link").

**Acceptance Criteria:**
1.  All icon-only buttons in existing components have a descriptive `aria-label`.
2.  The application builds and runs without errors or new lint warnings.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
