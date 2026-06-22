import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../lib/firestore'
import * as firestore from 'firebase/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection-ref' })),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(() => ({ type: 'doc-ref' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}))

// Mock ../lib/firebase
vi.mock('../lib/firebase', () => ({
  db: { type: 'firestore' },
}))

describe('firestore helper functions', () => {
  const userId = 'user-123'
  const itemId = 'item-456'
  const input = {
    title: 'New Nail',
    imageUrl: 'http://example.com/image.png',
    thumbnailUrl: 'http://example.com/thumb.png',
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

    it('returns empty array when no docs found', async () => {
      vi.mocked(firestore.getDocs).mockResolvedValue({
        docs: [],
      } as unknown as never)

      const result = await fetchNailItems(userId)
      expect(result).toEqual([])
    })

    it('throws error when getDocs fails', async () => {
      vi.mocked(firestore.getDocs).mockRejectedValue(new Error('Fetch failed'))
      await expect(fetchNailItems(userId)).rejects.toThrow('Fetch failed')
    })
  })

  describe('addNailItem', () => {
    it('adds a new nail item and returns its ID', async () => {
      vi.mocked(firestore.addDoc).mockResolvedValue({
        id: 'new-item-id',
      } as unknown as never)

      const result = await addNailItem(userId, input)

      expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems')
      expect(firestore.addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: input.title,
          tags: input.tags,
          memo: input.memo,
          createdAt: 'mock-timestamp',
          updatedAt: 'mock-timestamp',
        }),
      )
      expect(result).toBe('new-item-id')
    })

    it('throws error when addDoc fails', async () => {
      vi.mocked(firestore.addDoc).mockRejectedValue(new Error('Add failed'))
      await expect(addNailItem(userId, input)).rejects.toThrow('Add failed')
    })
  })

  describe('updateNailItem', () => {
    it('updates an existing nail item', async () => {
      await updateNailItem(userId, itemId, input)

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', itemId)
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: input.title,
          tags: input.tags,
          memo: input.memo,
          updatedAt: 'mock-timestamp',
        }),
      )
    })

    it('throws error when updateDoc fails', async () => {
      vi.mocked(firestore.updateDoc).mockRejectedValue(new Error('Update failed'))
      await expect(updateNailItem(userId, itemId, input)).rejects.toThrow('Update failed')
    })
  })

  describe('deleteNailItem', () => {
    it('deletes a nail item', async () => {
      await deleteNailItem(userId, itemId)

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', itemId)
      expect(firestore.deleteDoc).toHaveBeenCalled()
    })

    it('throws error when deleteDoc fails', async () => {
      vi.mocked(firestore.deleteDoc).mockRejectedValue(new Error('Delete failed'))
      await expect(deleteNailItem(userId, itemId)).rejects.toThrow('Delete failed')
    })
  })
})
