import {
  collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
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

export interface NailItemInput {
  title: string
  imageUrl: string
  tags: string[]
  memo: string
}

export const fetchNailItems = async (userId: string): Promise<NailItemDoc[]> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const snapshot = await getDocs(ref)
  return snapshot.docs.map(snap => ({
    id: snap.id,
    ...(snap.data() as NailItem),
  }))
}

export const addNailItem = async (userId: string, input: NailItemInput): Promise<string> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const snap = await addDoc(ref, {
    title: input.title,
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    tags: input.tags,
    memo: input.memo,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return snap.id
}

export const updateNailItem = async (
  userId: string,
  itemId: string,
  input: NailItemInput,
): Promise<void> => {
  const ref = doc(db, 'users', userId, 'nailItems', itemId)
  await updateDoc(ref, {
    title: input.title,
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    tags: input.tags,
    memo: input.memo,
    updatedAt: serverTimestamp(),
  })
}

export const deleteNailItem = async (userId: string, itemId: string): Promise<void> => {
  const ref = doc(db, 'users', userId, 'nailItems', itemId)
  await deleteDoc(ref)
}
