import assert from 'node:assert/strict'
import { test, mock } from 'node:test'

// Mocking firebase/firestore
mock.module('firebase/firestore', {
  namedExports: {
    collection: mock.fn(() => ({ type: 'collection' })),
    addDoc: mock.fn(async () => ({ id: 'new-id' })),
    getDocs: mock.fn(async () => ({
      docs: [
        {
          id: 'item-1',
          data: () => ({
            title: 'Item 1',
            imageUrl: 'https://example.com/1.jpg',
            thumbnailUrl: 'https://example.com/1.jpg',
            tags: [],
            memo: '',
            createdAt: null,
            updatedAt: null,
          })
        }
      ]
    })),
    doc: mock.fn(() => ({ type: 'doc' })),
    updateDoc: mock.fn(async () => {}),
    deleteDoc: mock.fn(async () => {}),
    serverTimestamp: mock.fn(() => ({ type: 'timestamp' })),
  },
})

// Mocking the firebase configuration module to avoid import.meta.env issues
mock.module('../lib/firebase.ts', {
  namedExports: {
    db: { type: 'db' },
    auth: { type: 'auth' },
    storage: { type: 'storage' },
  },
})

// Import functions after mocking
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../lib/firestore.ts'
import * as firestore from 'firebase/firestore'

test('fetchNailItems returns mapped nail items', async () => {
  const items = await fetchNailItems('user-1')
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].id, 'item-1')
  assert.strictEqual(items[0].title, 'Item 1')

  const collectionMock = firestore.collection as unknown as { mock: { calls: { arguments: unknown[] }[] } }
  assert.strictEqual(collectionMock.mock.calls.length, 1)
  assert.strictEqual(collectionMock.mock.calls[0].arguments[2], 'user-1')
})

test('addNailItem adds a doc and returns id', async () => {
  const input = {
    title: 'New Item',
    imageUrl: 'https://example.com/new.jpg',
    tags: ['tag1'],
    memo: 'memo1'
  }
  const id = await addNailItem('user-1', input)
  assert.strictEqual(id, 'new-id')
  assert.strictEqual((firestore.addDoc as unknown as { mock: { calls: unknown[] } }).mock.calls.length, 1)
})

test('updateNailItem updates the doc', async () => {
  const input = {
    title: 'Updated Item',
    imageUrl: 'https://example.com/updated.jpg',
    tags: ['tag2'],
    memo: 'memo2'
  }
  await updateNailItem('user-1', 'item-1', input)
  assert.strictEqual((firestore.updateDoc as unknown as { mock: { calls: unknown[] } }).mock.calls.length, 1)
})

test('deleteNailItem deletes the doc', async () => {
  await deleteNailItem('user-1', 'item-1')
  assert.strictEqual((firestore.deleteDoc as unknown as { mock: { calls: unknown[] } }).mock.calls.length, 1)
})
