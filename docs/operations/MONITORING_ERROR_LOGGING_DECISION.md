# Monitoring and Error Logging Decision - Commercial MVP

## Status
- [x] Recommended for MVP (Manual Monitoring)
- [ ] Deferred for Post-MVP (Automated SDKs)

## Overview
This document records the decision regarding monitoring and error logging for the Nailous commercial MVP. The goal is to balance operational visibility with the need for a lean, dependency-free initial launch.

## Comparison: MVP Deferral vs. Lightweight Monitoring

| Aspect | MVP Deferral (Current) | Automated Monitoring (Post-MVP) |
|--------|------------------------|----------------------------------|
| **Setup Cost** | Zero (Built-in) | High (SDK integration, config) |
| **Maintenance** | Minimal | Ongoing (Updates, alert tuning) |
| **Granularity** | Coarse (Service-level) | Fine (User-trace level) |
| **Real-time** | Delayed/Manual | Near-instant alerts |

## Decision
For the commercial MVP, we will **defer the integration of third-party monitoring SDKs** (e.g., Sentry, LogRocket, Datadog) to avoid increasing bundle size and privacy complexity. Instead, we will rely on **lightweight manual monitoring** via the Firebase Console and built-in service logs.

## Critical Launch Monitoring Targets
During and immediately after launch, the following areas must be monitored manually:

1. **Authentication Failures**:
   - Monitor Firebase Auth console for unusual sign-in failure rates.
   - Verify Google OAuth provider status.
2. **CRUD & Upload Failures**:
   - Check Firestore usage metrics and error rates.
   - Monitor Cloud Storage for upload failures or quota issues.
3. **Public Sharing Issues**:
   - Verify `publicShares` collection for unexpected growth or access errors.
   - Monitor for "404 Not Found" or "403 Forbidden" on share links.
4. **Deployment & Rollback**:
   - Monitor Firebase Hosting for successful deploys.
   - Be ready to trigger a rollback in the Firebase Console if critical UI regressions are reported.

## Default MVP Stance
- **No additional SDKs**: Maintain zero external monitoring dependencies.
- **Service Dashboard Review**: Human operators should check Firebase service health dashboards daily during the first week of launch.
- **User Feedback Loop**: Rely on direct user reports (e.g., via the support email mentioned in the Data Management modal) for client-side JavaScript errors.

## Post-MVP Human Decisions Needed
Transitioning to automated monitoring will require explicit human approval on:
- **Vendor Selection**: Choosing between Sentry, Google Cloud Monitoring, or others.
- **Privacy Impact**: Updating the Privacy Policy to reflect data collection by monitoring services.
- **Performance Budget**: Assessing the impact of monitoring SDKs on the production bundle size.

---
Refer to [PRODUCTION_RELEASE_RUNBOOK.md](./PRODUCTION_RELEASE_RUNBOOK.md) for rollback procedures.
