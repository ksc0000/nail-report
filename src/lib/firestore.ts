import {
  collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  buildCreateNailItemData,
  buildUpdateNailItemData,
  toNailItemDoc,
} from './firestoreModel'
import type { NailItem, NailItemDoc, NailItemInput } from './firestoreModel'

export type { NailItem, NailItemDoc, NailItemInput } from './firestoreModel'

export const fetchNailItems = async (userId: string): Promise<NailItemDoc[]> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const snapshot = await getDocs(ref)
  return snapshot.docs.map(snap => toNailItemDoc(snap.id, snap.data() as NailItem))
}

export const addNailItem = async (userId: string, input: NailItemInput): Promise<string> => {
  const ref = collection(db, 'users', userId, 'nailItems')
  const timestamp = serverTimestamp()
  const snap = await addDoc(ref, buildCreateNailItemData(input, timestamp))
  return snap.id
}

export const updateNailItem = async (
  userId: string,
  itemId: string,
  input: NailItemInput,
): Promise<void> => {
  const ref = doc(db, 'users', userId, 'nailItems', itemId)
  await updateDoc(ref, buildUpdateNailItemData(input, serverTimestamp()))
}

export const deleteNailItem = async (userId: string, itemId: string): Promise<void> => {
  const ref = doc(db, 'users', userId, 'nailItems', itemId)
  await deleteDoc(ref)
}

export const getNailItem = async (userId: string, itemId: string): Promise<NailItemDoc | null> => {
  const ref = doc(db, 'users', userId, 'nailItems', itemId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return toNailItemDoc(snap.id, snap.data() as NailItem)
}
