import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock firebase modules BEFORE importing from lib
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _type: 'timestamp' })),
}))
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
}))

import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../../lib/firestore'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

describe('firestore lib', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('successfully fetches nail items', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'item 1' }) },
        { id: '2', data: () => ({ title: 'item 2' }) },
      ]
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: mockDocs } as never)

      const result = await fetchNailItems('user123')

      expect(collection).toHaveBeenCalledWith(undefined, 'users', 'user123', 'nailItems')
      expect(getDocs).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: '1', title: 'item 1' })
      expect(result[1]).toEqual({ id: '2', title: 'item 2' })
    })

    it('handles error when fetching nail items fails', async () => {
      vi.mocked(getDocs).mockRejectedValueOnce(new Error('Fetch failed'))

      await expect(fetchNailItems('user123')).rejects.toThrow('Fetch failed')
    })
  })

  describe('addNailItem', () => {
    it('successfully adds a nail item', async () => {
      const input = {
        title: 'new item',
        imageUrl: 'http://example.com/image.jpg',
        tags: ['tag1'],
        memo: 'some memo',
      }
      vi.mocked(addDoc).mockResolvedValueOnce({ id: 'new-id' } as never)

      const result = await addNailItem('user123', input)

      expect(collection).toHaveBeenCalledWith(undefined, 'users', 'user123', 'nailItems')
      expect(addDoc).toHaveBeenCalledWith(undefined, expect.objectContaining({
        title: input.title,
        imageUrl: input.imageUrl,
        thumbnailUrl: input.imageUrl,
        tags: input.tags,
        memo: input.memo,
      }))
      expect(serverTimestamp).toHaveBeenCalledTimes(2)
      expect(result).toBe('new-id')
    })

    it('handles error when adding a nail item fails', async () => {
      vi.mocked(addDoc).mockRejectedValueOnce(new Error('Add failed'))

      await expect(addNailItem('user123', {} as never)).rejects.toThrow('Add failed')
    })
  })

  describe('updateNailItem', () => {
    it('successfully updates a nail item', async () => {
      const input = {
        title: 'updated item',
        imageUrl: 'http://example.com/updated.jpg',
        tags: ['updated'],
        memo: 'updated memo',
      }
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never)

      await updateNailItem('user123', 'item456', input)

      expect(doc).toHaveBeenCalledWith(undefined, 'users', 'user123', 'nailItems', 'item456')
      expect(updateDoc).toHaveBeenCalledWith(undefined, expect.objectContaining({
        title: input.title,
        imageUrl: input.imageUrl,
        thumbnailUrl: input.imageUrl,
        tags: input.tags,
        memo: input.memo,
      }))
      expect(serverTimestamp).toHaveBeenCalledTimes(1)
    })

    it('handles error when updating a nail item fails', async () => {
      vi.mocked(updateDoc).mockRejectedValueOnce(new Error('Update failed'))

      await expect(updateNailItem('user123', 'item456', {} as never)).rejects.toThrow('Update failed')
    })
  })

  describe('deleteNailItem', () => {
    it('successfully deletes a nail item', async () => {
      vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as never)

      await deleteNailItem('user123', 'item456')

      expect(doc).toHaveBeenCalledWith(undefined, 'users', 'user123', 'nailItems', 'item456')
      expect(deleteDoc).toHaveBeenCalled()
    })

    it('handles error when deleting a nail item fails', async () => {
      vi.mocked(deleteDoc).mockRejectedValueOnce(new Error('Delete failed'))

      await expect(deleteNailItem('user123', 'item456')).rejects.toThrow('Delete failed')
    })
  })
})
