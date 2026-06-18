# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically addresses accessibility enhancements under Phase 2.4.

## Objective

Identify all icon-only button elements in the application and add an appropriate, descriptive `aria-label` attribute to each. This improves accessibility for users relying on screen readers.

## Allowed Scope

- `src/` (excluding `src/main.tsx`)
- `src/components/` (modifying existing component files)
- `src/App.tsx`, `src/views/` (modifying existing view files if they contain icon buttons)

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
- Ensure the `aria-label` provides a clear and concise description of the button's action (e.g., "Delete item", "Edit profile", "Upload image").
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Acceptance Criteria

- All button elements that display only an icon (without visible text) have a meaningful `aria-label` attribute.
- The application builds successfully (`npm run build`).
- The linter passes without errors (`npm run lint`).

## Required Test Commands

```bash
npm run build
npm run lint
```

## Suggested Next Task

Add loading skeleton to nail item list (`src/App.tsx`). This addresses Phase 2.3 (Loading states) by improving the user experience during data fetching.
