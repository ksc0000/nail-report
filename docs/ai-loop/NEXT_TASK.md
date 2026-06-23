```markdown
# Worker Prompt Template

## Context

The AI Loop is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task addresses "2.3 Loading states" by adding a loading skeleton to improve the user experience during data fetching.

## Objective

Implement a simple loading skeleton for the nail item list displayed in `src/App.tsx`. The skeleton should appear while the list data is being fetched, providing a visual cue to the user that content is loading.

## Allowed Scope

- `src/App.tsx` (for implementing the skeleton logic and rendering)
- `src/App.css` (for styling the loading skeleton)
- Any new component files within `src/components/` if deemed necessary for the skeleton UI (e.g., `src/components/NailItemSkeleton.tsx`), though a simple direct implementation in `App.tsx` is preferred if possible.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- The skeleton should replace the existing nail item list when data is loading.
- Implement a basic `isLoading` state within `App.tsx` if one doesn't already exist to simulate data fetching.
- The skeleton should mimic the visual structure of one or more nail item cards (e.g., a few grey rectangles representing image, title, and tags).
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files. (Not applicable for this UI task)
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement a loading skeleton for the nail item list in `src/App.tsx`.

1.  **Locate the nail item list rendering:** Identify where the `nailItems` are mapped and rendered in `src/App.tsx`.
2.  **Introduce a loading state:** If not already present, add a local `isLoading` state variable using `useState` in `App.tsx`. Set its initial value to `true` and update it to `false` after a simulated delay (e.g., using `setTimeout` for 1-2 seconds) to represent data fetching completion.
3.  **Conditional Rendering:** When `isLoading` is `true`, render a placeholder skeleton UI. When `isLoading` is `false`, render the actual `nailItems` list.
4.  **Design the Skeleton:** Create a simple skeleton structure. For example, render 3-5 `div` elements, each representing a "loading" nail item. These divs should have basic dimensions and a grey background.
5.  **Apply CSS:** Add corresponding CSS classes and styles to `src/App.css` to give the skeleton elements their visual appearance (e.g., `background-color`, `height`, `width`, `border-radius` to mimic cards).

**Acceptance Criteria:**
*   When the application loads, a skeleton UI is visible for a short duration (e.g., 1-2 seconds) where the nail item list would normally appear.
*   After the simulated loading period, the actual nail item list is displayed.
*   No new npm packages are added.
*   The diff size is within the 150-line limit.

**Required Test Commands:**
```bash
npm run build
npm run lint
```
```
