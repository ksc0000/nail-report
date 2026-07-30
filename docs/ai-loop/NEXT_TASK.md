# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.4: Accessibility.

## Objective

Identify all icon-only buttons throughout the application and add an appropriate `aria-label` attribute to each for improved accessibility.

## Allowed Scope

-   `src/components/` (all component files)
-   `src/App.tsx`
-   Any other `.tsx` files in `src/` that contain icon-only buttons.

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

## Worker Prompt

Implement the following:

1.  **Identify Icon-Only Buttons:** Systematically review the React components (`.tsx` files in `src/components/` and `src/App.tsx`) to find `<button>` elements that contain only an icon (e.g., from `react-icons`) and no visible text. These are the targets for `aria-label`s.
2.  **Add `aria-label`:** For each identified icon-only button, add an `aria-label` attribute that clearly and concisely describes the button's purpose or action.
    *   **Examples:**
        *   A trash can icon button: `<button aria-label="Delete item">`
        *   A share icon button: `<button aria-label="Share item">`
        *   An edit icon button: `<button aria-label="Edit item">`
        *   A plus icon button for adding: `<button aria-label="Add new item">`
3.  **Prioritize Core UI:** Focus on buttons related to CRUD operations (create, read, update, delete), navigation, and major utility actions within lists or forms.
4.  **Descriptive Labels:** Ensure the `aria-label` provides enough context for screen reader users to understand the button's function without visual cues.

**Acceptance Criteria:**
*   All significant icon-only buttons throughout the application have a descriptive `aria-label` attribute.
*   The application builds and lints without errors.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
