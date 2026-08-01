# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which involves improving stability, test coverage, and UX. This task specifically addresses accessibility improvements.

## Objective

Identify all icon-only buttons in the application and add an appropriate `aria-label` attribute to each of them to improve accessibility for screen reader users.

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

### Summary of what changed

Added `aria-label` attributes to all identified icon-only buttons within the application. This ensures that assistive technologies can convey the purpose of these buttons to users. For example, a "delete" icon button now has `aria-label="Delete item"`.

### Changed files list

-   `src/App.tsx` (if it contains icon buttons)
-   `src/components/SomeComponent.tsx` (any component file containing icon-only buttons)
-   `src/features/SomeFeature/SomeComponent.tsx` (any feature component file containing icon-only buttons)
-   *(List specific paths for changed files, e.g., `src/components/NailItemCard.tsx`, `src/components/TagList.tsx`, etc.)*

### Commands run and results

```bash
npm install
npm run build
npm run lint
```

*(Expected output for `npm run build` is successful compilation. Expected output for `npm run lint` is no errors or warnings.)*

### Known issues or limitations

No known issues. The changes are purely additive for accessibility and should not impact visual layout or existing functionality.

### Suggested next task

Add Vitest + unit tests for `src/lib/firestore.ts` helper functions, focusing on mocking Firebase SDK for isolated testing.
