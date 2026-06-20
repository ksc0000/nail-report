# 3D Asset Delivery Strategy

This document outlines the strategy for hosting and delivering 3D nail models for **Phase 8 (3D Preview / Modeling Foundation)** and **Phase 9 (AR Try-on / Advanced Modeling)**.

---

## 1. Supported Formats

To ensure cross-platform compatibility and high performance, the following formats are adopted:

| Format | Purpose | Target Environment |
|---|---|---|
| **GLB (glTF Binary)** | Primary 3D format for web-based rendering. | Web (model-viewer, Three.js, React Three Fiber) |
| **USDZ** | Required for high-quality AR Quick Look. | iOS Native AR / Safari AR |

**Note:** GLB is preferred for its self-contained nature (embedded textures/buffers), which simplifies delivery compared to multi-file GLTF.

---

## 2. Firebase Storage Directory Structure

3D assets are stored under a dedicated `assets/3d/` root to separate them from user-uploaded photos.

```text
assets/3d/
├── models/
│   ├── shapes/          # Base nail shapes (e.g., round.glb, square.glb)
│   ├── decorations/     # 3D parts (e.g., stones, charms)
│   └── presets/         # Pre-configured full-nail designs
├── textures/
│   ├── materials/       # Generic textures (e.g., matte, gloss, glitter maps)
│   └── custom/          # High-resolution custom nail art textures
└── thumbnails/          # 2D preview images for the 3D model selector
```

---

## 3. File Size & Optimization

To maintain a fast mobile experience, strict limits and optimization steps are enforced:

- **Target Size:** < 1MB per model.
- **Hard Limit:** 3MB per model.
- **Geometry:** Low-poly models (ideally < 10k triangles per nail).
- **Textures:** Max 1024x1024 resolution. Use JPEG or Basis Universal (KTX2) for compression.
- **Compression:** All GLB files should be optimized using `gltf-transform` or `gltf-pipeline` (using Draco or Meshopt compression).

---

## 4. Caching & Delivery Strategy

Efficient delivery is critical for 3D assets due to their file size.

- **CDN:** Leverage Firebase Hosting/Storage's global CDN for low-latency delivery.
- **Caching Headers:**
    - Static assets (shapes, materials): `Cache-Control: public, max-age=31536000, immutable`.
    - Assets are versioned (e.g., `almond_v1.glb`) to allow for permanent caching.
- **Preloading:** The app should preload base shapes during the "Loading" state of the 3D Preview screen to minimize perceived latency.

---

## 5. Licensing & Placeholder Assets

During early Phase 8 development, placeholder models may be used.

- **Preferred Licenses:**
    - **CC0 (Public Domain):** No attribution required, most flexible.
    - **MIT:** Common for code-adjacent assets.
    - **CC-BY:** Permitted if an "Attribution" or "Credits" screen is added to the app.
- **Exclusions:** Do not use assets with `NC` (Non-Commercial) or `ND` (No-Derivatives) restrictions without legal review.
- **Documentation:** All third-party assets must have their license and source URL recorded in an `assets/3d/LICENSE_CREDITS.md` file (to be created when assets are added).

---

## 6. Security Considerations

- **Access Control:** `assets/3d/` will be `allow read: if true;` to allow public previewing of shared designs, while write access is restricted to admin/deployment scripts.
- **CORS:** Ensure Firebase Storage CORS configuration allows requests from the application's production and development domains.

---

## 7. Future Integration (Phase 8/9)

The Firestore `NailItem` schema will be extended to link to these assets:

```typescript
// Proposed addition to NailItemDoc
{
  modelId: string;    // e.g., "shapes/almond_v1"
  materialId: string; // e.g., "materials/gloss_pink_01"
  customTextureUrl?: string; // For user-generated art
}
```
