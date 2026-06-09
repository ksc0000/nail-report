import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  QuerySnapshot,
  DocumentReference,
} from 'firebase/firestore'
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../lib/firestore'

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection' })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(() => ({ type: 'doc' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mocked-timestamp'),
}))

// Mock src/lib/firebase
vi.mock('../lib/firebase', () => ({
  db: { type: 'db' },
}))

describe('firestore utility functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('should fetch nail items for a given user', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Nail 1' }) },
        { id: '2', data: () => ({ title: 'Nail 2' }) },
      ]
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: mockDocs,
      } as unknown as QuerySnapshot)

      const result = await fetchNailItems('user123')

      expect(collection).toHaveBeenCalledWith({ type: 'db' }, 'users', 'user123', 'nailItems')
      expect(getDocs).toHaveBeenCalledWith({ type: 'collection' })
      expect(result).toEqual([
        { id: '1', title: 'Nail 1' },
        { id: '2', title: 'Nail 2' },
      ])
    })
  })

  describe('addNailItem', () => {
    it('should add a new nail item', async () => {
      const mockInput = {
        title: 'New Nail',
        imageUrl: 'http://example.com/image.jpg',
        tags: ['pink', 'glitter'],
        memo: 'Test memo',
      }
      vi.mocked(addDoc).mockResolvedValueOnce({ id: 'new-id' } as unknown as DocumentReference)

      const result = await addNailItem('user123', mockInput)

      expect(collection).toHaveBeenCalledWith({ type: 'db' }, 'users', 'user123', 'nailItems')
      expect(addDoc).toHaveBeenCalledWith({ type: 'collection' }, {
        title: mockInput.title,
        imageUrl: mockInput.imageUrl,
        thumbnailUrl: mockInput.imageUrl,
        tags: mockInput.tags,
        memo: mockInput.memo,
        createdAt: 'mocked-timestamp',
        updatedAt: 'mocked-timestamp',
      })
      expect(result).toBe('new-id')
    })
  })

  describe('updateNailItem', () => {
    it('should update an existing nail item', async () => {
      const mockInput = {
        title: 'Updated Nail',
        imageUrl: 'http://example.com/updated.jpg',
        tags: ['blue'],
        memo: 'Updated memo',
      }

      await updateNailItem('user123', 'item456', mockInput)

      expect(doc).toHaveBeenCalledWith({ type: 'db' }, 'users', 'user123', 'nailItems', 'item456')
      expect(updateDoc).toHaveBeenCalledWith({ type: 'doc' }, {
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
      await deleteNailItem('user123', 'item456')

      expect(doc).toHaveBeenCalledWith({ type: 'db' }, 'users', 'user123', 'nailItems', 'item456')
      expect(deleteDoc).toHaveBeenCalledWith({ type: 'doc' })
    })
  })
})
