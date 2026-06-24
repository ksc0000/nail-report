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

type OptionalNailItemFields = Pick<
  NailItem,
  | 'shape'
  | 'mainColor'
  | 'texture'
  | 'decorationParts'
  | 'salonName'
  | 'price'
  | 'appointmentDate'
>

export const NAIL_ITEM_OPTIONAL_FIELD_DEFAULTS: OptionalNailItemFields = {
  shape: undefined,
  mainColor: undefined,
  texture: undefined,
  decorationParts: undefined,
  salonName: undefined,
  price: undefined,
  appointmentDate: undefined,
}

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const toOptionalStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : undefined

const mapOptionalNailItemFields = (data: NailItem): OptionalNailItemFields => ({
  shape: toOptionalString(data.shape),
  mainColor: toOptionalString(data.mainColor),
  texture: toOptionalString(data.texture),
  decorationParts: toOptionalStringArray(data.decorationParts),
  salonName: toOptionalString(data.salonName),
  price: toOptionalString(data.price),
  appointmentDate: toOptionalString(data.appointmentDate),
})

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
  ...NAIL_ITEM_OPTIONAL_FIELD_DEFAULTS,
  ...mapOptionalNailItemFields(data),
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
