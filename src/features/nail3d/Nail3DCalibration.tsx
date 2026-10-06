// Perceptual calibration for socket error thresholds (#405).
//
// The question is not "how precise is the estimator" but "where does a socket
// error START TO LOOK WRONG". So this page shows the SAME NailSet on the SAME
// hand twice, perturbs one socket along one axis at a time, and lets the
// person raise the amount until they notice.
//
// Method: ascending limits. Each trial starts at zero, the person raises the
// slider until the two stop looking like the same hand, and records that
// value. Which side is perturbed is randomized, and some trials are catch
// trials with no perturbation at all, so a habit of pressing the button shows
// up as a false positive instead of silently lowering the threshold.
//
// The recorded medians are the candidates for T_pos / T_normal / T_tangent /
// T_size, which then set the gates on M1-M4.

import { useCallback, useMemo, useState } from 'react'
import Nail3DView from './Nail3DView'
import { framingFor } from './viewFraming'
import { parseHandProfile } from '../../lib/nail3dContract'
import {
  PERTURBATION_DIMENSIONS,
  metricCorrespondence,
  perturbHandProfile,
  perturbationFor,
} from '../../lib/nail3dPerturbation'
import type { OriginAxis, PerturbationDimension, SizeMode } from '../../lib/nail3dPerturbation'

import nailsetValidFull from '../../../contracts/nail3d/v1/fixtures/nailset-valid-full.json'
import handprofileValidRight from '../../../contracts/nail3d/v1/fixtures/handprofile-valid-right.json'

interface DimensionSpec {
  id: PerturbationDimension
  label: string
  /** Slider maximum; well past any plausible threshold. */
  max: number
  step: number
  unitLabel: string
  thresholdName: string
  format: (amount: number) => string
}

const DIMENSIONS: Record<PerturbationDimension, DimensionSpec> = {
  origin: {
    id: 'origin',
    label: '位置ずれ (origin)',
    max: 0.3,
    step: 0.002,
    unitLabel: '爪床長に対する比',
    thresholdName: 'T_pos',
    format: amount => `${(amount * 100).toFixed(1)} %`,
  },
  normal: {
    id: 'normal',
    label: '法線の傾き (normal tilt)',
    max: 20,
    step: 0.1,
    unitLabel: '度',
    thresholdName: 'T_normal',
    format: amount => `${amount.toFixed(1)}°`,
  },
  tangent: {
    id: 'tangent',
    label: '指軸の回転 (tangent rotation)',
    max: 20,
    step: 0.1,
    unitLabel: '度',
    thresholdName: 'T_tangent',
    format: amount => `${amount.toFixed(1)}°`,
  },
  size: {
    id: 'size',
    label: '寸法のスケール (bedWidth / bedLength)',
    max: 0.4,
    step: 0.002,
    unitLabel: '倍率の差',
    thresholdName: 'T_size',
    format: amount => `${(amount * 100).toFixed(1)} %`,
  },
}

interface Trial {
  id: number
  dimension: PerturbationDimension
  option: string
  /** The amount at which the difference was noticed. */
  amount: number
  /** False when the slider reached its maximum without the difference showing. */
  noticed: boolean
  /** True when nothing was perturbed — pressing "noticed" here is a miss. */
  catchTrial: boolean
  perturbedSide: 'left' | 'right'
}

const median = (values: readonly number[]): number | null => {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

const CATCH_TRIAL_RATE = 0.2

/**
 * `?demo=1` fixes the randomization so a given URL always shows the same
 * thing — used to check the page in a script, and to share a specific setting
 * with someone else. Readings taken in demo mode are not blind.
 */
const readParams = () => {
  if (typeof window === 'undefined') return { demo: false, dimension: null, amount: null }
  const params = new URLSearchParams(window.location.search)
  const dimension = params.get('dimension')
  const amount = Number(params.get('amount'))
  return {
    demo: params.get('demo') === '1',
    dimension: PERTURBATION_DIMENSIONS.find(id => id === dimension) ?? null,
    amount: Number.isFinite(amount) && amount > 0 ? amount : null,
  }
}

const newTrialSetup = (demo: boolean) => ({
  perturbedSide: (demo || Math.random() < 0.5 ? 'left' : 'right') as 'left' | 'right',
  catchTrial: demo ? false : Math.random() < CATCH_TRIAL_RATE,
})

const Nail3DCalibration = () => {
  const [params] = useState(readParams)
  const [dimension, setDimension] = useState<PerturbationDimension>(params.dimension ?? 'origin')
  const [originAxis, setOriginAxis] = useState<OriginAxis>('lateral')
  const [sizeMode, setSizeMode] = useState<SizeMode>('uniform')
  const [amount, setAmount] = useState(params.amount ?? 0)
  const [trials, setTrials] = useState<Trial[]>([])
  const [setup, setSetup] = useState(() => newTrialSetup(params.demo))
  const [revealed, setRevealed] = useState(false)

  const spec = DIMENSIONS[dimension]
  const optionLabel = dimension === 'origin' ? originAxis : dimension === 'size' ? sizeMode : '-'

  const referenceProfile = useMemo(() => parseHandProfile(handprofileValidRight), [])

  // Catch trials show two identical hands however far the slider is dragged.
  const effectiveAmount = setup.catchTrial ? 0 : amount

  const perturbedProfile = useMemo(() => {
    if (!referenceProfile) return null
    return perturbHandProfile(
      referenceProfile,
      perturbationFor(dimension, effectiveAmount, { originAxis, sizeMode }),
    )
  }, [referenceProfile, dimension, effectiveAmount, originAxis, sizeMode])

  // ONE framing, taken from the reference and given to both views. Letting
  // each view frame itself would rescale the perturbed one and hide the very
  // difference being judged.
  const framing = useMemo(() => framingFor(nailsetValidFull, handprofileValidRight), [])

  const correspondence = metricCorrespondence(dimension, amount)

  const startTrial = useCallback(() => {
    setAmount(0)
    setRevealed(false)
    setSetup(newTrialSetup(params.demo))
  }, [params.demo])

  const record = useCallback(
    (noticed: boolean) => {
      setTrials(previous => [
        ...previous,
        {
          id: previous.length + 1,
          dimension,
          option: optionLabel,
          amount: noticed ? amount : spec.max,
          noticed,
          catchTrial: setup.catchTrial,
          perturbedSide: setup.perturbedSide,
        },
      ])
      setRevealed(true)
    },
    [amount, dimension, optionLabel, setup, spec.max],
  )

  const summary = useMemo(() => {
    const rows = PERTURBATION_DIMENSIONS.map(id => {
      const own = trials.filter(trial => trial.dimension === id && !trial.catchTrial && trial.noticed)
      const censored = trials.filter(trial => trial.dimension === id && !trial.catchTrial && !trial.noticed)
      return {
        id,
        thresholdName: DIMENSIONS[id].thresholdName,
        trials: own.length,
        censored: censored.length,
        threshold: median(own.map(trial => trial.amount)),
      }
    })
    const catches = trials.filter(trial => trial.catchTrial)
    return {
      rows,
      catchTotal: catches.length,
      falsePositives: catches.filter(trial => trial.noticed).length,
    }
  }, [trials])

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          recordedAt: new Date().toISOString(),
          fixture: { nailSet: 'nailset-valid-full', handProfile: 'handprofile-valid-right' },
          method: 'ascending-limits',
          catchTrialRate: CATCH_TRIAL_RATE,
          candidates: Object.fromEntries(
            summary.rows.map(row => [row.thresholdName, row.threshold]),
          ),
          falsePositives: summary.falsePositives,
          catchTrials: summary.catchTotal,
          trials,
        },
        null,
        2,
      ),
    [summary, trials],
  )

  if (!referenceProfile || !perturbedProfile) {
    return (
      <section id="center">
        <h1 id="app-title">Nailous</h1>
        <p className="nail3d-preview-status">基準 HandProfile を読み込めませんでした。</p>
      </section>
    )
  }

  const leftProfile = setup.perturbedSide === 'left' ? perturbedProfile : referenceProfile
  const rightProfile = setup.perturbedSide === 'right' ? perturbedProfile : referenceProfile

  return (
    <section id="center">
      <h1 id="app-title">Nailous</h1>
      <div className="nail3d-preview">
        <h2>Socket 知覚較正</h2>
        <p className="nail3d-preview-status">
          {'同じ NailSet を同じ手に載せ、片方だけ socket をずらしています。\n'}
          {'スライダーを 0 から上げ、「同じ手に見えなくなった」と感じた位置で記録してください。\n'}
          {'どちらをずらしているかは試行ごとにランダムで、ずらさない試行も混ざります。'}
        </p>

        <div className="nail3d-preview-controls">
          {PERTURBATION_DIMENSIONS.map(id => (
            <button
              key={id}
              type="button"
              aria-pressed={id === dimension}
              onClick={() => {
                setDimension(id)
                startTrial()
              }}
            >
              {DIMENSIONS[id].label}
            </button>
          ))}
        </div>

        {dimension === 'origin' && (
          <div className="nail3d-preview-controls">
            {(['lateral', 'longitudinal', 'normal'] as OriginAxis[]).map(axis => (
              <button
                key={axis}
                type="button"
                aria-pressed={axis === originAxis}
                onClick={() => {
                  setOriginAxis(axis)
                  startTrial()
                }}
              >
                {axis === 'lateral' ? '横方向' : axis === 'longitudinal' ? '指の長手方向' : '法線方向'}
              </button>
            ))}
          </div>
        )}

        {dimension === 'size' && (
          <div className="nail3d-preview-controls">
            {(['uniform', 'width', 'length'] as SizeMode[]).map(mode => (
              <button
                key={mode}
                type="button"
                aria-pressed={mode === sizeMode}
                onClick={() => {
                  setSizeMode(mode)
                  startTrial()
                }}
              >
                {mode === 'uniform' ? '縦横とも' : mode === 'width' ? '幅のみ' : '長さのみ'}
              </button>
            ))}
          </div>
        )}

        <div className="nail3d-compare">
          <div className="nail3d-compare-pane">
            <span className="nail3d-compare-label">A</span>
            <Nail3DView nailSet={nailsetValidFull} handProfile={leftProfile} framing={framing} />
          </div>
          <div className="nail3d-compare-pane">
            <span className="nail3d-compare-label">B</span>
            <Nail3DView nailSet={nailsetValidFull} handProfile={rightProfile} framing={framing} />
          </div>
        </div>

        <label className="nail3d-slider">
          <span>
            {spec.label}: <strong>{spec.format(amount)}</strong>{' '}
            <small>（{spec.unitLabel}）</small>
          </span>
          <input
            type="range"
            min={0}
            max={spec.max}
            step={spec.step}
            value={amount}
            onChange={event => setAmount(Number(event.target.value))}
          />
        </label>

        <div className="nail3d-preview-controls">
          <button type="button" onClick={() => record(true)} disabled={revealed}>
            ここで違和感が出た
          </button>
          <button type="button" onClick={() => record(false)} disabled={revealed}>
            上限まで分からない
          </button>
          <button type="button" onClick={startTrial}>
            次の試行
          </button>
        </div>

        {revealed && (
          <p className="nail3d-preview-status">
            {setup.catchTrial
              ? '※ この試行はずらしていません（キャッチ試行）。'
              : `※ ずらしていたのは ${setup.perturbedSide === 'left' ? 'A' : 'B'} です。`}
          </p>
        )}

        <p className="nail3d-preview-status">
          {`対応する技術指標: ${correspondence.metric}\n`}
          {`2 枚間の差（M6 / pairwise 相当）: ${spec.format(correspondence.pairwise)}\n`}
          {`同じ 2 枚を 1 セットとしたときの ${correspondence.metric}: ${
            correspondence.m1Equivalent === undefined
              ? '-'
              : correspondence.metric === 'M4'
                ? correspondence.m1Equivalent.toFixed(4)
                : spec.format(correspondence.m1Equivalent)
          }`}
        </p>

        <h3>候補しきい値</h3>
        <table className="nail3d-results">
          <thead>
            <tr>
              <th>しきい値</th>
              <th>試行</th>
              <th>未検出</th>
              <th>中央値</th>
            </tr>
          </thead>
          <tbody>
            {summary.rows.map(row => (
              <tr key={row.id}>
                <td>{row.thresholdName}</td>
                <td>{row.trials}</td>
                <td>{row.censored}</td>
                <td>{row.threshold === null ? '—' : DIMENSIONS[row.id].format(row.threshold)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="nail3d-preview-status">
          {`キャッチ試行 ${summary.catchTotal} 回中、誤検出 ${summary.falsePositives} 回。`}
          {summary.falsePositives > 0 ? ' 誤検出があるぶん、中央値は低めに出ています。' : ''}
        </p>

        <h3>記録（コピーして保存）</h3>
        <textarea className="nail3d-export" readOnly rows={8} value={exportJson} />
      </div>
    </section>
  )
}

export default Nail3DCalibration
