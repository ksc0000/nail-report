# Worker Prompt Template

## Context

The product roadmap for `nail-report` is actively working on Phase 2, which focuses on improving stability, test coverage, and user experience. A key area within UX improvements is accessibility (2.4). This task directly addresses an accessibility improvement.

## Objective

Identify all icon-only buttons within the application and add an appropriate, descriptive `aria-label` attribute to each. This will improve accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (except `src/main.tsx`) - focus on component files containing icon buttons.
- `src/App.css` (minor adjustments if absolutely necessary for visibility testing, but prefer `aria-label` only).

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
- Ensure the `aria-label` values are clear, concise, and accurately describe the button's action for screen reader users.
- Do not add any new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- All icon-only buttons in the application (e.g., delete, edit, share, add, back, close buttons that only display an icon) have a meaningful `aria-label` attribute.
- The application builds and lints without errors (`npm run build && npm run lint`).
- The user experience for screen reader users is improved by providing clear button descriptions.

## Required Test Commands

```bash
npm install
npm run build
npm run lint
```
