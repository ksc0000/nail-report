// Dev preview for the CND -> R3F path, reachable at /nail3d-preview when
// VITE_ENABLE_NAIL3D=true. It renders the contract fixtures directly, so the
// whole pipeline can be seen before any real scan data exists (#405).
//
// When #405 starts producing data, nothing here has to change for production:
// the same <Nail3DView> takes the real NailSet/HandProfile documents and a
// resolveTextureUrl that maps Storage refs to URLs.

import { useCallback, useMemo, useState } from 'react'
import Nail3DView from './Nail3DView'
import type { Nail3DPlan } from '../../lib/nail3dContract'

import nailsetValidFull from '../../../contracts/nail3d/v1/fixtures/nailset-valid-full.json'
import nailsetValidPartial from '../../../contracts/nail3d/v1/fixtures/nailset-valid-partial.json'
import nailsetNoHeightmap from '../../../contracts/nail3d/v1/fixtures/nailset-valid-no-heightmap.json'
import nailsetUnknownVersion from '../../../contracts/nail3d/v1/fixtures/nailset-unknown-contract-version.json'
import nailsetMalformed from '../../../contracts/nail3d/v1/fixtures/nailset-malformed-handedness.json'
import handprofileValidRight from '../../../contracts/nail3d/v1/fixtures/handprofile-valid-right.json'

interface FixtureChoice {
  id: string
  label: string
  data: unknown
  /** What the contract says should happen, so the screen is self-checking. */
  expectation: string
}

const FIXTURES: FixtureChoice[] = [
  {
    id: 'full',
    label: '5本 (full)',
    data: nailsetValidFull,
    expectation: 'HandProfile あり → L2 / なし → L1 (heightMap あり)',
  },
  {
    id: 'partial',
    label: '3本 (partial)',
    data: nailsetValidPartial,
    expectation: 'HandProfile あり → L2 (3本のみ) / なし → L1',
  },
  {
    id: 'no-heightmap',
    label: 'heightMap なし',
    data: nailsetNoHeightmap,
    expectation: 'HandProfile あり → L2 / なし → L0 (2.5D に落ちられない)',
  },
  {
    id: 'unknown-version',
    label: '未知の contractVersion',
    data: nailsetUnknownVersion,
    expectation: '常に L0 — 何も描画しない (INV-3)',
  },
  {
    id: 'malformed',
    label: 'malformed',
    data: nailsetMalformed,
    expectation: '常に L0 — 部分描画しない (INV-3)',
  },
]

const describe = (plan: Nail3DPlan | null): string => {
  if (!plan) return '—'
  if (plan.level === 'L2') {
    const dropped = plan.droppedFingers.length > 0 ? ` / 除外: ${plan.droppedFingers.join(', ')}` : ''
    return `L2 — 爪 ${plan.nails.length} 本を socket に配置${dropped}`
  }
  if (plan.level === 'L1') {
    return `L1 (2.5D) — ${plan.reason}: ${plan.detail}`
  }
  return `L0 — ${plan.reason}: ${plan.detail}`
}

/** `?fixture=<id>&profile=0` preselects a case so the page can be checked in a script. */
const initialState = (): { fixtureId: string; withHandProfile: boolean } => {
  if (typeof window === 'undefined') return { fixtureId: FIXTURES[0].id, withHandProfile: true }
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('fixture')
  const known = FIXTURES.some(entry => entry.id === requested)
  return {
    fixtureId: known && requested ? requested : FIXTURES[0].id,
    withHandProfile: params.get('profile') !== '0',
  }
}

const Nail3DPreview = () => {
  const [initial] = useState(initialState)
  const [fixtureId, setFixtureId] = useState(initial.fixtureId)
  const [withHandProfile, setWithHandProfile] = useState(initial.withHandProfile)
  const [plan, setPlan] = useState<Nail3DPlan | null>(null)

  const fixture = useMemo(
    () => FIXTURES.find(entry => entry.id === fixtureId) ?? FIXTURES[0],
    [fixtureId],
  )
  const handProfile = withHandProfile ? handprofileValidRight : undefined
  const handlePlan = useCallback((next: Nail3DPlan) => setPlan(next), [])

  return (
    <section id="center">
      <h1 id="app-title">Nailous</h1>
      <div className="nail3d-preview">
        <h2>Canonical Nail Data — レンダリング確認</h2>

        <div className="nail3d-preview-controls">
          {FIXTURES.map(entry => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={entry.id === fixtureId}
              onClick={() => setFixtureId(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="nail3d-preview-controls">
          <button
            type="button"
            aria-pressed={withHandProfile}
            onClick={() => setWithHandProfile(value => !value)}
          >
            HandProfile: {withHandProfile ? 'あり' : 'なし'}
          </button>
        </div>

        {/* L0 のときは Nail3DView が null を返すため、3D 領域自体が出ない */}
        <Nail3DView nailSet={fixture.data} handProfile={handProfile} onPlan={handlePlan} />

        <p className="nail3d-preview-status">
          {`期待: ${fixture.expectation}\n結果: ${describe(plan)}`}
        </p>
      </div>
    </section>
  )
}

export default Nail3DPreview
