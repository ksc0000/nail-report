import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../src/lib/firestore'
import * as firestore from 'firebase/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

// Mock ./firebase
vi.mock('../src/lib/firebase', () => ({
  db: { type: 'firestore' },
}))

describe('firestore helper functions', () => {
  const userId = 'user-123'
  const itemId = 'item-456'
  const input = {
    title: 'New Nail',
    imageUrl: 'http://example.com/image.png',
    tags: ['tag1'],
    memo: 'memo content',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('fetches and maps nail items correctly', async () => {
      const mockDocs = [
        {
          id: 'item-1',
          data: () => ({
            title: 'Item 1',
            imageUrl: 'url1',
            thumbnailUrl: 'url1',
            tags: [],
            memo: '',
            createdAt: null,
            updatedAt: null,
          }),
        },
      ]
      vi.mocked(firestore.getDocs).mockResolvedValue({
        docs: mockDocs,
      } as unknown as never)

      const result = await fetchNailItems(userId)

      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'item-1',
        title: 'Item 1',
        imageUrl: 'url1',
        thumbnailUrl: 'url1',
        tags: [],
        memo: '',
        createdAt: null,
        updatedAt: null,
      })
    })
  })

  describe('addNailItem', () => {
    it('adds a new nail item and returns its ID', async () => {
      vi.mocked(firestore.addDoc).mockResolvedValue({
        id: 'new-item-id',
      } as unknown as never)

      const result = await addNailItem(userId, input)

      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems')
      expect(firestore.addDoc).toHaveBeenCalled()
      expect(result).toBe('new-item-id')
    })
  })

  describe('updateNailItem', () => {
    it('updates an existing nail item', async () => {
      await updateNailItem(userId, itemId, input)

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', itemId)
      expect(firestore.updateDoc).toHaveBeenCalled()
    })
  })

  describe('deleteNailItem', () => {
    it('deletes a nail item', async () => {
      await deleteNailItem(userId, itemId)

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', itemId)
      expect(firestore.deleteDoc).toHaveBeenCalled()
    })
  })
})
