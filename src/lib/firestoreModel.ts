import type { Timestamp } from 'firebase/firestore'

export interface NailItem {
  title: string
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  memo: string
  shape?: string
  mainColor?: string
  texture?: string
  decorationParts?: string[]
  salonName?: string
  price?: string
  appointmentDate?: string
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
  shape?: string
  mainColor?: string
  texture?: string
  decorationParts?: string[]
  salonName?: string
  price?: string
  appointmentDate?: string
  imageSource?: 'upload' | 'camera' | 'unknown'
}

const buildOptionalNailItemFields = (input: NailItemInput) => ({
  ...(input.shape !== undefined ? { shape: input.shape } : {}),
  ...(input.mainColor !== undefined ? { mainColor: input.mainColor } : {}),
  ...(input.texture !== undefined ? { texture: input.texture } : {}),
  ...(input.decorationParts !== undefined ? { decorationParts: input.decorationParts } : {}),
  ...(input.salonName !== undefined ? { salonName: input.salonName } : {}),
  ...(input.price !== undefined ? { price: input.price } : {}),
  ...(input.appointmentDate !== undefined ? { appointmentDate: input.appointmentDate } : {}),
})

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
  ...buildOptionalNailItemFields(input),
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
  ...buildOptionalNailItemFields(input),
  imageSource: input.imageSource ?? 'unknown',
  updatedAt: timestamp,
})
