import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export const uploadNailImage = async (
  userId: string,
  nailItemId: string,
  file: File
): Promise<string> => {
  const storageRef = ref(storage, `users/${userId}/nailItems/${nailItemId}/original`)
  await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(storageRef)
}

export const deleteNailImage = async (
  userId: string,
  nailItemId: string
): Promise<void> => {
  const storageRef = ref(storage, `users/${userId}/nailItems/${nailItemId}/original`)
  await deleteObject(storageRef)
}
