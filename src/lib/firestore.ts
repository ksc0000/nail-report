import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface NailItem {
  title: string
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  memo: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export interface NailItemDoc extends NailItem {
  id: string
}

export const createTestNailItem = async (userId: string): Promise<string> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const snap = await addDoc(ref, {
    title: `test-nail-${Date.now()}`,
    imageUrl: '',
    thumbnailUrl: '',
    tags: [] as string[],
    memo: 'smoke test',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return snap.id
}

export const fetchNailItems = async (userId: string): Promise<NailItemDoc[]> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const snapshot = await getDocs(ref)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as NailItem),
  }))
}
