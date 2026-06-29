# Worker Prompt

## Context

The `nail-report` application is currently in Phase 2, focusing on improving stability, test coverage, and user experience (UX). A critical aspect of UX improvement is accessibility, ensuring the application is usable by a wider range of users, including those relying on screen readers. This task specifically addresses enhancing the accessibility of interactive elements.

## Objective

Enhance the application's accessibility by identifying all buttons that display only an icon (i.e., icon-only buttons) throughout the UI and adding an appropriate, descriptive `aria-label` attribute to each of them. This will provide screen reader users with meaningful context about the button's function.

## Allowed Scope

- Any `.tsx` or `.ts` files within `src/` (excluding `src/main.tsx`) where icon-only buttons are defined. This will primarily involve modifying existing component files to add the `aria-label` attribute.
- `src/App.css` for minor styling adjustments if absolutely necessary, but it is unlikely to be required for this specific task.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- **Identify all `<button>` elements that visually contain only an icon** and do not have accompanying visible text (e.g., a button with an `<i>` or `<svg>` element inside, but no text content).
- **Add an `aria-label` attribute** to each identified icon-only button element.
- The `aria-label` text must be **concise, accurate, and descriptive of the button's specific action or purpose** (e.g., "Delete nail item", "Edit tag", "Upload image", "Go back", "Sign out").
- Ensure the application remains fully functional, visually consistent, and responsive after the changes.
- Run `npm run build && npm run lint` before finishing and confirm that there are no new errors or warnings.

## Output Format

- Summary of what changed (e.g., "Added aria-labels to 7 icon-only buttons across various components.")
- Changed files list (e.g., `src/components/NailItemCard.tsx`, `src/components/Header.tsx`, `src/App.tsx`)
- Commands run and results (e.g., output from `npm run build`, `npm run lint`)
- Known
