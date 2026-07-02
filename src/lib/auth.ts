import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

provider.setCustomParameters({ prompt: 'select_account' })

const isAppleWebKit = (): boolean => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari =
    /safari/i.test(ua) &&
    !/chrome|crios|chromium|edg|edgios|fxios|opr|opera|android/i.test(ua)
  return isIOS || isSafari
}

const shouldUseRedirectSignIn = (): boolean => {
  if (typeof window === 'undefined') return false
  // Safari / iOS block the cross-origin popup + iframe storage that
  // signInWithPopup relies on (Intelligent Tracking Prevention), which makes
  // the popup close without ever signing the user in. A full-page redirect is
  // the reliable path there.
  if (isAppleWebKit()) return true
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const isSmallViewport = window.innerWidth <= 820
  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  return hasCoarsePointer || (isSmallViewport && !isLocalhost)
}

export const signInWithGoogle = () =>
  shouldUseRedirectSignIn()
    ? signInWithRedirect(auth, provider)
    : signInWithPopup(auth, provider)

// Called once on app load to finish a redirect-based sign-in after the browser
// returns from the Google consent screen. Resolves to the credential result
// (or null when there is no pending redirect). Surfacing this also lets us show
// an error instead of silently bouncing back to the sign-in button.
export const completeRedirectSignIn = () => getRedirectResult(auth)

export const signOutUser = () => signOut(auth)
export { auth, onAuthStateChanged }
export type { User }
