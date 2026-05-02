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
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  useEffect(() => {
    if (!user) { setNailItems([]); return }
    setIsFetching(true)
    fetchNailItems(user.uid)
      .then(setNailItems)
      .catch((e: unknown) => console.error('fetch failed', e))
      .finally(() => setIsFetching(false))
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
      <h1 id="app-title">Nailous</h1>
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
          <div id="nail-form">
            <h2 className="nail-form-title">{editingId ? 'Edit Nail Item' : 'Add Nail Item'}</h2>
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
                {nailLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} disabled={nailLoading}>
                  Cancel
                </button>
              )}
            </div>
            {nailError && <p className="nail-error">{nailError}</p>}
          </div>
          {isFetching ? (
            <p className="nail-loading">Loading...</p>
          ) : nailItems.length === 0 ? (
            <div className="nail-empty">
              <p className="nail-empty-main">No nail items yet.</p>
              <p className="nail-empty-sub">Add your first one above.</p>
            </div>
          ) : (
            <ul id="nail-list" className={nailLoading ? 'loading' : ''}>
              {nailItems.map(item => (
                <li key={item.id} className={editingId === item.id ? 'editing' : ''}>
                  <div className="nail-card-thumb">
                    <div className="nail-thumb-placeholder">No image</div>
                    {item.imageUrl && (
                      <img
                        className="nail-thumb-img"
                        src={item.imageUrl}
                        alt={item.title}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                  </div>
                  <div className="nail-card-body">
                    <span className="nail-item-title">{item.title}</span>
                    {item.tags.length > 0 && (
                      <div className="nail-item-tags">
                        {item.tags.map(t => (
                          <span key={t} className="nail-tag">#{t}</span>
                        ))}
                      </div>
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
