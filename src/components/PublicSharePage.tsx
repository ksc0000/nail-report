import { useState, useEffect, useMemo } from 'react'
import { getPublicShare } from '../lib/publicShares'
import type { PublicShareDocWithId, PublicShareItemSnapshot } from '../lib/publicShares'
import { formatDate } from '../lib/utils'

type PublicShareViewState = 'loading' | 'ready' | 'not-found' | 'disabled' | 'error'

interface PublicSharePageProps {
  sharePathId: string
  setBannerError: (msg: string) => void
}

export default function PublicSharePage({ sharePathId, setBannerError }: PublicSharePageProps) {
  const [publicShare, setPublicShare] = useState<PublicShareDocWithId | null>(null)
  const [publicShareState, setPublicShareState] = useState<PublicShareViewState>('loading')

  useEffect(() => {
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
  }, [sharePathId, setBannerError])

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="robots"]')
    const previousRobots = meta?.getAttribute('content') ?? null
    let createdMeta: HTMLMetaElement | null = null

    document.title = 'Shared nail collection'
    if (meta) {
      meta.setAttribute('content', 'noindex')
    } else {
      createdMeta = document.createElement('meta')
      createdMeta.name = 'robots'
      createdMeta.content = 'noindex'
      document.head.appendChild(createdMeta)
    }

    return () => {
      document.title = previousTitle
      if (createdMeta) {
        createdMeta.remove()
      } else if (meta && previousRobots !== null) {
        meta.setAttribute('content', previousRobots)
      } else if (meta) {
        meta.removeAttribute('content')
      }
    }
  }, [])

  const renderedContent = useMemo(() => {
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
  }, [publicShare, publicShareState])

  return (
    <>
      {renderedContent}
    </>
  )
}
