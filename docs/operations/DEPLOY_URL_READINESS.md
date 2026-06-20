# Deploy URL Readiness Checklist

This checklist ensures that all production and preview deployment URLs are correctly recorded and verified for the commercial MVP launch.

## URL Recording Tasks

- [ ] Record final production URL in [docs/operations/COMMERCIAL_LAUNCH_QA_REPORT.md](./COMMERCIAL_LAUNCH_QA_REPORT.md)
- [ ] Record final production URL in [docs/product/ROADMAP.md](../product/ROADMAP.md)
- [ ] Record any preview channel URLs used for pre-launch QA in the tracking issue or QA report

## Verification Tasks

- [ ] Verify production URL resolves to the correct Firebase Hosting site
- [ ] Verify SSL/HTTPS is active and valid on the production URL
- [ ] Verify the "noindex" robots meta tag is NOT present on the main production landing page (unless specifically requested)
- [ ] Verify "noindex" is present on legal and share pages as per [PUBLIC_SHARING_PRIVACY.md](./PUBLIC_SHARING_PRIVACY.md)

## Post-Launch Updates

- [ ] Mark Phase 7 as complete in [docs/product/ROADMAP.md](../product/ROADMAP.md) once the URL is verified and smoke tests pass
