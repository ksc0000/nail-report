# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Project Documents

### Product

| Document | Description |
|----------|-------------|
| [docs/product/PRODUCT_SPEC.md](docs/product/PRODUCT_SPEC.md) | Product vision, MVP scope, data model, open questions, future 3D/AR vision |
| [docs/product/ROADMAP.md](docs/product/ROADMAP.md) | Phase-by-phase development roadmap (Phase 0–9; Phase 8–9 cover 3D Preview / Modeling / AR Try-on — not yet implemented) |
| [docs/product/NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md](docs/product/NAIL_VIEW_CAMERA_FOUNDATION_PLAN.md) | Phase 4.5 plan for nail image detail, camera/upload foundation, comparison, annotation, and iOS readiness |
| [docs/product/CAMERA_CAPTURE_FLOW_PLAN.md](docs/product/CAMERA_CAPTURE_FLOW_PLAN.md) | Camera capture flow plan for web/PWA-first NailItem image capture |
| [docs/product/IOS_CAPTURE_REQUIREMENTS.md](docs/product/IOS_CAPTURE_REQUIREMENTS.md) | iOS Safari / PWA camera capture requirements and release gate |
| [docs/product/ACCEPTANCE_CRITERIA.md](docs/product/ACCEPTANCE_CRITERIA.md) | Definition of done for each task type (includes 3D / Modeling / AR criteria) |

### AI Harness

| Document | Description |
|----------|-------------|
| [docs/harness/WORKFLOW.md](docs/harness/WORKFLOW.md) | Standard AI-assisted development workflow |
| [docs/harness/HUMAN_GATES.md](docs/harness/HUMAN_GATES.md) | Conditions requiring human approval before AI proceeds |
| [docs/harness/MODEL_POLICY.md](docs/harness/MODEL_POLICY.md) | Model selection policy per agent role |
| [docs/harness/HUMAN_TASK_REQUEST.md](docs/harness/HUMAN_TASK_REQUEST.md) | Template for AI to request human input via GitHub Issue |

### Operations

| Document | Description |
|----------|-------------|
| [docs/operations/LOCAL_DEVELOPMENT_MANUAL.md](docs/operations/LOCAL_DEVELOPMENT_MANUAL.md) | Step-by-step local development guide including VS Code Tunnel |
| [docs/operations/COMMERCIAL_LAUNCH_QA_REPORT.md](docs/operations/COMMERCIAL_LAUNCH_QA_REPORT.md) | Reusable QA result template for Issue #113 commercial launch |
| [docs/operations/FIRESTORE_SECURITY_RULES.md](docs/operations/FIRESTORE_SECURITY_RULES.md) | Firestore Security Rules design, phase plan, and deploy checklist |
| [docs/operations/PUBLIC_SHARING_PRIVACY.md](docs/operations/PUBLIC_SHARING_PRIVACY.md) | Public share links, shared/excluded fields, revoke behavior, and privacy notes |
| [docs/operations/FIREBASE_SETUP.md](docs/operations/FIREBASE_SETUP.md) | Firebase Auth setup and verification steps |
| [docs/operations/FIREBASE_STORAGE_RULES.md](docs/operations/FIREBASE_STORAGE_RULES.md) | Storage Security Rules design, allowed types/sizes, and deploy checklist |
| [docs/operations/IMAGE_UPLOAD_QA.md](docs/operations/IMAGE_UPLOAD_QA.md) | QA checklist for image upload — normal, error, edit, delete, and pre-merge checks |

### Design References

| Document | Description |
|----------|-------------|
| [docs/design-references/nail-view-prototype/README.md](docs/design-references/nail-view-prototype/README.md) | Nail view UI prototype — color palette, layout, and component styles for reference only |
