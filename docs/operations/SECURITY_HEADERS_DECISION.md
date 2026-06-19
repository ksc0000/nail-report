# Security Headers Decision - Commercial MVP

## Status
- [x] Recommended for MVP
- [ ] Deferred for Post-MVP Hardening

## Overview
This document records the decision regarding security headers for the Nailous commercial MVP. The goal is to provide a robust security posture that protects user data and prevents common web attacks while ensuring seamless operation of Firebase services.

## Recommended MVP Headers (Standard Baseline)
These headers are currently configured in `firebase.json` to provide a strong security baseline without breaking core Firebase functionality.

| Header | MVP Setting | Rationale |
|--------|-------------|-----------|
| `Content-Security-Policy` | Strict Baseline | Blocks XSS and unauthorized data exfiltration. Tailored for Firebase Auth, Firestore, and Storage. |
| `X-Content-Type-Options` | `nosniff` | Prevents the browser from MIME-sniffing a response away from the declared content-type. |
| `X-Frame-Options` | `DENY` | Prevents clickjacking by disallowing the site from being embedded in an iframe. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects user privacy while allowing necessary cross-origin requests for Auth and APIs. |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Forces HTTPS. `preload` is intentionally deferred for the MVP to avoid accidental domain lock-in. |
| `Permissions-Policy` | `camera=(self), ...` | Restricts use of browser features. `camera` is allowed for the core "Take Photo" functionality. |

## Framing Policy
To provide defense-in-depth against clickjacking:
- **X-Frame-Options**: Set to `DENY` for compatibility with older browsers.
- **CSP `frame-ancestors`**: Set to `'none'` for modern browsers.

This combination ensures the application cannot be embedded by any other site.

## Deferred Hardening
The following security enhancements are identified but deferred to minimize deployment risk during the initial launch phase:
- **CSP Violation Reporting**: Adding `report-uri` or `report-to` for real-time monitoring of policy violations.
- **HSTS Preloading**: Submitting the domain to the global HSTS preload list (requires high confidence in long-term HTTPS stability).
- **Nonce-based CSP for Styles**: Moving away from `'unsafe-inline'` for CSS (requires non-trivial build-time integration with Vite/React).

## Human Approval Requirement
**IMPORTANT**: Any modifications to the security header configuration in `firebase.json` must receive explicit human approval before being merged or deployed.

Security headers directly impact production behavior and can:
1. Block critical Firebase Authentication flows.
2. Prevent image uploads or downloads from Cloud Storage.
3. Render the application unusable in specific browser versions.

Changes must be verified through the [Manual Smoke Test Instructions](./SECURITY_HEADERS_GUIDE.md#manual-smoke-test-instructions).

---
Refer to [SECURITY_HEADERS_GUIDE.md](./SECURITY_HEADERS_GUIDE.md) for the technical implementation details of these decisions.
