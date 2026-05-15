import { useState, useEffect, useRef } from 'react'
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from './lib/auth'
import type { User } from './lib/auth'
import { addNailItem, updateNailItem, deleteNailItem, fetchNailItems } from './lib/firestore'
import type { NailItemDoc } from './lib/firestore'
import { uploadNailImage, deleteNailImage } from './lib/storage'
import './App.css'

const sortByDate = (items: NailItemDoc[]): NailItemDoc[] =>
  [...items].sort((a, b) => {
    const ta = (a.updatedAt ?? a.createdAt)?.seconds ?? 0
    const tb = (b.updatedAt ?? b.createdAt)?.seconds ?? 0
    return tb - ta
  })

const formatDate = (ts: { toDate(): Date } | null | undefined): string | null => {
  if (!ts) return null
  try {
    return ts.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric', month: 'numeric', day: 'numeric',
    })
  } catch {
    return null
  }
}

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [nailItems, setNailItems] = useState<NailItemDoc[]>([])
  const [nailTitle, setNailTitle] = useState('')
  const [nailTags, setNailTags] = useState('')
  const [nailMemo, setNailMemo] = useState('')
  const [nailImageFile, setNailImageFile] = useState<File | null>(null)
  const [nailImagePreview, setNailImagePreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nailLoading, setNailLoading] = useState(false)
  const [nailError, setNailError] = useState('')
  const [nailItemsUserId, setNailItemsUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  useEffect(() => onAuthStateChanged(auth, nextUser => {
    setUser(nextUser)
    if (!nextUser) {
      setNailItems([])
      setNailItemsUserId(null)
    }
  }), [])

  useEffect(() => {
    if (!user) return
    let didCancel = false
    fetchNailItems(user.uid)
      .then(items => {
        if (didCancel) return
        setNailItems(sortByDate(items))
        setNailItemsUserId(user.uid)
      })
      .catch((e: unknown) => {
        console.error('fetch failed', e)
        if (didCancel) return
        setNailItems([])
        setNailItemsUserId(user.uid)
      })
    return () => { didCancel = true }
  }, [user])

  const isFetching = Boolean(user && nailItemsUserId !== user.uid)

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_FILE_BYTES = 5 * 1024 * 1024

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type))
      return 'jpeg・png・webp 形式の画像を選択してください。'
    if (file.size > MAX_FILE_BYTES)
      return `ファイルサイズは 5MB 以下にしてください（選択: ${(file.size / 1024 / 1024).toFixed(1)}MB）。`
    return null
  }

  const clearPreview = () => {
    if (previewUrlRef.current) { URL.revokeObjectURL(previewUrlRef.current); previewUrlRef.current = null }
    setNailImagePreview(null)
  }

  const handleNailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) { setNailImageFile(null); clearPreview(); setNailError(''); return }
    const err = validateImageFile(file)
    if (err) {
      setNailError(err)
      setNailImageFile(null)
      clearPreview()
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setNailError('')
    setNailImageFile(file)
    clearPreview()
    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    setNailImagePreview(url)
  }

  const handleRemoveFile = () => {
    setNailImageFile(null)
    clearPreview()
    setNailError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const parseTags = (s: string): string[] =>
    s.split(',').map(t => t.trim()).filter(Boolean)

  const resetForm = () => {
    setNailTitle('')
    setNailTags('')
    setNailMemo('')
    setNailImageFile(null)
    clearPreview()
    if (fileInputRef.current) fileInputRef.current.value = ''
    setEditingId(null)
    setNailError('')
  }

  const handleSubmitNailItem = async () => {
    if (!user || nailTitle.trim() === '') return
    if (nailImageFile) {
      const err = validateImageFile(nailImageFile)
      if (err) { setNailError(err); return }
    }
    const uid = user.uid
    setNailLoading(true)
    setNailError('')
    const baseInput = { title: nailTitle.trim(), tags: parseTags(nailTags), memo: nailMemo.trim() }
    try {
      if (editingId) {
        const editingItem = nailItems.find(i => i.id === editingId)
        let imageUrl = editingItem?.imageUrl ?? ''
        if (nailImageFile) {
          imageUrl = await uploadNailImage(uid, editingId, nailImageFile)
        }
        await updateNailItem(uid, editingId, { ...baseInput, imageUrl })
      } else {
        const itemId = await addNailItem(uid, { ...baseInput, imageUrl: '' })
        if (nailImageFile) {
          const imageUrl = await uploadNailImage(uid, itemId, nailImageFile)
          await updateNailItem(uid, itemId, { ...baseInput, imageUrl })
        }
      }
      const items = await fetchNailItems(uid)
      setNailItems(sortByDate(items))
      setNailItemsUserId(uid)
      resetForm()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setNailError(msg.toLowerCase().includes('storage') || msg.toLowerCase().includes('permission')
        ? '画像のアップロードに失敗しました。もう一度お試しください。'
        : msg)
    } finally {
      setNailLoading(false)
    }
  }

  const handleStartEdit = (item: NailItemDoc) => {
    setEditingId(item.id)
    setNailTitle(item.title)
    setNailTags(item.tags.join(', '))
    setNailMemo(item.memo ?? '')
    setNailImageFile(null)
    clearPreview()
    if (fileInputRef.current) fileInputRef.current.value = ''
    setNailError('')
  }

  const handleDeleteNailItem = async (itemId: string) => {
    if (!user) return
    const item = nailItems.find(i => i.id === itemId)
    if (!window.confirm(`「${item?.title ?? 'このアイテム'}」を削除しますか？\nこの操作は取り消せません。`)) return
    const uid = user.uid
    if (editingId === itemId) resetForm()
    setNailLoading(true)
    setNailError('')
    try {
      if (item?.imageUrl) {
        await deleteNailImage(uid, itemId).catch(() => {})
      }
      await deleteNailItem(uid, itemId)
      const items = await fetchNailItems(uid)
      setNailItems(sortByDate(items))
      setNailItemsUserId(uid)
    } catch (e: unknown) {
      setNailError(String(e))
    } finally {
      setNailLoading(false)
    }
  }

  const editingItem = editingId ? nailItems.find(i => i.id === editingId) : null

  const filteredItems = searchQuery.trim()
    ? nailItems.filter(item => {
        const q = searchQuery.trim().toLowerCase()
        return item.title.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q))
      })
    : nailItems

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
            <textarea
              value={nailMemo}
              onChange={e => setNailMemo(e.target.value)}
              placeholder="Memo (salon, price, scene...)"
              className="nail-textarea"
              rows={3}
              maxLength={500}
            />
            <div className="nail-file-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleNailFileChange}
                className="nail-file-input"
              />
              {nailImageFile && nailImagePreview && (
                <div className="nail-file-preview-area">
                  <img
                    className="nail-file-preview"
                    src={nailImagePreview}
                    alt="選択画像のプレビュー"
                  />
                  <div className="nail-file-info-row">
                    <span className="nail-file-info">
                      {nailImageFile.name}（{(nailImageFile.size / 1024 / 1024).toFixed(1)}MB）
                    </span>
                    <button
                      type="button"
                      className="nail-file-remove"
                      onClick={handleRemoveFile}
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
              {editingItem?.imageUrl && !nailImageFile && (
                <p className="nail-file-note">現在の画像を維持します。変更するには新しい画像を選択してください。</p>
              )}
            </div>
            <div className="nail-form-actions">
              <button
                type="button"
                className="btn-primary"
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
          {!isFetching && nailItems.length > 0 && (
            <div id="nail-search">
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="タイトル・タグで検索"
                className="nail-search-input"
              />
            </div>
          )}
          {isFetching ? (
            <p className="nail-loading">Loading...</p>
          ) : nailItems.length === 0 ? (
            <div className="nail-empty">
              <svg className="nail-empty-icon" aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect x="17" y="3" width="10" height="6" rx="2" fill="currentColor" opacity="0.35"/>
                <rect x="15" y="9" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.5"/>
                <rect x="13" y="12" width="18" height="26" rx="5" fill="currentColor" opacity="0.12"/>
                <rect x="13" y="12" width="18" height="10" rx="5" fill="currentColor" opacity="0.4"/>
              </svg>
              <p className="nail-empty-main">コレクションを始めましょう</p>
              <p className="nail-empty-sub">上のフォームから最初のネイルを追加してください</p>
              <ul className="nail-empty-tips">
                <li>タイトル・写真・タグ・メモを記録できます</li>
                <li>タグや検索でいつでも素早く見つかります</li>
              </ul>
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="nail-search-empty">「{searchQuery}」に一致するアイテムがありません。</p>
          ) : (
            <ul id="nail-list" className={nailLoading ? 'loading' : ''}>
              {filteredItems.map(item => {
                const createdDate = formatDate(item.createdAt)
                const updatedDate = (item.updatedAt && item.createdAt &&
                  item.updatedAt.seconds !== item.createdAt.seconds)
                  ? formatDate(item.updatedAt)
                  : null
                return (
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
                      {item.memo && (
                        <p className="nail-item-memo">{item.memo}</p>
                      )}
                      {(createdDate || updatedDate) && (
                        <p className="nail-item-date">
                          {createdDate}{updatedDate && `・更新 ${updatedDate}`}
                        </p>
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
                )
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

export default App
