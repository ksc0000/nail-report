# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This includes enhancing accessibility. The current state indicates that the AI Loop is ready to tackle its first substantive task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add `aria-label` attributes to all interactive buttons that contain only an icon (no visible text) across the application, improving accessibility for screen reader users.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
-   `src/__tests__/` (new test files)
-   `src/App.css` (CSS improvements)

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
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker Prompt

Your task is to identify all interactive `<button>` elements (or elements acting as buttons, e.g., `role="button"`) that primarily display an icon without accompanying visible text. For each such button, add an appropriate `aria-label` attribute that describes its function to assistive technologies.

For example, a trash can icon button for deleting an item should have an `aria-label="Delete item"`. A settings icon button should have `aria-label="Settings"`. Ensure the label is concise and descriptive.

Focus on elements that are clearly interactive and rely solely on an icon for their visual representation of purpose.

**Acceptance Criteria:**
1.  All icon-only interactive buttons in the application have a descriptive `aria-label` attribute.
2.  The application builds successfully (`npm run build`).
3.  The linter passes (`npm run lint`).
4.  No new npm dependencies are introduced.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
