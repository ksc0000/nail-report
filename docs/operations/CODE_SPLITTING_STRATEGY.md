# Code Splitting Strategy

This document outlines the strategy for optimizing the application's bundle size and addressing the 500KB+ chunk warning.

## Current Analysis

The application currently exceeds the recommended 500KB chunk size. The primary contributors are:
- **`App.tsx`**: Currently serves as a monolith containing most of the application logic and routing.
- **Firebase SDK**: A heavy dependency that is bundled into the main entry point.

For more context on why this was initially accepted for the MVP, see [BUNDLE_SIZE_WARNING_ACCEPTANCE.md](./BUNDLE_SIZE_WARNING_ACCEPTANCE.md).

## Strategy

### 1. Route-level Code Splitting
Implement `React.lazy` combined with `Suspense` to split the application into separate chunks for each route. This ensures that users only download the code relevant to their current view.

**Primary Targets:**
- `PrivacyPolicyPage.tsx`
- `TermsOfServicePage.tsx`
- Public Share page logic (should be extracted from `App.tsx` into a dedicated component)

### 2. Component-level Dynamic Imports
Heavy components that are conditionally rendered should use dynamic imports to keep the initial load light.

**Primary Targets:**
- `NailComparisonPanel.tsx`: Only loaded when the comparison feature is active.
- `NailImageDetailViewer.tsx`: Only loaded when viewing specific nail details.
- **Future 3D Preview Components**: Essential for Phase 8/9 to avoid bloat.

### 3. Build Configuration
Leverage Vite's built-in code splitting capabilities (via Rolldown). If manual chunking is necessary for vendor dependencies, it should be configured in `vite.config.ts`.

Example configuration:
```typescript
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },
  },
})
```

## Implementation Roadmap

1. **Extraction**: Move route-specific logic out of `App.tsx` into separate page components.
2. **Lazy Loading**: Apply `React.lazy` to the newly created page components.
3. **Dynamic Components**: Refactor heavy UI components to use dynamic `import()`.
4. **Verification**: Monitor bundle size via `npm run build` to ensure chunks stay below the 500KB threshold.
