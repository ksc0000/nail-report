import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  buildCreateNailItemData,
  buildUpdateNailItemData,
  toNailItemDoc,
} from '../src/lib/firestoreModel.ts'
import type { NailItem, NailItemInput } from '../src/lib/firestoreModel.ts'
const input: NailItemInput = {
  title: 'Spring rose',
  imageUrl: 'https://example.com/nail.jpg',
  tags: ['pink', 'gel'],
  memo: 'soft gradient',
  imageSource: 'camera',
}

const designInput: NailItemInput = {
  ...input,
  shape: 'almond',
  mainColor: 'blush',
  texture: 'gloss',
  decorationParts: ['pearl', 'gold-line'],
}

test('buildCreateNailItemData creates the Firestore write payload', () => {
  const timestamp = Symbol('serverTimestamp')
  assert.deepEqual(buildCreateNailItemData(input, timestamp), {
    title: input.title,
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    tags: input.tags,
    memo: input.memo,
    imageSource: 'camera',
    createdAt: timestamp,
    updatedAt: timestamp,
  })
})
test('buildCreateNailItemData defaults imageSource to unknown', () => {
  const timestamp = Symbol('serverTimestamp')
  const noSourceInput = { ...input, imageSource: undefined }
  const result = buildCreateNailItemData(noSourceInput, timestamp)
  assert.equal(result.imageSource, 'unknown')
})

test('buildCreateNailItemData includes optional nail design fields when provided', () => {
  const timestamp = Symbol('serverTimestamp')
  assert.deepEqual(buildCreateNailItemData(designInput, timestamp), {
    title: designInput.title,
    imageUrl: designInput.imageUrl,
    thumbnailUrl: designInput.imageUrl,
    tags: designInput.tags,
    memo: designInput.memo,
    shape: 'almond',
    mainColor: 'blush',
    texture: 'gloss',
    decorationParts: ['pearl', 'gold-line'],
    imageSource: 'camera',
    createdAt: timestamp,
    updatedAt: timestamp,
  })
})

test('buildUpdateNailItemData omits createdAt and refreshes updatedAt', () => {
  const timestamp = Symbol('serverTimestamp')
  assert.deepEqual(buildUpdateNailItemData(input, timestamp), {
    title: input.title,
    imageUrl: input.imageUrl,
    thumbnailUrl: input.imageUrl,
    tags: input.tags,
    memo: input.memo,
    imageSource: 'camera',
    updatedAt: timestamp,
  })
})

test('buildUpdateNailItemData includes optional nail design fields when provided', () => {
  const timestamp = Symbol('serverTimestamp')
  assert.deepEqual(buildUpdateNailItemData(designInput, timestamp), {
    title: designInput.title,
    imageUrl: designInput.imageUrl,
    thumbnailUrl: designInput.imageUrl,
    tags: designInput.tags,
    memo: designInput.memo,
    shape: 'almond',
    mainColor: 'blush',
    texture: 'gloss',
    decorationParts: ['pearl', 'gold-line'],
    imageSource: 'camera',
    updatedAt: timestamp,
  })
})

test('toNailItemDoc keeps Firestore document fields and attaches id', () => {
  const data: NailItem = {
    ...input,
    thumbnailUrl: input.imageUrl,
    createdAt: null,
    updatedAt: null,
  }
  assert.deepEqual(toNailItemDoc('nail-1', data), {
    id: 'nail-1',
    ...data,
  })
})

test('toNailItemDoc safely maps old documents without optional nail design fields', () => {
  const data: NailItem = {
    ...input,
    thumbnailUrl: input.imageUrl,
    createdAt: null,
    updatedAt: null,
  }

  const result = toNailItemDoc('old-nail-1', data)

  assert.equal(result.shape, undefined)
  assert.equal(result.mainColor, undefined)
  assert.equal(result.texture, undefined)
  assert.equal(result.decorationParts, undefined)
})
