import { useState, useEffect, useRef, useMemo } from 'react'
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from './lib/auth'
import type { User } from './lib/auth'
import { addNailItem, updateNailItem, deleteNailItem, fetchNailItems } from './lib/firestore'
import type { NailItemDoc } from './lib/firestore'
import {
  createPublicShare,
  disablePublicShare,
  fetchPublicSharesForOwner,
  getPublicShare,
} from './lib/publicShares'
import type { PublicShareDocWithId, PublicShareItemSnapshot } from './lib/publicShares'
import { uploadNailImage, deleteNailImage } from './lib/storage'
import ErrorBanner from './components/ErrorBanner'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsOfServicePage from './components/TermsOfServicePage'
import NailImageDetailViewer from './components/NailImageDetailViewer'
import './App.css'

const sortByDate = (items: NailItemDoc[]): NailItemDoc[] =>
  [...items].sort((a, b) => {
    const ta = (a.updatedAt ?? a.createdAt)?.seconds ?? 0
    const tb = (b.updatedAt ?? b.createdAt)?.seconds ?? 0
    return tb - ta
  })

const sortPublicShares = (shares: PublicShareDocWithId[]): PublicShareDocWithId[] =>
  [...shares].sort((a, b) => {
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

interface NailSummary {
  totalCount: number
  withImageCount: number
  withoutImageCount: number
  tagCounts: { tag: string; count: number }[]
  monthlyCounts: { month: string; count: number }[]
  recentItems: NailItemDoc[]
}

const getNailSummary = (items: NailItemDoc[]): NailSummary => {
  const withImageCount = items.filter(i => Boolean(i.imageUrl)).length
  const tagMap = new Map<string, number>()
  items.forEach(item => item.tags.forEach(t => tagMap.set(t, (tagMap.get(t) ?? 0) + 1)))
  const tagCounts = [...tagMap.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  const monthMap = new Map<string, number>()
  items.forEach(item => {
    try {
      const d = (item.createdAt ?? item.updatedAt)?.toDate()
      if (!d) return
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthMap.set(month, (monthMap.get(month) ?? 0) + 1)
    } catch { /* skip */ }
  })
  const monthlyCounts = [...monthMap.entries()]
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.month.localeCompare(a.month))
  const recentItems = [...items]
    .sort((a, b) => {
      const ta = (a.updatedAt ?? a.createdAt)?.seconds ?? 0
      const tb = (b.updatedAt ?? b.createdAt)?.seconds ?? 0
      return tb - ta
    })
    .slice(0, 5)
  return {
    totalCount: items.length,
    withImageCount,
    withoutImageCount: items.length - withImageCount,
    tagCounts,
    monthlyCounts,
    recentItems,
  }
}

interface ExportedNailItem {
  id: string
  title: string
  tags: string
  memo: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

const formatTimestampForExport = (ts: { toDate(): Date } | null | undefined): string => {
  if (!ts) return ''
  try { return ts.toDate().toISOString() } catch { return '' }
}

const formatNailItemForExport = (item: NailItemDoc): ExportedNailItem => ({
  id: item.id,
  title: item.title,
  tags: item.tags.join(';'),
  memo: item.memo ?? '',
  imageUrl: item.imageUrl ?? '',
  createdAt: formatTimestampForExport(item.createdAt),
  updatedAt: formatTimestampForExport(item.updatedAt),
})

const CSV_HEADERS = ['id', 'title', 'tags', 'memo', 'imageUrl', 'createdAt', 'updatedAt'] as const

const escapeCsvCell = (value: string): string => {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

const toCsv = (items: NailItemDoc[]): string => {
  const header = CSV_HEADERS.join(',')
  const rows = items.map(item => {
    const e = formatNailItemForExport(item)
    return CSV_HEADERS.map(k => escapeCsvCell(e[k])).join(',')
  })
  return [header, ...rows].join('\r\n')
}

const toJson = (items: NailItemDoc[]): string =>
  JSON.stringify(items.map(formatNailItemForExport), null, 2)

const downloadTextFile = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const getExportDateStamp = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getItemMonth = (item: NailItemDoc): string | null => {
  try {
    const d = (item.createdAt ?? item.updatedAt)?.toDate()
    if (!d) return null
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  } catch {
    return null
  }
}

const toggleComparisonId = (prevIds: string[], itemId: string): string[] => {
  if (prevIds.includes(itemId)) return prevIds.filter(id => id !== itemId)
  if (prevIds.length < 2) return [...prevIds, itemId]
  return [prevIds[1], itemId]
}

const getSortedComparisonItems = (items: NailItemDoc[]): NailItemDoc[] =>
  [...items].sort((a, b) => {
    const ta = (a.createdAt ?? a.updatedAt)?.seconds ?? 0
    const tb = (b.createdAt ?? b.updatedAt)?.seconds ?? 0
    return ta - tb
  })

type PublicShareViewState = 'idle' | 'loading' | 'ready' | 'not-found' | 'disabled' | 'error'

const getPublicShareIdFromPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/share\/([^/]+)\/?$/)
  return m?.[1] ? decodeURIComponent(m[1]) : null
}

function App() {
  const [pathname, setPathname] = useState(typeof window === 'undefined' ? '/' : window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const sharePathId = useMemo(() => getPublicShareIdFromPath(pathname), [pathname])
  const isPublicSharePage = sharePathId !== null
  const isPrivacyPage = pathname === '/privacy'
  const isTermsPage = pathname === '/terms'
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [nailItems, setNailItems] = useState<NailItemDoc[]>([])
  const [nailTitle, setNailTitle] = useState('')
  const [nailTags, setNailTags] = useState('')
  const [nailMemo, setNailMemo] = useState('')
  const [nailImageFile, setNailImageFile] = useState<File | null>(null)
  const [nailImagePreview, setNailImagePreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [comparisonItemIds, setComparisonItemIds] = useState<string[]>([])
  const [nailLoading, setNailLoading] = useState(false)
  const [nailError, setNailError] = useState('')
  const [bannerError, setBannerError] = useState('')
  const [nailItemsUserId, setNailItemsUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
  const [activeMonthFilter, setActiveMonthFilter] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState('')
  const [shareId, setShareId] = useState('')
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [shareError, setShareError] = useState('')
  const [shareStatusMessage, setShareStatusMessage] = useState('')
  const [publicShares, setPublicShares] = useState<PublicShareDocWithId[]>([])
  const [publicSharesUserId, setPublicSharesUserId] = useState<string | null>(null)
  const [shareActionId, setShareActionId] = useState<string | null>(null)
  const [publicShare, setPublicShare] = useState<PublicShareDocWithId | null>(null)
  const [publicShareState, setPublicShareState] = useState<PublicShareViewState>(
    isPublicSharePage ? 'loading' : 'idle'
  )
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const dataModalCloseButtonRef = useRef<HTMLButtonElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="robots"]')
    const previousRobots = meta?.getAttribute('content') ?? null
    let createdMeta: HTMLMetaElement | null = null

    if (isPublicSharePage) {
      document.title = 'Shared nail collection'
    } else if (isPrivacyPage) {
      document.title = 'プライバシーポリシー | Nailous'
    } else if (isTermsPage) {
      document.title = '利用規約 | Nailous'
    } else {
      document.title = 'Nailous'
    }

    if (isPublicSharePage || isPrivacyPage || isTermsPage) {
      if (meta) {
        meta.setAttribute('content', 'noindex')
      } else {
        createdMeta = document.createElement('meta')
        createdMeta.name = 'robots'
        createdMeta.content = 'noindex'
        document.head.appendChild(createdMeta)
      }
    }

    return () => {
      document.title = previousTitle
      if (createdMeta) {
        createdMeta.remove()
      } else if (meta && previousRobots !== null) {
        meta.setAttribute('content', previousRobots)
      } else if (meta && isPublicSharePage) {
        meta.removeAttribute('content')
      }
    }
  }, [isPublicSharePage, isPrivacyPage, isTermsPage])

  useEffect(() => {
    if (!isPublicSharePage || !sharePathId) return

    let didCancel = false

    getPublicShare(sharePathId)
      .then(share => {
        if (didCancel) return
        if (!share) {
          setPublicShareState('not-found')
          return
        }
        if (share.isEnabled !== true) {
          setPublicShareState('disabled')
          return
        }
        setPublicShare(share)
        setPublicShareState('ready')
      })
      .catch((e: unknown) => {
        console.error('public share fetch failed', e)
        if (didCancel) return
        setPublicShareState('error')
        setBannerError('共有データの読み込みに失敗しました。')
      })

    return () => { didCancel = true }
  }, [isPublicSharePage, sharePathId])

  useEffect(() => onAuthStateChanged(auth, nextUser => {
    if (isPublicSharePage) return
    setUser(nextUser)
    if (!nextUser) {
      setNailItems([])
      setNailItemsUserId(null)
      setPublicShares([])
      setPublicSharesUserId(null)
      setDetailItemId(null)
      setComparisonItemIds([])
    }
  }), [isPublicSharePage])

  useEffect(() => {
    if (!isDataModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDataModalOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    dataModalCloseButtonRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDataModalOpen])

  useEffect(() => {
    if (isPublicSharePage) return
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
        setBannerError('ネイル一覧の取得に失敗しました。')
      })
    return () => { didCancel = true }
  }, [isPublicSharePage, user])

  useEffect(() => {
    if (isPublicSharePage) return
    if (!user) return
    let didCancel = false
    fetchPublicSharesForOwner(user.uid)
      .then(shares => {
        if (didCancel) return
        setPublicShares(sortPublicShares(shares))
        setPublicSharesUserId(user.uid)
      })
      .catch((e: unknown) => {
        console.error('public shares fetch failed', e)
        if (didCancel) return
        setPublicShares([])
        setPublicSharesUserId(user.uid)
        setShareError('共有リンクの取得に失敗しました。')
        setBannerError('共有リンクの取得に失敗しました。')
      })
    return () => { didCancel = true }
  }, [isPublicSharePage, user])

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

  const clearImageInputs = () => {
    if (uploadInputRef.current) uploadInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleNailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) { setNailImageFile(null); clearPreview(); setNailError(''); return }
    const err = validateImageFile(file)
    if (err) {
      setNailError(err)
      setNailImageFile(null)
      clearPreview()
      clearImageInputs()
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
    clearImageInputs()
  }

  const parseTags = (s: string): string[] =>
    s.split(',').map(t => t.trim()).filter(Boolean)

  const resetForm = () => {
    setNailTitle('')
    setNailTags('')
    setNailMemo('')
    setNailImageFile(null)
    clearPreview()
    clearImageInputs()
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
    setBannerError('')
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
      setNailItems(sortByDate(await fetchNailItems(uid)))
      setNailItemsUserId(uid)
      resetForm()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      const isStorageError = msg.toLowerCase().includes('storage') || msg.toLowerCase().includes('permission')
      const errorMsg = isStorageError
        ? '画像の保存に失敗しました。通信環境を確認し、もう一度お試しください。'
        : 'ネイルの保存に失敗しました。時間をおいて再度お試しください。'
      setNailError(errorMsg)
      setBannerError(errorMsg)
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
    clearImageInputs()
    setNailError('')
  }

  const handleDeleteNailItem = async (itemId: string) => {
    if (!user) return
    const item = nailItems.find(i => i.id === itemId)
    if (!window.confirm(`「${item?.title ?? 'このアイテム'}」を削除しますか？\nこの操作は取り消せません。`)) return
    const uid = user.uid
    if (editingId === itemId) resetForm()
    setComparisonItemIds(prev => prev.filter(id => id !== itemId))
    setNailLoading(true)
    setNailError('')
    setBannerError('')
    try {
      if (item?.imageUrl) {
        await deleteNailImage(uid, itemId).catch(() => {})
      }
      await deleteNailItem(uid, itemId)
      setNailItems(sortByDate(await fetchNailItems(uid)))
      setNailItemsUserId(uid)
    } catch {
      setBannerError('ネイルの削除に失敗しました。')
    } finally {
      setNailLoading(false)
    }
  }

  const editingItem = editingId ? nailItems.find(i => i.id === editingId) : null
  const detailItem = detailItemId ? nailItems.find(i => i.id === detailItemId) : null
  const comparisonItems = useMemo(() => {
    const selected = comparisonItemIds
      .map(id => nailItems.find(item => item.id === id))
      .filter((item): item is NailItemDoc => Boolean(item))
    return selected.length === 2 ? getSortedComparisonItems(selected) : selected
  }, [comparisonItemIds, nailItems])
  const isFetching = Boolean(user && nailItemsUserId !== user.uid)
  const summary = useMemo(() => getNailSummary(nailItems), [nailItems])

  const filteredItems = nailItems.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      if (!item.title.toLowerCase().includes(q) && !item.tags.some(t => t.toLowerCase().includes(q))) return false
    }
    if (activeTagFilter !== null && !item.tags.includes(activeTagFilter)) return false
    if (activeMonthFilter !== null && getItemMonth(item) !== activeMonthFilter) return false
    return true
  })

  const handleToggleComparisonItem = (itemId: string) => {
    setComparisonItemIds(prev => toggleComparisonId(prev, itemId))
  }

  const renderComparisonItem = (item: NailItemDoc, label: string) => {
    const createdDate = formatDate(item.createdAt)
    const updatedDate = formatDate(item.updatedAt)
    return (
      <article className="comparison-card">
        <p className="comparison-side-label">{label}</p>
        <div className="comparison-image-frame">
          {item.imageUrl ? (
            <img
              className="comparison-image"
              src={item.imageUrl}
              alt={item.title + ' の比較用ネイル画像'}
            />
          ) : (
            <div className="comparison-no-image">画像なし</div>
          )}
        </div>
        <div className="comparison-card-body">
          <h4 className="comparison-title">{item.title}</h4>
          <div className="comparison-section">
            <span className="comparison-label">タグ</span>
            {item.tags.length > 0 ? (
              <div className="nail-item-tags">
                {item.tags.map(t => (
                  <span key={t} className="nail-tag">#{t}</span>
                ))}
              </div>
            ) : (
              <p className="comparison-empty">タグなし</p>
            )}
          </div>
          {item.memo && (
            <div className="comparison-section">
              <span className="comparison-label">メモ</span>
              <p className="comparison-memo">{item.memo}</p>
            </div>
          )}
          <dl className="comparison-meta">
            {createdDate && (
              <div>
                <dt>作成日</dt>
                <dd>{createdDate}</dd>
              </div>
            )}
            {updatedDate && (
              <div>
                <dt>更新日</dt>
                <dd>{updatedDate}</dd>
              </div>
            )}
          </dl>
        </div>
      </article>
    )
  }

  const getShareUrl = (id: string): string =>
    typeof window === 'undefined' ? `/share/${id}` : `${window.location.origin}/share/${id}`

  const refreshPublicShares = async (uid: string): Promise<void> => {
    const shares = await fetchPublicSharesForOwner(uid)
    setPublicShares(sortPublicShares(shares))
    setPublicSharesUserId(uid)
  }

  const handleCreateShareLink = async () => {
    if (!user || filteredItems.length === 0) return

    setIsCreatingShare(true)
    setShareError('')
    setShareStatusMessage('')
    setBannerError('')

    try {
      const nextShareId = await createPublicShare(
        user.uid,
        `Nail collection snapshot ${new Date().toLocaleDateString('ja-JP')}`,
        filteredItems.map(item => ({
          id: item.id,
          title: item.title,
          tags: item.tags,
          createdAt: item.createdAt ?? null,
        }))
      )
      const nextShareUrl = getShareUrl(nextShareId)
      setShareId(nextShareId)
      setShareUrl(nextShareUrl)
      setShareStatusMessage('Share link created. Copy it to share this snapshot.')
      await refreshPublicShares(user.uid)
    } catch {
      const message = '共有リンクの作成に失敗しました。'
      setShareError(message)
      setBannerError(message)
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareLink = async () => {
    if (!shareUrl) return

    setShareError('')
    setShareStatusMessage('')

    if (!navigator.clipboard?.writeText) {
      setShareError('Clipboard API is not available in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatusMessage('Share link copied to clipboard.')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to copy share link.'
      setShareError(message)
    }
  }

  const handleCopyManagedShareLink = async (managedShareId: string) => {
    setShareError('')
    setShareStatusMessage('')

    if (!navigator.clipboard?.writeText) {
      setShareError('Clipboard API is not available in this browser.')
      return
    }

    try {
      await navigator.clipboard.writeText(getShareUrl(managedShareId))
      setShareStatusMessage('リンクをコピーしました。')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '共有リンクのコピーに失敗しました。'
      setShareError(message)
    }
  }

  const handleDisableShare = async () => {
    if (!shareId) return

    setIsCreatingShare(true)
    setShareError('')
    setShareStatusMessage('')
    setBannerError('')

    try {
      await disablePublicShare(shareId)
      setShareId('')
      setShareUrl('')
      setShareStatusMessage('Share link disabled.')
      if (user) await refreshPublicShares(user.uid)
    } catch {
      const message = '共有の停止に失敗しました。'
      setShareError(message)
      setBannerError(message)
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleDisableManagedShare = async (managedShare: PublicShareDocWithId) => {
    if (!user || !managedShare.isEnabled) return
    if (!window.confirm(`「${managedShare.title}」の共有を停止しますか？\n停止した共有リンクは再有効化できません。`)) return

    setShareActionId(managedShare.id)
    setShareError('')
    setShareStatusMessage('')
    setBannerError('')

    try {
      await disablePublicShare(managedShare.id)
      if (shareId === managedShare.id) {
        setShareId('')
        setShareUrl('')
      }
      await refreshPublicShares(user.uid)
      setShareStatusMessage('共有を停止しました。')
    } catch {
      const message = '共有の停止に失敗しました。'
      setShareError(message)
      setBannerError(message)
    } finally {
      setShareActionId(null)
    }
  }

  const renderPublicShareState = () => {
    if (publicShareState === 'loading') {
      return <p className="public-share-note">Loading shared collection...</p>
    }
    if (publicShareState === 'not-found') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared nail collection</h2>
          <p className="public-share-note">This shared collection could not be found.</p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (publicShareState === 'disabled') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared nail collection</h2>
          <p className="public-share-note">This shared collection is no longer available.</p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (publicShareState === 'error') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared nail collection</h2>
          <p className="public-share-note">We could not load this shared collection right now.</p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (!publicShare) return null

    return (
      <div id="public-share-page">
        <div className="public-share-header">
          <p className="public-share-kicker">Shared nail collection</p>
          <h2 className="public-share-heading">{publicShare.title}</h2>
          <p className="public-share-note">
            {publicShare.items.length} items shared. This page is read-only and does not include memo or image data.
          </p>
        </div>
        {publicShare.items.length === 0 ? (
          <p className="public-share-note">No items are included in this shared collection.</p>
        ) : (
          <ul id="public-share-list">
            {publicShare.items.map((item: PublicShareItemSnapshot) => {
              const createdDate = formatDate(item.createdAt)
              return (
                <li key={item.id} className="public-share-card">
                  <div className="public-share-card-body">
                    <span className="public-share-item-title">{item.title}</span>
                    {item.tags.length > 0 && (
                      <div className="public-share-tags">
                        {item.tags.map(tag => (
                          <span key={tag} className="nail-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {createdDate && (
                      <p className="public-share-created-at">{createdDate}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <a className="public-share-link" href="/">Back to home</a>
      </div>
    )
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const renderFooter = () => (
    <footer className="app-footer">
      <div className="footer-links">
        <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')}>利用規約</a>
        <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')}>プライバシーポリシー</a>
      </div>
      <p className="footer-copy">&copy; 2026 Nailous</p>
    </footer>
  )

  if (isPublicSharePage) {
    return (
      <section id="center">
        <h1 id="app-title">Nailous</h1>
        {renderPublicShareState()}
        {renderFooter()}
      </section>
    )
  }

  if (isPrivacyPage) {
    return (
      <section id="center">
        <h1 id="app-title">Nailous</h1>
        <PrivacyPolicyPage />
      </section>
    )
  }

  if (isTermsPage) {
    return (
      <section id="center">
        <h1 id="app-title">Nailous</h1>
        <TermsOfServicePage />
      </section>
    )
  }

  return (
    <section id="center">
      <h1 id="app-title">Nailous</h1>
      <ErrorBanner message={bannerError} onClose={() => setBannerError('')} />
      {detailItem && (
        <NailImageDetailViewer
          item={detailItem}
          onClose={() => setDetailItemId(null)}
        />
      )}
      {isDataModalOpen && (
        <div
          className="nail-detail-backdrop"
          role="presentation"
          onClick={() => setIsDataModalOpen(false)}
        >
          <div
            className="nail-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="data-mgmt-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="nail-detail-header">
              <p className="nail-detail-kicker">データ管理</p>
              <button
                ref={dataModalCloseButtonRef}
                type="button"
                className="nail-detail-close"
                onClick={() => setIsDataModalOpen(false)}
                aria-label="データ管理を閉じる"
              >
                閉じる
              </button>
            </div>
            <div className="nail-detail-body">
              <h2 id="data-mgmt-title" className="nail-detail-title">ヘルプとデータ管理</h2>
              <div className="nail-detail-section">
                <h3 className="nail-detail-label">データのエクスポート</h3>
                <p className="help-text">
                  「コレクション概要」セクションにある CSV または JSON ボタンから、登録済みのネイル情報をいつでもダウンロードできます。
                </p>
              </div>
              <div className="nail-detail-section">
                <h3 className="nail-detail-label">データの削除</h3>
                <p className="help-text">
                  各ネイルアイテムの「Delete」ボタンから個別にデータを削除できます。
                </p>
                <p className="help-text">
                  アカウントの退会および全データの完全消去をご希望の場合は、プライバシーポリシーに基づき、ご本人確認のため登録メールアドレスより下記サポート窓口までご連絡ください。
                </p>
                <div style={{ marginTop: '8px' }}>
                  <a href="mailto:kikushun0529@gmail.com" className="help-mailto">
                    kikushun0529@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="auth-bar">
        {user === undefined ? null : user ? (
          <div className="auth-user">
            <span>{user.displayName ?? user.email}</span>
            <button
              type="button"
              className="auth-data-mgmt"
              onClick={() => setIsDataModalOpen(true)}
            >
              データ管理
            </button>
            <button type="button" onClick={() => {
              signOutUser().catch((e: unknown) => console.error('sign-out failed', e))
            }}>Sign out</button>
          </div>
        ) : (
          <div className="auth-signin-container">
            <button type="button" className="auth-signin" onClick={() => {
              signInWithGoogle().catch((e: unknown) => console.error('sign-in failed', e))
            }}>
              Sign in with Google
            </button>
            <div className="auth-signin-links">
              <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')}>利用規約</a>
              <span>・</span>
              <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')}>プライバシーポリシー</a>
            </div>
          </div>
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
              <div className="nail-file-options">
                <label className="nail-file-option">
                  <span>画像を選択</span>
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNailFileChange}
                    className="nail-file-input"
                  />
                </label>
                <label className="nail-file-option">
                  <span>写真を撮る</span>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleNailFileChange}
                    className="nail-file-input"
                  />
                </label>
              </div>
              <p className="nail-file-note">カメラが使えない場合は画像を選択してください。</p>
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
            <div id="nail-summary">
              <h3 className="summary-heading">コレクション概要</h3>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="summary-stat-value">{summary.totalCount}</span>
                  <span className="summary-stat-label">合計</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-stat-value">{summary.withImageCount}</span>
                  <span className="summary-stat-label">画像あり</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-stat-value">{summary.withoutImageCount}</span>
                  <span className="summary-stat-label">画像なし</span>
                </div>
              </div>
              {summary.tagCounts.length > 0 && (
                <div className="summary-section">
                  <h4 className="summary-section-title">タグ</h4>
                  <div className="summary-tags">
                    {summary.tagCounts.map(({ tag, count }) => (
                      <button
                        key={tag}
                        type="button"
                        className={`summary-tag${activeTagFilter === tag ? ' summary-tag--active' : ''}`}
                        onClick={() => setActiveTagFilter(prev => prev === tag ? null : tag)}
                      >
                        #{tag}<span className="summary-tag-count">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {summary.monthlyCounts.length > 0 && (
                <div className="summary-section">
                  <h4 className="summary-section-title">月別</h4>
                  <div className="summary-monthly">
                    {summary.monthlyCounts.map(({ month, count }) => (
                      <button
                        key={month}
                        type="button"
                        className={`summary-monthly-row${activeMonthFilter === month ? ' summary-monthly-row--active' : ''}`}
                        onClick={() => setActiveMonthFilter(prev => prev === month ? null : month)}
                      >
                        <span className="summary-monthly-label">{month}</span>
                        <span className="summary-monthly-count">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {summary.recentItems.length > 0 && (
                <div className="summary-section">
                  <h4 className="summary-section-title">最近の更新</h4>
                  <ul className="summary-recent">
                    {summary.recentItems.map(item => (
                      <li key={item.id} className="summary-recent-item">
                        <span className={`summary-recent-dot${item.imageUrl ? ' summary-recent-dot--image' : ''}`} />
                        <span className="summary-recent-title">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="summary-section">
                <h4 className="summary-section-title">エクスポート</h4>
                <p className="summary-export-note">エクスポートには保存済みのネイル情報と画像URLが含まれます。画像ファイル本体は含まれません。</p>
                <div className="summary-export-actions">
                  <button
                    type="button"
                    className="btn-export"
                    onClick={() => downloadTextFile(
                      `nail-report-export-${getExportDateStamp()}.csv`,
                      toCsv(nailItems),
                      'text/csv;charset=utf-8;'
                    )}
                    disabled={nailItems.length === 0}
                  >Export CSV</button>
                  <button
                    type="button"
                    className="btn-export"
                    onClick={() => downloadTextFile(
                      `nail-report-export-${getExportDateStamp()}.json`,
                      toJson(nailItems),
                      'application/json'
                    )}
                    disabled={nailItems.length === 0}
                  >Export JSON</button>
                </div>
              </div>
            </div>
          )}
          {!isFetching && (
            <div id="nail-share" className="share-section">
              <h3 className="summary-heading">Share collection</h3>
              <p className="share-privacy-note">
                共有リンクを知っている人は、このコレクションを閲覧できます。MVPではメモと画像は共有対象に含まれません。個人情報を含む内容を共有しないよう確認してください。共有はいつでも停止できます。
              </p>
              <p className="share-description">
                現在表示中のアイテムを共有します。検索・タグ・月フィルターが適用されている場合、その結果だけが共有されます。
              </p>
              <div className="share-meta">
                <span>{filteredItems.length} items ready to share</span>
                {filteredItems.length === 0 && <span>No items to share</span>}
              </div>
              <div className="summary-export-actions share-actions">
                <button
                  type="button"
                  className="btn-export"
                  onClick={handleCreateShareLink}
                  disabled={isCreatingShare || filteredItems.length === 0}
                >
                  {isCreatingShare ? 'Creating...' : 'Create share link'}
                </button>
                <button
                  type="button"
                  className="btn-export"
                  onClick={handleCopyShareLink}
                  disabled={!shareUrl}
                >
                  Copy share link
                </button>
                <button
                  type="button"
                  className="btn-export btn-export-danger"
                  onClick={handleDisableShare}
                  disabled={!shareId || isCreatingShare}
                >
                  Disable share
                </button>
              </div>
              {shareUrl && (
                <div className="share-url-box">
                  <span className="share-url-label">Share URL</span>
                  <code className="share-url-value">{shareUrl}</code>
                </div>
              )}
              {shareStatusMessage && <p className="share-status">{shareStatusMessage}</p>}
              {shareError && <p className="share-error">{shareError}</p>}
              <div className="share-management">
                <h4 className="summary-section-title">共有リンク管理</h4>
                {user && publicSharesUserId !== user.uid ? (
                  <p className="share-description">共有リンクを読み込んでいます...</p>
                ) : publicShares.length === 0 ? (
                  <p className="share-description">共有リンクはまだありません</p>
                ) : (
                  <ul className="share-management-list">
                    {publicShares.map(managedShare => {
                      const managedShareUrl = getShareUrl(managedShare.id)
                      const createdDate = formatDate(managedShare.createdAt)
                      const updatedDate = formatDate(managedShare.updatedAt)
                      return (
                        <li key={managedShare.id} className="share-management-item">
                          <div className="share-management-main">
                            <div className="share-management-title-row">
                              <span className="share-management-title">{managedShare.title}</span>
                              <span className={`share-state ${managedShare.isEnabled ? 'share-state--enabled' : 'share-state--disabled'}`}>
                                {managedShare.isEnabled ? '有効' : '無効'}
                              </span>
                            </div>
                            <div className="share-management-dates">
                              {createdDate && <span>作成: {createdDate}</span>}
                              {updatedDate && <span>更新: {updatedDate}</span>}
                            </div>
                            <code className="share-management-url">{managedShareUrl}</code>
                          </div>
                          <div className="share-management-actions">
                            <a
                              className="btn-export share-open-link"
                              href={managedShareUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              開く
                            </a>
                            <button
                              type="button"
                              className="btn-export"
                              onClick={() => { void handleCopyManagedShareLink(managedShare.id) }}
                            >
                              リンクをコピー
                            </button>
                            <button
                              type="button"
                              className="btn-export btn-export-danger"
                              onClick={() => { void handleDisableManagedShare(managedShare) }}
                              disabled={!managedShare.isEnabled || shareActionId === managedShare.id}
                            >
                              {shareActionId === managedShare.id ? '停止中...' : '共有を停止'}
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
          {!isFetching && comparisonItems.length > 0 && (
            <section className="comparison-panel" aria-labelledby="comparison-heading">
              <div className="comparison-header">
                <div>
                  <h3 id="comparison-heading" className="summary-heading">ネイル比較</h3>
                  <p className="comparison-prompt">
                    {comparisonItems.length === 1
                      ? '比較するネイルをもう1つ選択してください'
                      : '2つのネイルを日付順（前・後）で比較しています'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-export"
                  onClick={() => setComparisonItemIds([])}
                >
                  比較をクリア
                </button>
              </div>
              <div className="comparison-grid">
                {comparisonItems.length === 2 ? (
                  <>
                    {renderComparisonItem(comparisonItems[0], '前')}
                    {renderComparisonItem(comparisonItems[1], '後')}
                  </>
                ) : (
                  <>
                    {renderComparisonItem(comparisonItems[0], '選択中')}
                    <div className="comparison-card-placeholder">
                      <p>2つ目を選択してください</p>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
          {!isFetching && nailItems.length > 0 && (activeTagFilter !== null || activeMonthFilter !== null) && (
            <div className="filter-bar">
              {activeTagFilter !== null && (
                <span className="filter-pill">タグ: #{activeTagFilter}</span>
              )}
              {activeMonthFilter !== null && (
                <span className="filter-pill">月: {activeMonthFilter}</span>
              )}
              <button
                type="button"
                className="filter-clear"
                onClick={() => { setActiveTagFilter(null); setActiveMonthFilter(null) }}
              >Clear filters</button>
            </div>
          )}
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
            <div role="status">
              <span className="sr-only">ネイル一覧を読み込み中...</span>
              <ul id="nail-list" className="nail-skeleton-list">
                {[...Array(4)].map((_, i) => (
                  <li key={i} className="nail-skeleton-card" aria-hidden="true">
                    <div className="nail-skeleton-thumb shimmer" />
                    <div className="nail-skeleton-body">
                      <div className="nail-skeleton-title shimmer" />
                      <div className="nail-skeleton-tags">
                        <div className="nail-skeleton-tag shimmer" />
                        <div className="nail-skeleton-tag shimmer" />
                      </div>
                      <div className="nail-skeleton-date shimmer" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
            <p className="nail-search-empty">条件に一致するアイテムがありません。</p>
          ) : (
            <ul id="nail-list" className={nailLoading ? 'loading' : ''}>
              {filteredItems.map(item => {
                const createdDate = formatDate(item.createdAt)
                const updatedDate = (item.updatedAt && item.createdAt &&
                  item.updatedAt.seconds !== item.createdAt.seconds)
                  ? formatDate(item.updatedAt)
                  : null
                const isCompareSelected = comparisonItemIds.includes(item.id)
                return (
                  <li
                    key={item.id}
                    className={[
                      editingId === item.id ? 'editing' : '',
                      isCompareSelected ? 'comparison-selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div
                      className="nail-card-thumb"
                      onClick={() => setDetailItemId(item.id)}
                    >
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
                    <div
                      className="nail-card-body"
                      onClick={() => setDetailItemId(item.id)}
                    >
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
                        onClick={() => setDetailItemId(item.id)}
                      >詳しく見る</button>
                      <button
                        type="button"
                        onClick={() => handleToggleComparisonItem(item.id)}
                      >{isCompareSelected ? '比較から外す' : '比較に追加'}</button>
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
      {renderFooter()}
    </section>
  )
}

export default App
