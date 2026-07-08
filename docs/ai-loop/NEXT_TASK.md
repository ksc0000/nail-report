# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX improvements. This task directly addresses Phase 2.4 Accessibility, which aims to improve the application's usability for all users, including those relying on assistive technologies.

## Objective

Identify all icon-only buttons throughout the application and add appropriate `aria-label` attributes to them.

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
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to enhance the accessibility of the nail-report application by adding `aria-label` attributes to all icon-only interactive elements that function as buttons.

**Steps:**

1.  **Identify Icon-Only Buttons:** Navigate through the application's UI to locate buttons or interactive elements (e.g., `<a>` tags styled as buttons) that convey their action primarily through an icon without visible text.
    *   Look for common patterns like:
        *   Delete icons (e.g., trash can)
        *   Edit icons (e.g., pencil)
        *   Add/Upload icons (e.g., plus sign, cloud with arrow)
        *   Close/Dismiss icons (e.g., 'x' mark)
        *   Navigation icons (e.g., home, settings, back arrows)
        *   Sign-out icons.
2.  **Add `aria-label`:** For each identified element, add an `aria-label` attribute that provides a concise, descriptive text alternative for the icon's function. This label should describe the action the button performs.
    *   **Example:**
        *   Before: `<button><img src="delete.svg" alt=""></button>`
        *   After: `<button aria-label="Delete item"><img src="delete.svg" alt=""></button>`
        *   Before: `<a onClick={handleShare}><ShareIcon /></a>`
        *   After: `<a onClick={handleShare} aria-label="Share item"><ShareIcon /></a>`
3.  **Review existing `alt` attributes:** If an `<img>` tag inside a button already has a descriptive `alt` attribute that fully explains the button's purpose, adding an `aria-label` to the button itself might be redundant or undesirable. Prioritize `aria-label` on the button element itself, but be mindful of existing `alt` text. If the icon *is* decorative and the button *already* has visible text, no `aria-label` is needed.
4.  **Common components to check:**
    *   Nail item list (edit, delete, share buttons)
    *   Image upload/delete actions
    *   Tag management buttons
    *   Navigation elements (if any are icon-only)
    *   Modals or dialogs (close buttons)

**Acceptance Criteria:**

-   All icon-only buttons throughout the application have a descriptive `aria-label` attribute.
-   The `aria-label` accurately describes the action performed by the button.
-   No new `npm` packages are added.
-   The changes result in a diff of 150 lines or less.

**Required Test Commands:**

```bash
npm run build
npm run lint
```
