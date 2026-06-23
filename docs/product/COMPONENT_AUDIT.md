# Component Audit: Nailous (Jewelry Box Migration Phase 1)

This document lists existing components and identifies logical sections within `App.tsx` that are candidates for extraction as part of the transition to the Jewelry Box concept.

## 1. Existing Components (`src/components/`)

These components are already extracted and reside in the `src/components/` directory.

| Component | Responsibility | Key Features |
| :--- | :--- | :--- |
| `ErrorBanner` | Global/Contextual error display | Dismissible, ARIA alert role. |
| `NailComparisonPanel` | Side-by-side item comparison | Date-based sorting (Before/After), selection logic. |
| `NailImageDetailViewer` | Item detail view & "Floating Charm" | Focus trap, ESC key handling, floating animation. |
| `PrivacyPolicyPage` | Privacy Policy content | Static content, no-index meta, manual routing support. |
| `TermsOfServicePage` | Terms of Service content | Static content, no-index meta, manual routing support. |

## 2. `App.tsx` Logical Sections

The current `App.tsx` is a monolith managing several distinct UI areas and their associated states.

| Section | Responsibility | Current State/Logic Dependency |
| :--- | :--- | :--- |
| **Landing Page** | Unauthenticated hero view | `handleSignIn`, showcase animation CSS. |
| **Auth Bar** | User status & Data Management trigger | `user`, `handleSignOut`, `setIsDataModalOpen`. |
| **Nail Studio Hero** | Contextual header & Item count | `nailItems.length`. |
| **Nail Form** | Add/Edit item interface | `nailTitle`, `nailTags`, `nailMemo`, `nailImageFile`, `handleGenerateTagsWithAI`. |
| **Nail Summary** | Statistics & Quick Filters | `getNailSummary`, `activeTagFilter`, `activeMonthFilter`. |
| **Share Management** | Public link creation & Management | `createPublicShare`, `publicShares`, `handleDisableShare`. |
| **Nail List & Search** | Item grid & Filtering | `searchQuery`, `filteredItems`, `handleToggleComparisonItem`. |
| **Data Management Modal** | Data ownership info & Export | `isDataModalOpen`, `downloadTextFile`, legal links. |
| **Public Share View** | Read-only shared collection view | `publicShareState`, `publicShare`. |

## 3. Candidates for Extraction

The following sections are identified as high-priority candidates for extraction to improve maintainability and support the Jewelry Box design refresh.

### High Priority
- **`LandingPage`**: Contains significant markup and localized "charm showcase" animation. Extraction will clean up the unauthenticated path in `App.tsx`.
- **`NailForm`**: Manages complex file input state, AI utility calls, and validation. Moving this to a component will simplify the main application logic.
- **`PublicShareView`**: This is essentially a separate page. Extracting it will clarify the routing logic and reduce the weight of `App.tsx`.

### Medium Priority
- **`NailSummary`**: Mostly presentational but has derived statistics logic.
- **`ShareManagement`**: Encapsulates a specific set of Firebase interactions (Public Shares).
- **`NailList` / `NailCard`**: Splitting the list and individual cards will make the grid more manageable and reusable for comparison views or search results.
- **`DataManagementModal`**: Can be a standalone modal component similar to `NailImageDetailViewer`.

### Low Priority (Future)
- **`AuthBar`**: Small enough to stay in `App.tsx` for now, but could be part of a `Header` component later.
- **`Footer`**: Already exists as a local function `renderFooter`, could be moved to a file.

---
*Next Steps: These extractions will be performed in subsequent tasks as part of the Phase 1 refactoring roadmap.*
