import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchNailItems, addNailItem } from '../lib/firestore'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import type { QuerySnapshot, DocumentReference, DocumentData } from 'firebase/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection-ref' })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mocked-timestamp'),
}))

// Mock ./firebase to provide the db instance
vi.mock('../lib/firebase', () => ({
  db: { type: 'firestore' },
}))

describe('firestore.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('should fetch nail items for a given userId', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Item 1', tags: [] }) },
        { id: '2', data: () => ({ title: 'Item 2', tags: ['blue'] }) },
      ]
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as unknown as QuerySnapshot<DocumentData>)

      const items = await fetchNailItems('test-user')

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', 'test-user', 'nailItems')
      expect(getDocs).toHaveBeenCalled()
      expect(items).toHaveLength(2)
      expect(items[0]).toEqual({ id: '1', title: 'Item 1', tags: [] })
    })
  })

  describe('addNailItem', () => {
    it('should add a new nail item and return its id', async () => {
      const mockInput = {
        title: 'New Item',
        imageUrl: 'http://example.com/image.jpg',
        tags: ['red'],
        memo: 'Test memo',
      }
      vi.mocked(addDoc).mockResolvedValueOnce({ id: 'new-id' } as unknown as DocumentReference<DocumentData>)

      const id = await addNailItem('test-user', mockInput)

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', 'test-user', 'nailItems')
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        title: 'New Item',
        imageUrl: 'http://example.com/image.jpg',
        thumbnailUrl: 'http://example.com/image.jpg',
        tags: ['red'],
        memo: 'Test memo',
        createdAt: 'mocked-timestamp',
        updatedAt: 'mocked-timestamp',
      })
      expect(serverTimestamp).toHaveBeenCalledTimes(2)
      expect(id).toBe('new-id')
    })
  })
})
