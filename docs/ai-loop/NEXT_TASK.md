```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report aims to improve stability, test coverage, and UX in Phase 2. This task focuses on enhancing the user experience by addressing loading states. Currently, the nail item list might appear blank while data is being fetched.

## Objective

Implement a skeleton loading UI for the nail item list displayed in `src/App.tsx`. When nail items are being fetched, the application should display a simplified, placeholder version of the list items to provide a better visual cue to the user.

## Allowed Scope

-   `src/App.tsx` (for conditional rendering of the skeleton)
-   `src/App.css` (for styling the skeleton components)
-   New components within `src/components/` (e.g., `src/components/NailItemSkeleton.tsx` if a dedicated component is preferred)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   The skeleton UI should visually resemble the layout of a single nail item (e.g., placeholders for an image, title, and a few tags).
-   The skeleton should be displayed only when the nail item data is actively loading.
-   Ensure the implementation does not introduce any new npm dependencies.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

```
