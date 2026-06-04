# Phase 4.5 Nail View / Camera Smoke Test

> This report documents integrated smoke-test results and non-functional gaps for Phase 4.5 Nail View / Camera Foundation.
> It is a testing/documentation artifact only. It does not change application behavior, Firestore Rules, Storage Rules, data model, dependencies, or deployment.

---

## 1. Purpose

This report verifies the current Phase 4.5 feature set together:

- Nail image detail viewer
- Nail image comparison view
- Browser camera capture option
- Existing upload/edit/delete/share behavior

The goal is to document what works, what remains unverified, and what should be improved before moving deeper into camera capture, AI detection, or iOS readiness work.

---

## 2. Current Expected Behavior

### Detail Viewer

- NailItem list renders for an authenticated user.
- 「詳しく見る」 appears on NailItem cards.
- Detail dialog opens.
- Large image is visible.
- Title, tags, memo, createdAt, and updatedAt are visible.
- Close button works.
- Backdrop click closes.
- Escape closes.
- Item without image shows 「画像なし」 if test data exists.

### Comparison View

- 「比較に追加」 appears on NailItem cards.
- Selecting one item shows 「比較するネイルをもう1つ選択してください」.
- Selecting two items shows the comparison panel.
- Both images and metadata are visible.
- Selecting the same item again removes it from comparison.
- Selecting a third item replaces the oldest selected item.
- 「比較をクリア」 works.
- Detail, edit, delete, and share remain unchanged.

### Camera Capture Option

- Existing 「画像を選択」 remains.
- New 「写真を撮る」 appears.
- Camera input has `accept="image/*"` and `capture="environment"`.
- Upload input still works.
- Fallback note is visible: 「カメラが使えない場合は画像を選択してください。」
- Preview works after selecting or capturing an image.
- Saving item works if safe to test.

---

## 3. Test Environments

### Desktop Normal Browser

Not completed in this Codex run because authenticated Firebase sign-in could not be completed in the available browser environment.

Recommended for follow-up:

- Use a normal desktop browser with valid local Firebase configuration.
- Sign in with a dev Google user.
- Use existing dev NailItems where possible.
- Do not create production-like data.

### Mobile Responsive Viewport

Not tested in this run. The current CSS includes mobile-specific rules for the detail dialog and comparison grid, but visual/touch behavior still needs browser verification.

### iPhone Safari Real Device

Not tested in this run. This is required before claiming iOS/PWA readiness, especially for the camera capture picker and permission flow.

### Android Chrome Real Device

Not tested in this run. This should be used to compare mobile capture behavior against iPhone Safari.

### Codex / In-App Browser Limitations

The Codex In-App Browser can render the unauthenticated app, but authenticated smoke testing is blocked by local Firebase Auth behavior. The browser console still shows Firebase `auth/invalid-api-key`, and single-tab popup behavior may prevent `signInWithPopup` from returning authenticated state to the local app.

---

## 4. Known Auth / Local Environment Issues

- Local Firebase Auth may fail with `auth/invalid-api-key`.
- Codex In-App Browser single-tab mode may not complete Firebase `signInWithPopup`.
- `.env.local` must contain valid Firebase Web app config.
- `.env.local` must remain ignored by git.
- Normal browser testing is preferred for authenticated smoke.
- Mobile/iOS smoke needs real devices where possible.

Observed in this run:

- `.env.local` exists.
- `.env.local` is ignored by `.gitignore:13:*.local`.
- Unauthenticated app render passed.
- Authenticated flow was blocked by Firebase `auth/invalid-api-key` in the Codex browser console.

---

## 5. Functional Smoke Checklist

| Test case | Environment | Result | Notes |
|---|---|---:|---|
| Unauthenticated render | Codex In-App Browser, `http://127.0.0.1:5173/` | PASS | `Nailous` heading and `Sign in with Google` button rendered. |
| Google login | Codex In-App Browser | BLOCKED | Firebase `auth/invalid-api-key` appeared in console; popup flow is not reliable in this environment. |
| Authenticated app render | Codex In-App Browser | BLOCKED | Requires successful Google login. |
| NailItem list render | Codex In-App Browser | BLOCKED | Requires authenticated state and existing/dev data. |
| Detail viewer open/close | Codex In-App Browser | BLOCKED | Requires authenticated NailItem cards. Static code presence confirmed. |
| Comparison select one/two/clear | Codex In-App Browser | BLOCKED | Requires authenticated NailItem cards. Static code presence confirmed. |
| Upload option visible | Static source check | PASS | 「画像を選択」 exists in `src/App.tsx`. |
| Camera option visible | Static source check | PASS | 「写真を撮る」 exists in `src/App.tsx`. |
| Camera input attributes | Static source check | PASS | Camera input uses `accept="image/*"` and `capture="environment"`. |
| iPhone Safari camera picker | Real device | NOT TESTED | Requires real iPhone Safari or PWA device test. |
| Android Chrome camera picker | Real device | NOT TESTED | Requires real Android Chrome device test. |
| Preview after image selection | Codex In-App Browser | BLOCKED | Form is behind authenticated state. |
| Existing edit/delete/share sanity | Codex In-App Browser | BLOCKED | Requires authenticated state. |
| Console errors | Codex In-App Browser | BLOCKED | Firebase `auth/invalid-api-key` is still present; no deeper app smoke possible. |

---

## 6. Non-Functional Review

### UX Quality

- The app has moved beyond simple image registration by adding detail and comparison views.
- The experience is more nail-specific than before, but the capture flow is still a browser file input rather than a polished camera experience.
- Detail and comparison are useful foundations, especially for reviewing past designs.
- Labels are understandable and mostly Japanese-first in the new Phase 4.5 areas.
- The current camera affordance is clear but still depends heavily on browser-native picker behavior.

### Mobile Readiness

- Detail dialog CSS constrains dialog height and image size for small viewports.
- Comparison cards stack vertically on mobile.
- Camera and upload inputs are flex-wrapped to avoid obvious horizontal overflow.
- Touch target quality and real mobile ergonomics have not been verified.
- Mobile image scaling needs real viewport/browser smoke.
- Comparison panel may need polish if item metadata is long.

### iOS Readiness

- iPhone Safari camera behavior is not verified.
- Camera permission copy and failure states are not yet polished in the UI.
- `capture="environment"` is a low-risk start, but Safari may show camera/library choices differently by version and install mode.
- PWA behavior is still unknown.
- Native iOS implications remain future work.

### Performance

- Large images may affect rendering, preview latency, and memory use.
- Detail and comparison can show multiple large images at once.
- Existing Vite build emits a large chunk warning.
- Perceived load after authentication was not tested in this run.
- Image loading states are minimal.

### Accessibility

- Detail dialog has `role="dialog"`, `aria-modal`, a heading label, close button, Escape close, and alt text.
- Comparison panel has a heading and `aria-labelledby`.
- Buttons use clear text labels.
- Focus behavior inside the detail dialog exists but has not been fully audited.
- Camera/upload inputs use visible label text.
- There is no known keyboard trap, but authenticated keyboard smoke is still needed.

### Privacy / Security

- Nail photos are personal data.
- No external AI upload exists yet.
- Private NailItems continue to use the owner-only data model.
- Camera capture does not add `imageSource`, `capturedAt`, EXIF extraction, or extra metadata.
- Camera permission is not requested on page load because the MVP uses user-triggered file input capture.
- Public sharing remains unchanged and still excludes memo/image data.

### Maintainability

- `src/App.tsx` is now about 1,287 lines.
- `src/App.css` is now about 1,366 lines.
- Phase 4.5 features are still contained in the main app component and stylesheet.
- Component extraction is becoming more attractive for detail viewer, comparison panel, share management, and image input.
- CSS organization may become harder to maintain as more camera/annotation work is added.

---

## 7. Gap Summary

### Must Fix Before iOS Release

- Actual mobile/iOS camera smoke coverage.
- Camera permission UX clarity.
- Mobile detail/comparison usability.
- Privacy wording around camera/photos.
- Error states for capture/upload failures.
- Normal-browser authenticated smoke coverage that is not blocked by local auth issues.

### Should Improve Soon

- Component extraction from `src/App.tsx`.
- Better empty/no-image states.
- Improved mobile visual polish.
- Clearer comparison UX for long metadata and small screens.
- Image loading state.
- Better camera/upload source explanation in the form.

### Later

- `imageSource`.
- `capturedAt`.
- Manual annotation.
- AI tag suggestion.
- Nail/hand detection.
- AR try-on.
- Native iOS implementation.

---

## 8. Recommendation

The current Phase 4.5 implementation is acceptable as a foundation, not as a finished nail-specific mobile camera experience.

Recommended next step:

```text
test: run mobile camera smoke test on real devices
```

Reasoning:

- The biggest remaining unknown is real-device behavior, especially iPhone Safari and Android Chrome camera picker behavior.
- Further camera or iOS work should be grounded in actual mobile smoke results.
- A mobile test pass should happen before adding `imageSource`, custom `getUserMedia`, manual annotation, or AI/detection work.

Other good follow-up options:

- `refactor: extract nail view components`
- `feature: add imageSource for upload/camera distinction`
- `design: plan manual nail annotation prototype`
