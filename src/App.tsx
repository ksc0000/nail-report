import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react'
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
import {
  MAX_NAIL_TAG_LENGTH,
  MAX_NAIL_TAGS,
  MAX_NAIL_TITLE_LENGTH,
  parseNailTags,
  validateNailTitle,
} from './lib/nailTags'
import { fileToGenerativePart, urlToGenerativePart, generateNailTagsFromImage } from './lib/aiUtils'
import { isAiTagSuggestionEnabled } from './lib/featureFlags'
import { isFirebaseConfigComplete, missingFirebaseEnvKeys } from './lib/firebaseConfigStatus'
import ErrorBanner from './components/ErrorBanner'
import FloatingNailChip from './components/FloatingNailChip'
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage'))
const NailImageDetailViewer = lazy(() => import('./components/NailImageDetailViewer'))
const NailComparisonPanel = lazy(() => import('./components/NailComparisonPanel'))
import './App.css'

const DISPLAY_MODES = ['Glass', 'Snow Globe', 'Velvet', 'Showcase'] as const
type DisplayMode = typeof DISPLAY_MODES[number]

const NAIL_SHAPES = [
  { id: 'round', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'almond', label: 'Almond' },
  { id: 'coffin', label: 'Coffin' },
  { id: 'stiletto', label: 'Stiletto' },
] as const
type NailShape = typeof NAIL_SHAPES[number]['id']

const NAIL_COLORS = [
  { id: 'blush', label: 'Blush' },
  { id: 'rose', label: 'Rose' },
  { id: 'lavender', label: 'Lavender' },
  { id: 'mint', label: 'Mint' },
  { id: 'champagne', label: 'Champagne' },
] as const
type NailColor = typeof NAIL_COLORS[number]['id']

const NAIL_TEXTURES = [
  { id: 'gloss', label: 'Gloss' },
  { id: 'matte', label: 'Matte' },
  { id: 'glitter', label: 'Glitter' },
  { id: 'chrome', label: 'Chrome' },
] as const
type NailTexture = typeof NAIL_TEXTURES[number]['id']

const DECORATION_PARTS = [
  { id: 'pearl', label: 'Pearl' },
  { id: 'stone', label: 'Stone' },
  { id: 'line', label: 'Gold Line' },
  { id: 'foil', label: 'Foil' },
  { id: 'ribbon', label: 'Ribbon' },
] as const
type DecorationPart = typeof DECORATION_PARTS[number]['id']

const INSPIRATION_CARDS = [
  { id: 'milk-glass', title: 'Milk glass', tone: 'blush', tags: ['soft', 'daily'] },
  { id: 'aurora-mint', title: 'Aurora mint', tone: 'mint', tags: ['fresh', 'sheer'] },
  { id: 'velvet-rose', title: 'Velvet rose', tone: 'rose', tags: ['date', 'gloss'] },
] as const

const INSPIRATION_CATEGORIES = ['All', 'Daily', 'Event', 'Season', 'Salon'] as const
type InspirationCategory = typeof INSPIRATION_CATEGORIES[number]

const SAVED_DESIGN_FIELDS = ['Image', 'Shape', 'Color', 'Tags', 'Memo'] as const

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
  imageSource: string
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
  imageSource: item.imageSource ?? 'unknown',
  createdAt: formatTimestampForExport(item.createdAt),
  updatedAt: formatTimestampForExport(item.updatedAt),
})

const CSV_HEADERS = ['id', 'title', 'tags', 'memo', 'imageUrl', 'imageSource', 'createdAt', 'updatedAt'] as const

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

type PublicShareViewState = 'idle' | 'loading' | 'ready' | 'not-found' | 'disabled' | 'error'

const firebaseConfigErrorMessage = missingFirebaseEnvKeys.length > 0
  ? `Firebase 設定が不足しています: ${missingFirebaseEnvKeys.join(', ')}`
  : ''

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
  const [user, setUser] = useState<User | null | undefined>(
    isFirebaseConfigComplete ? undefined : null
  )
  const [nailItems, setNailItems] = useState<NailItemDoc[]>([])
  const [nailTitle, setNailTitle] = useState('')
  const [nailTags, setNailTags] = useState('')
  const [nailMemo, setNailMemo] = useState('')
  const [selectedNailShape, setSelectedNailShape] = useState<NailShape>('round')
  const [selectedNailColor, setSelectedNailColor] = useState<NailColor>('blush')
  const [selectedNailTexture, setSelectedNailTexture] = useState<NailTexture>('gloss')
  const [selectedDecorationParts, setSelectedDecorationParts] = useState<DecorationPart[]>([])
  const [activeInspirationCategory, setActiveInspirationCategory] = useState<InspirationCategory>('All')
  const [nailImageFile, setNailImageFile] = useState<File | null>(null)
  const [nailImagePreview, setNailImagePreview] = useState<string | null>(null)
  const [nailImageSource, setNailImageSource] = useState<'upload' | 'camera' | 'unknown'>('unknown')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [comparisonItemIds, setComparisonItemIds] = useState<string[]>([])
  const [nailLoading, setNailLoading] = useState(false)
  const [nailError, setNailError] = useState('')
  const [isAIGeneratingTags, setIsAIGeneratingTags] = useState(false)
  const [authActionPending, setAuthActionPending] = useState(false)
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
  const [activeDisplayMode, setActiveDisplayMode] = useState<DisplayMode>('Glass')
  const [publicShare, setPublicShare] = useState<PublicShareDocWithId | null>(null)
  const [publicShareState, setPublicShareState] = useState<PublicShareViewState>(
    isPublicSharePage ? 'loading' : 'idle'
  )
  const publicShareDisplayState: PublicShareViewState =
    !isFirebaseConfigComplete && isPublicSharePage ? 'error' : publicShareState
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
      document.title = 'Shared collection | Nailous'
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
    if (!isFirebaseConfigComplete) return

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

  useEffect(() => {
    if (!isFirebaseConfigComplete) return
    return onAuthStateChanged(auth, nextUser => {
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
    })
  }, [isPublicSharePage])

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

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleSignIn = async () => {
    if (authActionPending) return
    setAuthActionPending(true)
    setBannerError('')
    try {
      await signInWithGoogle()
    } catch (e: unknown) {
      console.error('sign-in failed', e)
      setBannerError('Google サインインに失敗しました。時間をおいて再度お試しください。')
    } finally {
      setAuthActionPending(false)
    }
  }

  const handleSignOut = async () => {
    if (authActionPending) return
    setAuthActionPending(true)
    setBannerError('')
    try {
      await signOutUser()
    } catch (e: unknown) {
      console.error('sign-out failed', e)
      setBannerError('サインアウトに失敗しました。時間をおいて再度お試しください。')
    } finally {
      setAuthActionPending(false)
    }
  }

  const handleNailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      setNailImageFile(null)
      clearPreview()
      setNailError('')
      setNailImageSource('unknown')
      return
    }
    const err = validateImageFile(file)
    if (err) {
      setNailError(err)
      setNailImageFile(null)
      clearPreview()
      clearImageInputs()
      setNailImageSource('unknown')
      return
    }
    setNailError('')
    setNailImageFile(file)
    if (e.target === cameraInputRef.current) {
      setNailImageSource('camera')
    } else if (e.target === uploadInputRef.current) {
      setNailImageSource('upload')
    } else {
      setNailImageSource('unknown')
    }
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
    setNailImageSource('unknown')
  }

  const resetForm = () => {
    setNailTitle('')
    setNailTags('')
    setNailMemo('')
    setSelectedNailShape('round')
    setSelectedNailColor('blush')
    setSelectedNailTexture('gloss')
    setSelectedDecorationParts([])
    setNailImageFile(null)
    clearPreview()
    clearImageInputs()
    setNailImageSource('unknown')
    setEditingId(null)
    setNailError('')
  }

  const handleGenerateTagsWithAI = async () => {
    if (!isAiTagSuggestionEnabled) {
      setNailError('AIタグ生成は現在無効です。')
      return
    }
    try {
      setIsAIGeneratingTags(true)
      setNailError('')
      let imagePart
      if (nailImageFile) {
        imagePart = await fileToGenerativePart(nailImageFile)
      } else if (editingItem?.imageUrl) {
        imagePart = await urlToGenerativePart(editingItem.imageUrl)
      } else {
        setNailError('画像が選択されていません。')
        return
      }
      
      const generatedTags = await generateNailTagsFromImage(imagePart)
      // Clean up the tags, ensure comma separated
      const cleanTags = generatedTags.replace(/\n/g, '').trim()
      setNailTags(cleanTags)
    } catch (err: unknown) {
      console.error('AI tag generation error:', err)
      const message = err instanceof Error ? err.message : String(err)
      setNailError('AIによるタグ生成に失敗しました: ' + message)
    } finally {
      setIsAIGeneratingTags(false)
    }
  }

  const handleToggleDecorationPart = (part: DecorationPart) => {
    setSelectedDecorationParts(prev =>
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    )
  }

  const handleSubmitNailItem = async () => {
    if (!user || nailTitle.trim() === '') return
    const titleErr = validateNailTitle(nailTitle.trim())
    if (titleErr) {
      setNailError(titleErr)
      return
    }
    if (nailImageFile) {
      const err = validateImageFile(nailImageFile)
      if (err) { setNailError(err); return }
    }
    const parsedTags = parseNailTags(nailTags)
    if (parsedTags.error) {
      setNailError(parsedTags.error)
      return
    }
    const uid = user.uid
    setNailLoading(true)
    setNailError('')
    setBannerError('')
    const baseInput = {
      title: nailTitle.trim(),
      tags: parsedTags.tags,
      memo: nailMemo.trim(),
      imageSource: nailImageSource,
    }
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
    setSelectedNailShape('round')
    setSelectedNailColor('blush')
    setSelectedNailTexture('gloss')
    setSelectedDecorationParts([])
    setNailImageSource(item.imageSource ?? 'unknown')
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

    await copyShareUrl(shareUrl)
  }

  const handleCopyManagedShareLink = async (managedShareId: string) => {
    setShareError('')
    setShareStatusMessage('')

    await copyShareUrl(getShareUrl(managedShareId))
  }

  const copyShareUrl = async (url: string) => {
    if (!navigator.clipboard?.writeText) {
      setShareStatusMessage('コピー機能が使えないため、表示されているURLを選択してコピーしてください。')
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareStatusMessage('リンクをコピーしました。')
    } catch {
      setShareStatusMessage('自動コピーできませんでした。表示されているURLを選択してコピーしてください。')
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
    if (publicShareDisplayState === 'loading') {
      return <p className="public-share-note">Loading shared collection...</p>
    }
    if (publicShareDisplayState === 'not-found') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared Nailous collection</h2>
          <p className="public-share-note">This shared collection could not be found.</p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (publicShareDisplayState === 'disabled') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared Nailous collection</h2>
          <p className="public-share-note">This shared collection is no longer available.</p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (publicShareDisplayState === 'error') {
      return (
        <div className="public-share-empty">
          <h2 className="public-share-heading">Shared Nailous collection</h2>
          <p className="public-share-note">
            {firebaseConfigErrorMessage || 'We could not load this shared collection right now.'}
          </p>
          <a className="public-share-link" href="/">Back to home</a>
        </div>
      )
    }
    if (!publicShare) return null

    return (
      <div id="public-share-page">
        <div className="public-share-header">
          <p className="public-share-kicker">Shared Nailous collection</p>
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

  const renderDisplayModeSwitcher = (className = '') => (
    <div className={`display-mode-switcher ${className}`.trim()} role="group" aria-label="表示モード">
      {DISPLAY_MODES.map(mode => (
        <button
          key={mode}
          type="button"
          className={mode === activeDisplayMode ? 'active' : undefined}
          aria-pressed={mode === activeDisplayMode}
          onClick={() => setActiveDisplayMode(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
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
        <Suspense fallback={<div className="lazy-loading">読み込み中...</div>}>
          <PrivacyPolicyPage />
        </Suspense>
      </section>
    )
  }

  if (isTermsPage) {
    return (
      <section id="center">
        <h1 id="app-title">Nailous</h1>
        <Suspense fallback={<div className="lazy-loading">読み込み中...</div>}>
          <TermsOfServicePage />
        </Suspense>
      </section>
    )
  }

  return (
    <section id="center" className={user ? undefined : 'is-signed-out'}>
      <h1 id="app-title">Nailous</h1>
      <ErrorBanner
        message={firebaseConfigErrorMessage || bannerError}
        onClose={() => {
          if (!firebaseConfigErrorMessage) setBannerError('')
        }}
      />
      {detailItem && (
        <Suspense fallback={<div className="lazy-loading">読み込み中...</div>}>
          <NailImageDetailViewer
            item={detailItem}
            onClose={() => setDetailItemId(null)}
          />
        </Suspense>
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
              <p className="help-text">
                登録されたデータはお客様自身のものであり、いつでもエクスポートや削除を行うことができます。
              </p>
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
                <div className="help-contact">
                  <a href="mailto:kikushun0529@gmail.com" className="help-mailto">
                    kikushun0529@gmail.com
                  </a>
                </div>
              </div>
              <div className="nail-detail-section">
                <h3 className="nail-detail-label">ポリシーと規約</h3>
                <p className="help-text">
                  個人情報の取り扱い、共有範囲、削除依頼の詳細は以下から確認できます。
                </p>
                <div className="help-link-row">
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); setIsDataModalOpen(false); navigateTo('/privacy') }}>
                    プライバシーポリシー
                  </a>
                  <a href="/terms" onClick={(e) => { e.preventDefault(); setIsDataModalOpen(false); navigateTo('/terms') }}>
                    利用規約
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user !== null && (
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
              <button type="button" onClick={handleSignOut} disabled={authActionPending}>
                {authActionPending ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          ) : null}
        </div>
      )}
      {user === null && (
        <div className="landing-shell" aria-label="Nailous jewelry box preview">
          <div className="landing-topbar" aria-hidden="true">
            <span>SPHERE</span>
            <span>20 / 30</span>
          </div>

          <section className="landing-hero">
            <div className="landing-title-block">
              <p className="landing-kicker">YOUR NAIL COLLECTION</p>
              <h2 className="landing-title">NAILOUS</h2>
              <p className="landing-lead">Glass case for every nail you loved.</p>
            </div>

            <div className="landing-showcase" aria-hidden="true">
              {[
                'pearl', 'rose', 'lilac', 'opal', 'champagne', 'mint',
                'coral', 'ivory', 'violet', 'blush', 'shell', 'moon',
              ].map(charm => (
                <FloatingNailChip key={charm} className={`landing-charm-${charm}`} />
              ))}
              <div className="landing-stage" />
            </div>

            <div className="landing-panel">
              <p className="landing-panel-kicker">GLASS CASE</p>
              <h3>ネイルを宝石箱のように集める。</h3>
              <p>
                写真を保存するだけでなく、形・色・艶が浮かぶコレクションとして眺められるホームへ。
              </p>
              <div className="landing-actions">
                <button
                  type="button"
                  className="auth-signin landing-signin"
                  onClick={handleSignIn}
                  disabled={!isFirebaseConfigComplete || authActionPending}
                >
                  {authActionPending ? 'Signing in...' : 'Sign in with Google'}
                </button>
                <span className="landing-action-note">保存・比較・共有をはじめる</span>
              </div>
              <div className="landing-legal-links">
                <a href="/terms" onClick={(e) => handleLinkClick(e, '/terms')}>利用規約</a>
                <span>・</span>
                <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')}>プライバシーポリシー</a>
              </div>
              {!isFirebaseConfigComplete && (
                <p className="auth-config-note">{firebaseConfigErrorMessage}</p>
              )}
            </div>
          </section>

          {renderDisplayModeSwitcher('landing-mode-switcher')}
        </div>
      )}
      {user && (
        <div id="nail-section">
          <section className="nail-studio-hero" aria-labelledby="studio-title">
            <div>
              <p className="nail-studio-kicker">JEWELRY BOX STUDIO</p>
              <h2 id="studio-title">ネイルを一つずつ、宝石箱へ。</h2>
              <p>
                追加した写真はあとから浮遊ビュー・比較・共有へつながります。
                まずは今日のネイルを一つ、コレクションに入れておきましょう。
              </p>
            </div>
            <div className="nail-studio-count" aria-label={`保存済みネイル ${nailItems.length} 件`}>
              <span>{nailItems.length}</span>
              <small>saved</small>
            </div>
          </section>
          {renderDisplayModeSwitcher('studio-mode-switcher')}
          <section className="nail-design-screen" aria-labelledby="nail-design-title">
            <div className="nail-design-header">
              <div>
                <p className="nail-design-kicker">NAIL DESIGN</p>
                <h3 id="nail-design-title">次のネイルを記録する。</h3>
                <p>写真・タグ・メモをまとめて、あとから浮遊ビューや共有に使える形で保存します。</p>
              </div>
              <div className="nail-design-meta" aria-label="保存できる情報">
                <span>Photo</span>
                <span>Tags</span>
                <span>Memo</span>
              </div>
            </div>
            <div id="nail-form">
              <h2 className="nail-form-title">{editingId ? 'Edit charm' : 'Add to jewelry box'}</h2>
              <input
                type="text"
                value={nailTitle}
                onChange={e => setNailTitle(e.target.value)}
                placeholder="Title *"
                className="nail-input"
                maxLength={MAX_NAIL_TITLE_LENGTH}
              />
              <input
                type="text"
                value={nailTags}
                onChange={e => setNailTags(e.target.value)}
                placeholder="Tags (comma separated, max 10)"
                className="nail-input"
              />
              <p className="nail-input-note">
                タグはカンマ区切りで最大{MAX_NAIL_TAGS}個、1つ{MAX_NAIL_TAG_LENGTH}文字まで。
              </p>
              <div className="nail-shape-control" role="group" aria-label="ネイル形状">
                <div className="nail-control-heading">
                  <span>Shape</span>
                  <small>ビュー用の選択。保存連携は後続フェーズで追加します。</small>
                </div>
                <div className="nail-shape-options">
                  {NAIL_SHAPES.map(shape => (
                    <button
                      key={shape.id}
                      type="button"
                      className={`nail-shape-option${selectedNailShape === shape.id ? ' nail-shape-option--selected' : ''}`}
                      aria-pressed={selectedNailShape === shape.id}
                      onClick={() => setSelectedNailShape(shape.id)}
                    >
                      <span className={`nail-shape-preview nail-shape-preview--${shape.id}`} aria-hidden="true" />
                      <span>{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="nail-appearance-control">
                <div className="nail-color-control" role="group" aria-label="メインカラー">
                  <div className="nail-control-heading">
                    <span>Color</span>
                    <small>メインカラー</small>
                  </div>
                  <div className="nail-color-options">
                    {NAIL_COLORS.map(color => (
                      <button
                        key={color.id}
                        type="button"
                        className={`nail-color-option${selectedNailColor === color.id ? ' nail-color-option--selected' : ''}`}
                        aria-pressed={selectedNailColor === color.id}
                        onClick={() => setSelectedNailColor(color.id)}
                      >
                        <span className={`nail-color-swatch nail-color-swatch--${color.id}`} aria-hidden="true" />
                        <span>{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="nail-texture-control" role="group" aria-label="質感">
                  <div className="nail-control-heading">
                    <span>Texture</span>
                    <small>仕上げ</small>
                  </div>
                  <div className="nail-texture-options">
                    {NAIL_TEXTURES.map(texture => (
                      <button
                        key={texture.id}
                        type="button"
                        className={`nail-texture-option nail-texture-option--${texture.id}${selectedNailTexture === texture.id ? ' nail-texture-option--selected' : ''}`}
                        aria-pressed={selectedNailTexture === texture.id}
                        onClick={() => setSelectedNailTexture(texture.id)}
                      >
                        {texture.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="nail-decoration-control" role="group" aria-label="デコレーションパーツ">
                <div className="nail-control-heading">
                  <span>Deco Parts</span>
                  <small>複数選択できます。保存連携は後続フェーズで追加します。</small>
                </div>
                <div className="nail-decoration-options">
                  {DECORATION_PARTS.map(part => {
                    const isSelected = selectedDecorationParts.includes(part.id)
                    return (
                      <button
                        key={part.id}
                        type="button"
                        className={`nail-decoration-option nail-decoration-option--${part.id}${isSelected ? ' nail-decoration-option--selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => handleToggleDecorationPart(part.id)}
                      >
                        <span className="nail-decoration-preview" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                        <span>{part.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              {isAiTagSuggestionEnabled && (nailImageFile || editingItem?.imageUrl) && (
                <button
                  type="button"
                  className="ai-tag-btn"
                  onClick={handleGenerateTagsWithAI}
                  disabled={isAIGeneratingTags}
                >
                  {isAIGeneratingTags ? 'AIがタグを生成中...' : '✨ 画像からAIでタグを生成'}
                </button>
              )}
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
                    <span>アルバムから選択</span>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleNailFileChange}
                      className="nail-file-input"
                    />
                  </label>
                  <label className="nail-file-option">
                    <span>カメラで撮影</span>
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
                <p className="nail-file-note">カメラが起動しない場合は、アルバムから画像を選択してください。</p>
                {isAiTagSuggestionEnabled && (
                  <p className="nail-file-privacy-note">
                    写真は非公開で保存されます。「AIでタグを生成」ボタンを押した場合のみ、画像が一時的にAIによる解析へ送信されます（AIの学習には使用されません）。
                  </p>
                )}
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
          </section>
          <section className="inspiration-screen" aria-labelledby="inspiration-title">
            <div className="inspiration-header">
              <div>
                <p className="nail-design-kicker">INSPIRATION</p>
                <h3 id="inspiration-title">次のムードを探す。</h3>
                <p>保存前のアイデアを眺めるためのExplore領域です。カードは今後、実データやカテゴリに接続します。</p>
              </div>
              <span className="inspiration-badge">Static preview</span>
            </div>
            <div className="inspiration-category-tabs" role="tablist" aria-label="Inspiration categories">
              {INSPIRATION_CATEGORIES.map(category => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  className={activeInspirationCategory === category ? 'active' : undefined}
                  aria-selected={activeInspirationCategory === category}
                  onClick={() => setActiveInspirationCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="inspiration-card-grid">
              {INSPIRATION_CARDS.map(card => (
                <article key={card.id} className={`inspiration-card inspiration-card--${card.tone}`}>
                  <div className="inspiration-card-stage" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="inspiration-card-body">
                    <h4>{card.title}</h4>
                    <div className="inspiration-tags">
                      {card.tags.map(tag => <span key={tag}>#{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="saved-designs-screen" aria-labelledby="saved-designs-title">
            <div className="saved-designs-header">
              <div>
                <p className="nail-design-kicker">SAVED DESIGNS</p>
                <h3 id="saved-designs-title">また使いたいデザインを集める。</h3>
                <p>
                  お気に入りの組み合わせをあとで見返すための静的サーフェスです。
                  後続フェーズで保存済みネイルやいいね状態に接続します。
                </p>
              </div>
              <span className="saved-designs-badge">Ready for data</span>
            </div>
            <div className="saved-designs-surface">
              <div className="saved-designs-empty">
                <div className="saved-designs-empty-stage" aria-hidden="true">
                  <FloatingNailChip
                    variant="empty"
                    shape="almond"
                    className="saved-designs-chip saved-designs-chip--one"
                    showHighlight={false}
                  />
                  <FloatingNailChip
                    variant="empty"
                    shape="oval"
                    className="saved-designs-chip saved-designs-chip--two"
                    showHighlight={false}
                  />
                </div>
                <div>
                  <h4>保存デザインはまだありません</h4>
                  <p>写真・形・色・タグが接続されると、ここにお気に入りのネイルカードが並びます。</p>
                </div>
              </div>
              <div className="saved-designs-data-slots" aria-label="後続接続予定の項目">
                {SAVED_DESIGN_FIELDS.map(field => (
                  <span key={field}>{field}</span>
                ))}
              </div>
            </div>
          </section>
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
                      `nailous-export-${getExportDateStamp()}.csv`,
                      toCsv(nailItems),
                      'text/csv;charset=utf-8;'
                    )}
                    disabled={nailItems.length === 0}
                  >Export CSV</button>
                  <button
                    type="button"
                    className="btn-export"
                    onClick={() => downloadTextFile(
                      `nailous-export-${getExportDateStamp()}.json`,
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
          <Suspense fallback={<div className="lazy-loading">読み込み中...</div>}>
            <NailComparisonPanel
              comparisonItemIds={comparisonItemIds}
              nailItems={nailItems}
              isFetching={isFetching}
              onClear={() => setComparisonItemIds([])}
            />
          </Suspense>
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
              <div className="nail-empty-stage" aria-hidden="true">
                <FloatingNailChip variant="empty" className="nail-empty-chip--one" showHighlight={false} />
                <FloatingNailChip variant="empty" className="nail-empty-chip--two" showHighlight={false} />
                <FloatingNailChip variant="empty" className="nail-empty-chip--three" showHighlight={false} />
              </div>
              <p className="nail-empty-main">まだ宝石箱は空です</p>
              <p className="nail-empty-sub">タイトルと写真を追加すると、最初のネイルチャームがここに並びます</p>
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
                      item.imageUrl ? 'has-image' : 'no-image',
                      editingId === item.id ? 'editing' : '',
                      isCompareSelected ? 'comparison-selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div
                      className="nail-card-thumb"
                      onClick={() => setDetailItemId(item.id)}
                    >
                      <div className="nail-thumb-placeholder" aria-hidden={Boolean(item.imageUrl)}>
                        <div className="nail-thumb-showcase">
                          <FloatingNailChip
                            variant="empty"
                            shape="almond"
                            className="nail-thumb-chip nail-thumb-chip--one"
                            showHighlight={false}
                          />
                          <FloatingNailChip
                            variant="empty"
                            shape="oval"
                            className="nail-thumb-chip nail-thumb-chip--two"
                            showHighlight={false}
                          />
                          <FloatingNailChip
                            variant="empty"
                            shape="square"
                            className="nail-thumb-chip nail-thumb-chip--three"
                            showHighlight={false}
                          />
                        </div>
                        <span>No image</span>
                      </div>
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
                        className="nail-action-primary"
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
