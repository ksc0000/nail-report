import { useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from './lib/auth'
import type { User } from './lib/auth'
import { addNailItem, updateNailItem, deleteNailItem, fetchNailItems } from './lib/firestore'
import type { NailItemDoc } from './lib/firestore'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [nailItems, setNailItems] = useState<NailItemDoc[]>([])
  const [nailTitle, setNailTitle] = useState('')
  const [nailTags, setNailTags] = useState('')
  const [nailImageUrl, setNailImageUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nailLoading, setNailLoading] = useState(false)
  const [nailError, setNailError] = useState('')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  useEffect(() => {
    if (!user) { setNailItems([]); return }
    fetchNailItems(user.uid)
      .then(setNailItems)
      .catch((e: unknown) => console.error('fetch failed', e))
  }, [user])

  const parseTags = (s: string): string[] =>
    s.split(',').map(t => t.trim()).filter(Boolean)

  const resetForm = () => {
    setNailTitle('')
    setNailTags('')
    setNailImageUrl('')
    setEditingId(null)
    setNailError('')
  }

  const handleSubmitNailItem = () => {
    if (!user || nailTitle.trim() === '') return
    const uid = user.uid
    setNailLoading(true)
    setNailError('')
    const input = { title: nailTitle.trim(), imageUrl: nailImageUrl.trim(), tags: parseTags(nailTags), memo: '' }
    const op: Promise<void> = editingId
      ? updateNailItem(uid, editingId, input)
      : addNailItem(uid, input).then(() => {})
    op
      .then(() => fetchNailItems(uid))
      .then(items => { setNailItems(items); resetForm() })
      .catch((e: unknown) => setNailError(String(e)))
      .finally(() => setNailLoading(false))
  }

  const handleStartEdit = (item: NailItemDoc) => {
    setEditingId(item.id)
    setNailTitle(item.title)
    setNailTags(item.tags.join(', '))
    setNailImageUrl(item.imageUrl)
    setNailError('')
  }

  const handleDeleteNailItem = (itemId: string) => {
    if (!user) return
    const uid = user.uid
    if (editingId === itemId) resetForm()
    setNailLoading(true)
    setNailError('')
    deleteNailItem(uid, itemId)
      .then(() => fetchNailItems(uid))
      .then(setNailItems)
      .catch((e: unknown) => setNailError(String(e)))
      .finally(() => setNailLoading(false))
  }

  return (
    <section id="center">
        <div id="auth-bar">
          {user === undefined ? null : user ? (
            <div className="auth-user">
              <span>{user.displayName ?? user.email}</span>
              <button type="button" onClick={() => {
                signOutUser().catch((e: unknown) => console.error('sign-out failed', e))
              }}>Sign out</button>
            </div>
          ) : (
            <button type="button" className="auth-signin" onClick={() => {
              signInWithGoogle().catch((e: unknown) => console.error('sign-in failed', e))
            }}>
              Sign in with Google
            </button>
          )}
        </div>
        {user && (
          <div id="nail-section">
            <h2>My Nail Items</h2>
            <div id="nail-form">
              <input
                type="text"
                value={nailTitle}
                onChange={e => setNailTitle(e.target.value)}
                placeholder="Title *"
                className="nail-input"
              />
              <input
                type="text"
                value={nailTags}
                onChange={e => setNailTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="nail-input"
              />
              <input
                type="text"
                value={nailImageUrl}
                onChange={e => setNailImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="nail-input"
              />
              <div className="nail-form-actions">
                <button
                  type="button"
                  onClick={handleSubmitNailItem}
                  disabled={nailLoading || nailTitle.trim() === ''}
                >
                  {nailLoading ? 'Saving...' : editingId ? 'Update' : 'Add NailItem'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} disabled={nailLoading}>
                    Cancel
                  </button>
                )}
              </div>
              {nailError && <p className="nail-error">{nailError}</p>}
            </div>
            {nailItems.length === 0 ? (
              <p className="nail-empty">No nail items yet.</p>
            ) : (
              <ul id="nail-list">
                {nailItems.map(item => (
                  <li key={item.id} className={editingId === item.id ? 'editing' : ''}>
                    <div className="nail-item-info">
                      <span className="nail-item-title">{item.title}</span>
                      {item.tags.length > 0 && (
                        <span className="nail-item-tags">
                          {item.tags.map(t => '#' + t).join(' ')}
                        </span>
                      )}
                    </div>
                    <div className="nail-item-actions">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        disabled={nailLoading}
                      >Edit</button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNailItem(item.id)}
                        disabled={nailLoading}
                      >Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
    </section>
  )
}

export default App
