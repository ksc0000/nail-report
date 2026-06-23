```markdown
# Worker Prompt Template

## Context

The current focus is Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses item 2.4 Accessibility.

## Objective

Add `aria-label` attributes to all icon-only interactive elements (primarily buttons and potentially links acting as buttons) throughout the application to improve accessibility for screen reader users.

## Allowed Scope

- `src/components/**/*.tsx`
- `src/App.tsx`
- `src/pages/**/*.tsx`
- `src/lib/**/*.ts` (if any UI elements are rendered directly or helper functions create them, though unlikely for this task)
- `src/App.css` (only if absolutely necessary for styling changes related to accessibility, but not expected)

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
- Prefer adding tests when touching `src/lib/` files (not applicable for this UI task).
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to identify all interactive elements (buttons, links styled as buttons, or any element with an `onClick` handler) that contain only an icon or an image and lack a visually apparent text label. For each such element, add a descriptive `aria-label` attribute.

**Steps:**

1.  **Identify Icon-Only Elements:** Traverse through the JSX/TSX files in `src/components`, `src/App.tsx`, and `src/pages`. Look for `<button>` elements, or `<a>` elements and `<div>`/`<span>` elements that have an `onClick` handler and contain only an `<img>`, `<svg>`, or a custom icon component, without accompanying text.
2.  **Add `aria-label`:** For each identified element, add an `aria-label` attribute that clearly describes the action the element performs.
    *   **Example 1:** `<button className="delete-btn"><TrashIcon /></button>` should become `<button aria-label="Delete item" className="delete-btn"><TrashIcon /></button>`.
    *   **Example 2:** `<a onClick={handleShare}><ShareIcon /></a>` should become `<a aria-label="Share item" onClick={handleShare}><ShareIcon /></a>`.
    *   **Example 3:** For a sign-out button with an icon, `aria-label="Sign out"`.
    *   **Example 4:** For an image upload button, `aria-label="Upload image"`.
3.  **Ensure Clarity:** The `aria-label` text should be concise but informative for a screen reader user, clearly conveying the element's purpose. Avoid redundant text if the icon already has `alt` text, but `aria-label` takes precedence for interactive elements.
4.  **Verification:** After modifications, ensure the application still functions correctly and no visual regressions are introduced.

## Summary of what changed

Added `aria-label` attributes to various icon-only buttons and interactive elements across the application to enhance accessibility for screen reader users.

## Changed files list

- `src/App.tsx` (if global buttons exist there)
- `src/components/**/*.tsx` (e.g., `src/components/NailItemCard.tsx`, `src/components/Navbar.tsx`, `src/components/ImageUpload.tsx`, etc.)
- `src/pages/**/*.tsx` (e.g., `src/pages/Home.tsx`, `src/pages/Stats.tsx`, etc.)

## Commands run and results

```bash
npm install # To ensure all dependencies are in place if the environment is new
npm run build
# Build should succeed without errors.
npm run lint
# Linting should pass without new warnings or errors.
```

## Known issues or limitations

No known issues. The changes are purely additive to accessibility attributes and should not affect visual presentation or functionality.

## Suggested next task

Add Vitest + unit tests for `src/lib/firestore.ts` helpers
```
