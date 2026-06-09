import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchNailItems, addNailItem, updateNailItem, deleteNailItem } from '../lib/firestore'
import { getDocs, addDoc, updateDoc, deleteDoc, collection, doc } from 'firebase/firestore'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection-ref' })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(() => ({ type: 'doc-ref' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ type: 'timestamp' })),
}))

vi.mock('../lib/firebase', () => ({
  db: {},
}))

describe('firestore helpers', () => {
  const userId = 'test-user'
  const nailItemInput = {
    title: 'Test Nail',
    imageUrl: 'http://example.com/image.jpg',
    tags: ['pink', 'glitter'],
    memo: 'Pretty nail',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchNailItems', () => {
    it('should fetch nail items successfully', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Nail 1' }) },
        { id: '2', data: () => ({ title: 'Nail 2' }) },
      ]
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: mockDocs } as unknown as never)

      const result = await fetchNailItems(userId)

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ id: '1', title: 'Nail 1' })
    })

    it('should throw error when getDocs fails', async () => {
      vi.mocked(getDocs).mockRejectedValueOnce(new Error('Firestore error'))

      await expect(fetchNailItems(userId)).rejects.toThrow('Firestore error')
    })
  })

  describe('addNailItem', () => {
    it('should add a nail item and return id', async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: 'new-id' } as unknown as never)

      const id = await addNailItem(userId, nailItemInput)

      expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        title: nailItemInput.title,
        imageUrl: nailItemInput.imageUrl,
        thumbnailUrl: nailItemInput.imageUrl,
        tags: nailItemInput.tags,
        memo: nailItemInput.memo,
      }))
      expect(id).toBe('new-id')
    })

    it('should throw error when addDoc fails', async () => {
      vi.mocked(addDoc).mockRejectedValueOnce(new Error('Add failed'))
      await expect(addNailItem(userId, nailItemInput)).rejects.toThrow('Add failed')
    })
  })

  describe('updateNailItem', () => {
    it('should update a nail item successfully', async () => {
      await updateNailItem(userId, 'item-id', nailItemInput)

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', 'item-id')
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        title: nailItemInput.title,
      }))
    })

    it('should throw error when updateDoc fails', async () => {
      vi.mocked(updateDoc).mockRejectedValueOnce(new Error('Update failed'))
      await expect(updateNailItem(userId, 'item-id', nailItemInput)).rejects.toThrow('Update failed')
    })
  })

  describe('deleteNailItem', () => {
    it('should delete a nail item successfully', async () => {
      await deleteNailItem(userId, 'item-id')

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId, 'nailItems', 'item-id')
      expect(deleteDoc).toHaveBeenCalled()
    })

    it('should throw error when deleteDoc fails', async () => {
      vi.mocked(deleteDoc).mockRejectedValueOnce(new Error('Delete failed'))
      await expect(deleteNailItem(userId, 'item-id')).rejects.toThrow('Delete failed')
    })
  })
})
