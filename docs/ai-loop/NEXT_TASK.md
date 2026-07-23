```markdown
# Worker Prompt Template

## Context

The application currently shows a blank screen while nail items are being fetched from Firebase. To improve the user experience, a visual indicator of loading is needed, as per Phase 2.3 of the product roadmap focusing on "Loading states".

## Objective

Implement a basic loading skeleton for the nail item list displayed in `src/App.tsx`. The skeleton should appear when the application is fetching the initial list of nail items, providing visual feedback to the user.

## Allowed Scope

- `src/App.tsx`
- `src/App.css`
- `src/components/` (if a new skeleton component is deemed necessary and small)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The loading skeleton should be displayed when `nailItems` is empty or `null` AND a loading state indicator (which might need to be introduced) is true.
- A simple visual representation (e.g., a few grey rectangle placeholders) is sufficient for the skeleton.
- Do not add any new npm dependencies.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- Prefer existing UI patterns and CSS classes if available, otherwise, add minimal new CSS.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
