import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import type {
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore'
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../lib/firestore'
import { db } from '../lib/firebase'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection-ref' })),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(() => ({ type: 'doc-ref' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mocked-timestamp'),
}))

vi.mock('../lib/firebase', () => ({
  db: { type: 'firestore-db' },
}))

describe('firestore.ts', () => {
  const userId = 'test-user-id'
  const itemId = 'test-item-id'
  const mockInput = {
    title: 'Test Title',
    imageUrl: 'http://test.com/image.jpg',
    tags: ['tag1', 'tag2'],
    memo: 'Test Memo',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('should fetch nail items for a user', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Item 1' }) },
        { id: '2', data: () => ({ title: 'Item 2' }) },
      ]
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as unknown as QuerySnapshot<DocumentData>)

      const result = await fetchNailItems(userId)

      expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'nailItems')
      expect(getDocs).toHaveBeenCalledWith({ type: 'collection-ref' })
      expect(result).toEqual([
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
      ])
    })
  })

  describe('addNailItem', () => {
    it('should add a new nail item', async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: itemId } as DocumentReference)

      const result = await addNailItem(userId, mockInput)

      expect(collection).toHaveBeenCalledWith(db, 'users', userId, 'nailItems')
      expect(addDoc).toHaveBeenCalledWith({ type: 'collection-ref' }, {
        title: mockInput.title,
        imageUrl: mockInput.imageUrl,
        thumbnailUrl: mockInput.imageUrl,
        tags: mockInput.tags,
        memo: mockInput.memo,
        createdAt: 'mocked-timestamp',
        updatedAt: 'mocked-timestamp',
      })
      expect(result).toBe(itemId)
    })
  })

  describe('updateNailItem', () => {
    it('should update an existing nail item', async () => {
      await updateNailItem(userId, itemId, mockInput)

      expect(doc).toHaveBeenCalledWith(db, 'users', userId, 'nailItems', itemId)
      expect(updateDoc).toHaveBeenCalledWith({ type: 'doc-ref' }, {
        title: mockInput.title,
        imageUrl: mockInput.imageUrl,
        thumbnailUrl: mockInput.imageUrl,
        tags: mockInput.tags,
        memo: mockInput.memo,
        updatedAt: 'mocked-timestamp',
      })
    })
  })

  describe('deleteNailItem', () => {
    it('should delete a nail item', async () => {
      await deleteNailItem(userId, itemId)

      expect(doc).toHaveBeenCalledWith(db, 'users', userId, 'nailItems', itemId)
      expect(deleteDoc).toHaveBeenCalledWith({ type: 'doc-ref' })
    })
  })
})
