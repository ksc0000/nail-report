# Camera Capture Flow Plan

> This document plans a future camera capture flow for Phase 4.5 Nail View / Camera Foundation.
> It is docs-only and does not implement camera capture, schema changes, Firestore Rules, Storage Rules, dependencies, or deployment.

---

## 1. Background

The current app supports:

- NailItem CRUD
- image upload
- authenticated owner data
- image detail viewer
- image comparison view

Camera capture is the next foundation step toward iOS and PWA readiness. The product now has better surfaces for reviewing images, but capture still relies on ordinary upload behavior.

Full nail detection, AI image analysis, AR try-on, and native iOS implementation remain out of scope for this design task.

---

## 2. Goals

- Define the intended camera capture UX.
- Clarify how camera capture relates to existing image upload.
- Prepare for future AI tag suggestion and nail/hand detection.
- Avoid premature native iOS, AR, or custom ML implementation.
- Keep the first implementation slice small, reversible, and testable.
- Preserve the existing NailItem create/edit and upload path as the fallback.

---

## 3. Non-Goals

- No AR try-on implementation.
- No AI nail detection implementation.
- No native iOS app implementation.
- No new backend service.
- No external AI API integration.
- No Firestore Rules changes in this design task.
- No Storage Rules changes in this design task.
- No direct camera code in this design task.
- No data model change in this design task.

---

## 4. MVP User Flow Proposal

Recommended web-first flow:

1. In the NailItem create/edit form, the user chooses either upload image or capture from camera.
2. Camera capture is always user-initiated.
3. The browser shows its camera or photo-source permission UI.
4. The user captures or selects an image.
5. The app shows a preview using the same preview area as ordinary upload where feasible.
6. The user can retake, choose another file, remove the image, or save the NailItem.
7. The selected photo follows the existing Firebase Storage upload path if feasible.
8. If camera is unavailable, permission is denied, or capture fails, the user can fall back to upload.

The first implementation should avoid a full custom camera interface unless the browser file-input capture path is insufficient.

---

## 5. iOS / PWA Considerations

Safari and iOS behavior can differ from desktop browsers:

- iOS camera access must be user-initiated.
- Permission prompts may appear as system UI.
- Users may be offered camera, photo library, or file choices depending on the input configuration.
- PWA-installed Safari behavior should be smoke-tested separately from ordinary Safari if PWA is a target.

Two implementation options:

```text
<input type="file" accept="image/*" capture="environment">
```

- Lower risk.
- Works through the browser file picker/camera source.
- Reuses much of the existing upload flow.
- Provides less control over live preview and retake UI.
- Browser behavior varies by device.

```text
navigator.mediaDevices.getUserMedia(...)
```

- Enables custom live camera preview.
- Can support explicit retake UX.
- Requires more browser permission handling.
- Requires more careful cleanup of media streams.
- Has higher mobile-browser compatibility and privacy risk.

Recommended MVP approach:

- Start with file input plus `accept="image/*"` and `capture="environment"` if device behavior is acceptable.
- Keep ordinary upload as a visible fallback.
- Defer custom `getUserMedia` preview UI until browser capture is proven insufficient.

Future native iOS implications:

- Native camera permission copy and App Store privacy labels will need review.
- Native camera capture may eventually replace or supplement web capture.
- Data model and privacy decisions should remain compatible with both web/PWA and native flows.

---

## 6. Data Model Considerations

Potential future fields, not implemented here:

```text
imageSource: "upload" | "camera" | "unknown"
capturedAt: Timestamp | null
imageMetadata: {
  width?: number
  height?: number
}
cameraFacingMode: "environment" | "user" | "unknown"
manualRegions: Array<...>
detectedRegions: Array<...>
analysis: {
  status?: "none" | "pending" | "complete" | "failed"
}
suggestedTags: string[]
```

Recommended MVP data model decision:

- Prefer no schema change for the first camera capture UI if the app can treat captured images like uploaded images.
- Add `imageSource` only in a separate implementation issue after compatibility, Firestore Rules, export, and privacy review.

Tradeoffs:

- No schema change keeps CAM-1 smaller and safer.
- Without `imageSource`, analytics and future detection tuning cannot distinguish upload from camera capture.
- Adding `imageSource` helps future AI/detection workflows, but it expands Firestore validation, migration, export, and UI fallback work.

---

## 7. Privacy And Security

- Nail photos are personal data.
- Camera access must be explicit and user-initiated.
- Do not request camera permission on page load.
- Do not send images to external AI services without a separate future opt-in design.
- Keep the existing owner-only access model for private NailItems.
- Keep Firebase Storage validation constraints for type and size.
- Do not store unnecessary camera metadata by default.
- Avoid collecting device, location, EXIF, or sensor metadata unless there is a clear user-facing need.
- Do not put API keys or secrets in client code.

---

## 8. UX States

Future implementation should handle:

- camera available
- permission denied
- permission dismissed
- unsupported browser
- capture success
- retake
- upload fallback
- image too large
- unsupported file type
- offline state
- upload failure

Suggested UX stance:

- Keep fallback upload visible and calm.
- Explain permission problems without blaming the user.
- Reuse existing file validation messages where possible.
- Do not block ordinary NailItem creation when camera capture is unavailable.

---

## 9. Implementation Slices

### CAM-1: Browser Capture Option MVP

- Add camera/upload choice to the existing image input area.
- Likely use file input with `capture` attribute.
- Reuse existing preview, validation, and upload path.
- Prefer no data model change.

### CAM-2: Add imageSource Field Design / Implementation

- Add only if CAM-1 proves the product needs source tracking.
- Requires Firestore compatibility review.
- Requires export and UI fallback decisions.

### CAM-3: Camera Capture Smoke Test Docs

- Normal browser smoke test.
- iOS Safari smoke test.
- Android Chrome smoke test.
- Desktop browser upload fallback test.

### CAM-4: Custom Camera Preview Prototype

- Optional.
- Use `getUserMedia`.
- Only pursue if file input/capture is insufficient.
- Must include media stream cleanup and permission-state handling.

### CAM-5: Nail Detection Pipeline Design

- Future AI/ML pipeline.
- Consider inputs from both camera and upload.
- Keep external image processing opt-in and separately approved.

---

## 10. Validation Plan For Future Implementation

```text
[ ] npm run build
[ ] npm run lint
[ ] git diff --check
[ ] CSS guard if available
[ ] normal browser smoke test
[ ] mobile viewport smoke test
[ ] iOS Safari smoke test if available
[ ] Android Chrome smoke test if available
[ ] authenticated user test
[ ] upload fallback test
[ ] no Firebase deploy unless rules/config changed
```

Additional camera checks:

```text
[ ] camera permission is requested only after user action
[ ] permission denied state is readable
[ ] permission dismissed state is readable
[ ] unsupported browser fallback is readable
[ ] retake or choose-another-image behavior is clear
[ ] existing upload flow still works
[ ] browser console has no new relevant errors
```

---

## 11. Human Decisions Needed

- Web-first/PWA-first vs native-iOS-first.
- File input capture vs custom `getUserMedia`.
- Whether to add `imageSource` in MVP.
- Whether to track `capturedAt`.
- Whether a camera image replaces or coexists with an uploaded image.
- Which mobile devices are target smoke-test devices.
- Whether future AI image processing will be opt-in.

---

## Recommended Direction

Start with CAM-1: Browser Capture Option MVP.

Use the browser file input/capture path first if device behavior is acceptable. Keep the existing upload flow as the fallback and avoid a data model change in the first implementation. Revisit `imageSource` and custom `getUserMedia` only after a small, device-tested capture slice proves what the product actually needs.
