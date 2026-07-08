# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.3 focuses on improving loading states with a specific goal of adding a skeleton loading for the nail item list. This task will implement that improvement.

## Objective

Implement a skeleton loading UI for the nail item list displayed in `src/App.tsx`. This skeleton should appear while the actual nail items are being fetched.

## Allowed Scope

- `src/App.tsx` (for integrating the skeleton)
- `src/components/` (if a new skeleton component is created)
- `src/App.css` or new CSS module for styling the skeleton
- `src/hooks/` (if a custom hook is needed to manage loading state)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The skeleton should display dynamically when data is being fetched and hide once data is loaded.
- Ensure the skeleton provides a visual indication of content loading.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (N/A for this task).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
