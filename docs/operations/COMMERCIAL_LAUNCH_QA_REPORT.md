# Commercial Launch QA Report (Issue #113)

This report template is for recording the QA results for the commercial launch of Nailous (Issue #113).
Copy this template into a new PR or issue comment when performing QA.

## QA Environment
- **Planned production URL:** https://nailous-prod.web.app
- **Custom domain:** Deferred for the commercial MVP initial release unless a human operator acquires and verifies a Nailous domain before go/no-go.
- **Tested URL:** [Actual production or approved preview URL]
- **Tester:** [Name]
- **Date:** [YYYY-MM-DD]
- **Build/Commit:** [SHA or version]

## 1. Desktop (Chrome/Safari)
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Initial Load | [Pass/Fail] | |
| Layout & Responsiveness | [Pass/Fail] | |

## 2. Mobile Safari
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Layout & Touch Interaction | [Pass/Fail] | |
| Camera/Upload Trigger | [Pass/Fail] | |

## 3. Authentication (Google Auth)
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Sign-in | [Pass/Fail] | |
| Sign-out | [Pass/Fail] | |
| Persistence after refresh | [Pass/Fail] | |

## 4. Nail CRUD
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Create Item | [Pass/Fail] | |
| Edit Item | [Pass/Fail] | |
| Delete Item | [Pass/Fail] | |
| Search/Filter | [Pass/Fail] | |

## 5. Image Upload
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Upload JPEG/PNG/WebP | [Pass/Fail] | |
| Image Preview | [Pass/Fail] | |
| Max size (5MB) enforcement | [Pass/Fail] | |

## 6. Public Share
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Create Share Link | [Pass/Fail] | |
| View Share Link (Incognito) | [Pass/Fail] | |
| Revoke Share Link | [Pass/Fail] | |

## 7. Privacy & Terms
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Privacy Policy Page | [Pass/Fail] | |
| Terms of Service Page | [Pass/Fail] | |
| No-index meta tag present | [Pass/Fail] | |

## 8. Export & Data Management
| Test Case | Result | Evidence/Notes |
|---|---|---|
| CSV Export | [Pass/Fail] | |
| JSON Export | [Pass/Fail] | |
| Data Management Modal | [Pass/Fail] | |

## 9. Data Deletion
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Delete individual items | [Pass/Fail] | |
| Verify Firestore cleanup | [Pass/Fail] | |
| Contact for account deletion | [Pass/Fail] | |

## 10. Production Smoke Test
Refer to [PRODUCTION_SMOKE_TEST_CHECKLIST.md](./PRODUCTION_SMOKE_TEST_CHECKLIST.md).

| Test Case | Result | Evidence/Notes |
|---|---|---|
| App Load | [Pass/Fail] | |
| Critical Path (CRUD+Share) | [Pass/Fail] | |

## 11. Rollback Readiness
| Test Case | Result | Evidence/Notes |
|---|---|---|
| Previous version available | [Pass/Fail] | |
| Rollback procedure confirmed | [Pass/Fail] | |

## 12. Go / No-Go Decision
- **Final Decision:** [GO / NO-GO]
- **Blocking Bugs:** [List or None]
- **Non-blocking Issues:** [List or None]
- **Reasoning:** [Brief explanation]
