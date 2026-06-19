# iPhone Safari Camera Smoke Report Template (Issue #113)

> This is a focused smoke report template for iPhone Safari camera and upload behavior.
> Use this before completing the full [Commercial Launch QA Report](./COMMERCIAL_LAUNCH_QA_REPORT.md).

## 1. Environment Details
- **iPhone Model:** [e.g., iPhone 15 Pro]
- **iOS Version:** [e.g., 17.4.1]
- **Mode:** [Safari / PWA (Standalone)]
- **Orientation:** [Portrait / Landscape]
- **Tester:** [Name]
- **Date:** [YYYY-MM-DD]
- **URL/Commit:** [e.g., Production URL or SHA]

## 2. Smoke Test Checklist

| Test Case | Result | Notes / Evidence |
|---|---|---|
| **Camera Picker** | | |
| 「写真を撮る」 opens system camera | [Pass/Fail] | |
| Capture photo and confirm | [Pass/Fail] | |
| Picker cancel (no crash) | [Pass/Fail] | |
| **Upload Fallback** | | |
| 「画像を選択」 opens photo library/files | [Pass/Fail] | |
| Select existing photo | [Pass/Fail] | |
| **Preview & Edit** | | |
| Image preview renders correctly | [Pass/Fail] | |
| 「削除」(Remove) works | [Pass/Fail] | |
| 「変更」(Replace) with new capture works | [Pass/Fail] | |
| **Save & Persistence** | | |
| Add/Update item successfully | [Pass/Fail] | |
| Image is visible in list card | [Pass/Fail] | |
| **Post-Save Verification** | | |
| Opens correctly in Detail Viewer | [Pass/Fail] | |
| Visible in Comparison View | [Pass/Fail] | |
| Date/Time formatting (Japanese) | [Pass/Fail] | |

## 3. Failure Notes & Observations
- [List any UI glitches, layout shifts, or functional bugs here]

## 4. Final Verification
- [ ] Confirmed on real iPhone hardware.
- [ ] Upload fallback remains functional.
- [ ] Matches requirements in [IOS_CAPTURE_REQUIREMENTS.md](../product/IOS_CAPTURE_REQUIREMENTS.md).
