import { describe, it, expect, vi } from 'vitest'
import {
  fetchNailItems,
  addNailItem,
  updateNailItem,
  deleteNailItem,
} from '../src/lib/firestore'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

vi.mock('../src/lib/firebase', () => ({
  db: { type: 'db' },
  auth: { type: 'auth' },
  storage: { type: 'storage' },
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}))

describe('firestore helpers', () => {
  it('fetchNailItems returns mapped nail items', async () => {
    vi.mocked(getDocs).mockResolvedValue({
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
          }),
        },
      ],
    } as unknown as never)

    const items = await fetchNailItems('user-1')
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('item-1')
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', 'user-1', 'nailItems')
  })

  it('addNailItem adds a doc and returns id', async () => {
    vi.mocked(addDoc).mockResolvedValue({ id: 'new-id' } as unknown as never)
    vi.mocked(serverTimestamp).mockReturnValue('timestamp' as unknown as never)

    const input = {
      title: 'New Item',
      imageUrl: 'https://example.com/new.jpg',
      tags: ['tag1'],
      memo: 'memo1',
    }
    const id = await addNailItem('user-1', input)
    expect(id).toBe('new-id')
    expect(addDoc).toHaveBeenCalled()
  })

  it('updateNailItem updates the doc', async () => {
    const input = {
      title: 'Updated Item',
      imageUrl: 'https://example.com/updated.jpg',
      tags: ['tag2'],
      memo: 'memo2',
    }
    await updateNailItem('user-1', 'item-1', input)
    expect(updateDoc).toHaveBeenCalled()
  })

  it('deleteNailItem deletes the doc', async () => {
    await deleteNailItem('user-1', 'item-1')
    expect(deleteDoc).toHaveBeenCalled()
  })
})
