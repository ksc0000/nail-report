# iPhone Safari Camera Smoke Report Template (Issue #113)

> Focused smoke report template for iPhone Safari camera and upload behavior.
> Use this before completing the full [Commercial Launch QA Report](./COMMERCIAL_LAUNCH_QA_REPORT.md).

## 1. Environment Details

- **iPhone Model:** [e.g., iPhone 15 Pro]
- **iOS Version:** [e.g., 17.4.1]
- **Mode:** [Safari / PWA standalone]
- **Orientation:** [Portrait / Landscape]
- **Tester:** [Name]
- **Date:** [YYYY-MM-DD]
- **URL / Commit:** [Production URL or SHA]

## 2. Smoke Test Checklist

| Test Case | Result | Notes / Evidence |
|---|---|---|
| Camera button opens system camera/source picker | [Pass/Fail] | |
| Capture photo and confirm | [Pass/Fail] | |
| Picker cancel leaves form stable | [Pass/Fail] | |
| Album/upload fallback opens photo library/files | [Pass/Fail] | |
| Select existing photo | [Pass/Fail] | |
| Image preview renders correctly | [Pass/Fail] | |
| Remove selected image works | [Pass/Fail] | |
| Replace image with new capture works | [Pass/Fail] | |
| Add or update item successfully | [Pass/Fail] | |
| Image is visible in list card | [Pass/Fail] | |
| Saved item opens in detail viewer | [Pass/Fail] | |
| Saved item can be used in comparison view | [Pass/Fail] | |
| No horizontal overflow or hidden controls | [Pass/Fail] | |

## 3. Failure Notes

- [List UI glitches, layout shifts, permission issues, or functional bugs here]

## 4. Final Verification

- [ ] Confirmed on real iPhone hardware.
- [ ] Upload fallback remains functional.
- [ ] Matches [iOS Capture Requirements](../product/IOS_CAPTURE_REQUIREMENTS.md).
