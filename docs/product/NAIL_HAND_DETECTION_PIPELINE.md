# Nail/Hand Detection Pipeline Design

> This document defines the architecture and pipeline for detecting hands and nails from user-uploaded or captured images. It is part of the Phase 4.5 Foundation and serves as the technical blueprint for implementation in Phase 8 (3D Preview) and Phase 9 (AR Try-on).
> This is a design document. No code changes are made by this plan.

---

## 1. Goals

- Define a privacy-first approach to detecting hands and nails in images.
- Establish the pipeline from image capture to bounding box extraction.
- Prepare the data model for saving detected regions.
- Ensure the solution scales to future AR (real-time video overlay) requirements.

## 2. Non-Goals

- Implementing the AI logic or AR try-on in this phase.
- Cloud-based image analysis for hand detection (Cloud Vision API / Vertex AI). This plan focuses entirely on client-side processing for privacy and latency reasons.

---

## 3. Architecture & Technology Choice

### Client-Side Processing (Recommended)
To ensure user privacy and to provide real-time performance suitable for future AR applications, we will use **client-side processing (On-Device ML)**.

- **Library**: `MediaPipe Tasks Vision` (Web)
- **Model**: Hand Landmark Detection
- **Why**: 
  - **Privacy**: Images never leave the device for analysis, alleviating major privacy concerns with personal photos.
  - **Latency**: Zero network latency; crucial for future real-time AR camera feeds.
  - **Cost**: No backend AI API costs.
  - **Accuracy**: MediaPipe Hands provides 21 3D landmarks, which is sufficient to infer the fingertips and nail beds.

### Server-Side Processing (Discarded for Detection)
Using Cloud Vision or Vertex AI for *detection* introduces latency, costs, and privacy friction. 
*Note: Server-side AI may still be used later strictly for "Tag Suggestion" (e.g., color analysis) via an explicit opt-in, but it is not used for geometric detection.*

---

## 4. Pipeline Flow

1. **Image Capture / Upload**
   - User captures a photo via `<input capture="environment">` or selects an image.
   - The browser loads the image into a local `Blob` or `HTMLImageElement`.
2. **Model Lazy Loading**
   - To prevent bloating the initial Vite bundle, the `MediaPipe` WebAssembly and Model files (~few MBs) are downloaded **only when** the image input flow is triggered.
3. **Detection (In-Browser)**
   - The image is passed to `HandLandmarker.detect()`.
   - The model returns 21 landmarks per detected hand.
4. **Bounding Box Extraction**
   - Using specific landmarks (e.g., `INDEX_FINGER_TIP`, `INDEX_FINGER_DIP`), the app calculates an estimated bounding box and polygon for each nail.
5. **UI Feedback**
   - The preview screen draws SVG or Canvas overlays (e.g., glowing boxes around the nails) to show the user what was detected.
   - User can manually adjust or confirm the detection (Manual Annotation fallback).
6. **Persistence**
   - The original image is uploaded to Firebase Storage.
   - The extracted bounding box coordinates are saved to Firestore within the `NailItem` document.

---

## 5. Data Modeling

To store the detection results, we will expand the `NailItem` schema in the future.

```typescript
interface DetectedRegion {
  label: "thumb" | "index" | "middle" | "ring" | "pinky" | "unknown";
  confidence: number;
  boundingBox: {
    xMin: number;
    yMin: number;
    width: number;
    height: number;
  };
  landmarks?: Array<{x: number, y: number, z: number}>; // Optional 3D points
}

// Added to NailItem:
interface NailItem {
  // ... existing fields ...
  detectedRegions?: DetectedRegion[];
  manualRegions?: DetectedRegion[]; // If user manually overrides
}
```

---

## 6. Privacy and Performance Considerations

### Privacy
- The detection runs 100% in the user's browser.
- A disclaimer should be added near the camera button: "画像認識はデバイス上で行われます。同意なしに画像がAIサーバーに送信されることはありません。"

### Performance & Bundle Size
- The MediaPipe library must be code-split using dynamic `import()`.
- The WebAssembly files should be served from a CDN (e.g., `jsdelivr` or `unpkg`) or placed in the `public/` directory and aggressively cached by the browser to ensure the app loads instantly.
- The heavy image processing should not block the main React render thread (consider using a Web Worker if processing large images, though MediaPipe is highly optimized).

---

## 7. Next Steps (Implementation Slices)

When we move to implementation (Phase 8/9):
1. **Spike**: Implement a standalone React component that loads `MediaPipe` and draws dots on a static hand image.
2. **Integration**: Wire the spike component into the existing `App.tsx` preview flow.
3. **Data**: Update `firestoreModel.ts` to accept and save `detectedRegions`.
4. **UX**: Add a loading state ("爪を検出中...") during the lazy load and processing phase.
