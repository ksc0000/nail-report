import { useState, useMemo, lazy, Suspense } from 'react'
import ErrorBanner from './components/ErrorBanner'
import './App.css'

const MainApp = lazy(() => import('./components/MainApp'))
const PublicSharePage = lazy(() => import('./components/PublicSharePage'))

const getPublicShareIdFromPath = (pathname: string): string | null => {
  const m = pathname.match(/^\/share\/([^/]+)\/?$/)
  return m?.[1] ? decodeURIComponent(m[1]) : null
}

function App() {
  const sharePathId = useMemo(
    () => typeof window === 'undefined' ? null : getPublicShareIdFromPath(window.location.pathname),
    []
  )
  const isPublicSharePage = sharePathId !== null
  const [bannerError, setBannerError] = useState('')

  return (
    <section id="center">
      <h1 id="app-title">Nailous</h1>
      <ErrorBanner message={bannerError} onClose={() => setBannerError('')} />

      <Suspense fallback={<p className="public-share-note">読み込み中...</p>}>
        {isPublicSharePage ? (
          <PublicSharePage sharePathId={sharePathId} setBannerError={setBannerError} />
        ) : (
          <MainApp setBannerError={setBannerError} />
        )}
      </Suspense>
    </section>
  )
}

export default App
