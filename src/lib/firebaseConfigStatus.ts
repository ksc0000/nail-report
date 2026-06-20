export const REQUIRED_FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

export type FirebaseEnvKey = typeof REQUIRED_FIREBASE_ENV_KEYS[number]

type FirebaseEnv = Partial<Record<FirebaseEnvKey, string | undefined>>

export const getMissingFirebaseEnvKeys = (env: FirebaseEnv = {}): FirebaseEnvKey[] =>
  REQUIRED_FIREBASE_ENV_KEYS.filter(key => !env[key]?.trim())

export const missingFirebaseEnvKeys = getMissingFirebaseEnvKeys(import.meta.env)
export const isFirebaseConfigComplete = missingFirebaseEnvKeys.length === 0
