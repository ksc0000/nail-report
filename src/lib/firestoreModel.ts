import type { Timestamp } from 'firebase/firestore'

export interface NailItem {
  title: string
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  memo: string
  imageSource?: 'upload' | 'camera' | 'unknown'
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
  imageSource?: 'upload' | 'camera' | 'unknown'
}

export const toNailItemDoc = (id: string, data: NailItem): NailItemDoc => ({
  id,
  ...data,
})

export const buildCreateNailItemData = (input: NailItemInput, timestamp: unknown) => ({
  title: input.title,
  imageUrl: input.imageUrl,
  thumbnailUrl: input.imageUrl,
  tags: input.tags,
  memo: input.memo,
  imageSource: input.imageSource ?? 'unknown',
  createdAt: timestamp,
  updatedAt: timestamp,
})

export const buildUpdateNailItemData = (input: NailItemInput, timestamp: unknown) => ({
  title: input.title,
  imageUrl: input.imageUrl,
  thumbnailUrl: input.imageUrl,
  tags: input.tags,
  memo: input.memo,
  imageSource: input.imageSource ?? 'unknown',
  updatedAt: timestamp,
})
