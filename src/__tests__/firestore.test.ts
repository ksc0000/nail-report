import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getNailItem,
  addNailItem,
} from '../lib/firestore'
import * as firestore from 'firebase/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  doc: vi.fn(),
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
    tags: ['tag1'],
    memo: 'memo content',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getNailItem', () => {
    it('returns nail item when it exists', async () => {
      const mockData = {
        title: 'Existing Nail',
        imageUrl: 'url',
        thumbnailUrl: 'url',
        tags: [],
        memo: '',
        createdAt: null,
        updatedAt: null,
      }
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => true,
        id: itemId,
        data: () => mockData,
      } as unknown as never)

      const result = await getNailItem(userId, itemId)

      expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', itemId)
      expect(result).toEqual({
        id: itemId,
        ...mockData,
      })
    })

    it('returns null when nail item does not exist', async () => {
      vi.mocked(firestore.getDoc).mockResolvedValue({
        exists: () => false,
      } as unknown as never)

      const result = await getNailItem(userId, itemId)

      expect(result).toBeNull()
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
})
