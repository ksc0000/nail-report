# Security Headers & CSP Guide

This document explains the security headers and Content Security Policy (CSP) configured for Firebase Hosting in `firebase.json`.

## Content Security Policy (CSP)

The following CSP is applied to all paths (`**`):

```
default-src 'self';
script-src 'self' https://apis.google.com https://www.gstatic.com;
connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.googleusercontent.com;
frame-src https://*.firebaseapp.com;
style-src 'self' 'unsafe-inline';
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
```

### Justification

| Directive | Source | Reason |
|-----------|--------|--------|
| `script-src` | `https://apis.google.com`, `https://www.gstatic.com` | Required for Firebase Authentication (Google Sign-In) and internal Firebase SDK operations. |
| `connect-src` | `https://*.googleapis.com`, `https://*.firebaseio.com` | Required for Firestore, Authentication, and Storage API calls. |
| `img-src` | `data:`, `blob:` | Required for local image previews before upload. |
| `img-src` | `https://firebasestorage.googleapis.com` | Required to display uploaded nail images. |
| `img-src` | `https://*.googleusercontent.com` | Required for Google account profile photos. |
| `frame-src` | `https://*.firebaseapp.com` | Required for Firebase Authentication iframe/popups. |
| `style-src` | `'unsafe-inline'` | Required because React/Vite injects styles inline during development and in certain production configurations. |

## Other Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents the browser from MIME-sniffing a response away from the declared content-type. |
| `X-Frame-Options` | `DENY` | Prevents the site from being embedded in an iframe, protecting against clickjacking. |
| `X-XSS-Protection` | `1; mode=block` | Enables the browser's XSS filtering. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls how much referrer information is included with requests. |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces the browser to only connect via HTTPS (HSTS). |
| `Permissions-Policy` | `camera=(self), microphone=(), geolocation=(), browsing-topics=()` | Restricts use of browser features. `camera` is allowed for the "Take Photo" feature. |

## Manual Smoke Test Instructions

After deploying or updating these headers, perform the following manual checks to ensure application functionality is not blocked by the CSP.

### 1. Google Authentication
- [ ] Open the application and click "Sign in with Google".
- [ ] Verify the login popup opens and allows selecting an account.
- [ ] Verify you are successfully logged in and your user name/email appears.
- [ ] Click "Sign out" and verify you are logged out.

### 2. Image Upload & Camera
- [ ] Click "画像を選択" (Select Image) and choose a local file. Verify the preview appears.
- [ ] Click "写真を撮る" (Take Photo) on a mobile device or camera-equipped PC. Verify the camera opens and a photo can be taken and previewed.
- [ ] Click "Add" or "Update" to save the item. Verify the image is uploaded and displayed in the list.

### 3. Public Share Pages
- [ ] Create a share link for a collection.
- [ ] Copy the share URL and open it in a new incognito/private window.
- [ ] Verify the public share page loads correctly and displays the shared items.

### 4. Data Export
- [ ] Click "Export CSV". Verify the file is downloaded and contains the correct data.
- [ ] Click "Export JSON". Verify the file is downloaded and contains the correct data.
