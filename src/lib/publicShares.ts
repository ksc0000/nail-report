import {
  collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where,
  serverTimestamp,
} from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { db } from './firebase'

// Snapshot of a single NailItem stored in publicShares.
// memo and imageUrl are intentionally excluded.
export interface PublicShareItemSnapshot {
  id: string
  title: string
  tags: string[]
  createdAt: Timestamp | null
}

// Document stored at publicShares/{shareId}.
// ownerUid is not exposed in any public UI.
// isEnabled: false disables public read (revoke).
export interface PublicShareDoc {
  ownerUid: string
  isEnabled: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  title: string
  source: 'snapshot'
  items: PublicShareItemSnapshot[]
}

export interface PublicShareDocWithId extends PublicShareDoc {
  id: string
}

export const createPublicShare = async (
  ownerUid: string,
  title: string,
  items: PublicShareItemSnapshot[],
): Promise<string> => {
  const ref = collection(db, 'publicShares')
  const snap = await addDoc(ref, {
    ownerUid,
    isEnabled: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    title,
    source: 'snapshot',
    items,
  })
  return snap.id
}

export const disablePublicShare = async (shareId: string): Promise<void> => {
  const ref = doc(db, 'publicShares', shareId)
  await updateDoc(ref, {
    isEnabled: false,
    updatedAt: serverTimestamp(),
  })
}

export const fetchPublicSharesForOwner = async (ownerUid: string): Promise<PublicShareDocWithId[]> => {
  const ref = collection(db, 'publicShares')
  const q = query(ref, where('ownerUid', '==', ownerUid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(snap => ({
    id: snap.id,
    ...(snap.data() as PublicShareDoc),
  }))
}

export const getPublicShare = async (shareId: string): Promise<PublicShareDocWithId | null> => {
  const ref = doc(db, 'publicShares', shareId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as PublicShareDoc) }
}
