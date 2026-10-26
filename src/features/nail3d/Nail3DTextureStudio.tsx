// H1 texture studio (#421): photo -> four corners -> UV texture -> the
// parametric nail, reachable at /nail3d-texture when VITE_ENABLE_NAIL3D=true.
//
// This is the smallest thing that answers "does a nail textured from one photo
// look like MY nail?" (HIGH_FIDELITY_NAIL_RECONSTRUCTION_POC §3 PH / §5.1(b)).
// The person marks the nail by hand — no detector in the loop yet, so what is
// being judged is the projection itself, not an estimator's error. Automatic
// corner guesses (landmarks, SAM) can be dropped in later as a better initial
// quad without changing anything below the quad.
//
// Everything stays on the device: the photo is drawn to a local canvas and the
// texture is a data URL in component state. Nothing is uploaded.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import Nail3DView from './Nail3DView'
import { NAIL_SHAPES } from '../../lib/nail3dContract'
import type { Finger, NailShape } from '../../lib/nail3dContract'
import {
  DEFAULT_TEXTURE_HEIGHT,
  DEFAULT_TEXTURE_WIDTH,
  IDENTITY_UV_TRANSFORM,
  QUAD_CORNERS,
  defaultQuadForImage,
  isQuadUsable,
  projectNailTexture,
  samplerFromRgba,
  sourceResolution,
} from '../../lib/nail3dTextureProjection'
import type { NailQuad, QuadCorner } from '../../lib/nail3dTextureProjection'

import handprofileValidRight from '../../../contracts/nail3d/v1/fixtures/handprofile-valid-right.json'

const TEXTURE_REF = 'studio:nail'
const PREVIEW_SCALE = 0.5
const STAGE_MAX_WIDTH = 720

const CORNER_LABEL: Record<QuadCorner, string> = {
  cuticleA: '甘皮 A',
  cuticleB: '甘皮 B',
  freeEdgeB: '先端 B',
  freeEdgeA: '先端 A',
}

const SHAPE_LABEL: Record<NailShape, string> = {
  round: 'ラウンド',
  square: 'スクエア',
  almond: 'アーモンド',
  coffin: 'コフィン',
  stiletto: 'スティレット',
}

interface Photo {
  image: HTMLImageElement
  width: number
  height: number
  pixels: Uint8ClampedArray
}

interface NailParams {
  finger: Finger
  shape: NailShape
  /** mm; the contract stores metres. */
  lengthMm: number
  curveV: number
  curveH: number
}

const DEFAULT_PARAMS: NailParams = { finger: 'index', shape: 'almond', lengthMm: 14, curveV: 0.4, curveH: 0.3 }

/** Reads the whole photo once so the projection can sample it without the canvas in the loop. */
const loadPhoto = (file: File): Promise<Photo> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('canvas unavailable'))
        return
      }
      ctx.drawImage(image, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      resolve({ image, width: canvas.width, height: canvas.height, pixels: data })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image decode failed'))
    }
    image.src = url
  })

/**
 * Projects and encodes the texture. three's TextureLoader keeps flipY on, so
 * the PNG's top row must be the free edge (v = 1): rows are written bottom-up.
 */
const renderTexture = (photo: Photo, quad: NailQuad, scale: number): string | null => {
  const width = Math.round(DEFAULT_TEXTURE_WIDTH * scale)
  const height = Math.round(DEFAULT_TEXTURE_HEIGHT * scale)
  const projected = projectNailTexture(samplerFromRgba(photo.pixels, photo.width, photo.height), quad, width, height)
  if (!projected) return null
  const flipped = new Uint8ClampedArray(projected.data.length)
  const rowBytes = width * 4
  for (let row = 0; row < height; row += 1) {
    flipped.set(projected.data.subarray(row * rowBytes, (row + 1) * rowBytes), (height - 1 - row) * rowBytes)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.putImageData(new ImageData(flipped, width, height), 0, 0)
  return canvas.toDataURL('image/png')
}

const Nail3DTextureStudio = () => {
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [quad, setQuad] = useState<NailQuad | null>(null)
  const [params, setParams] = useState<NailParams>(DEFAULT_PARAMS)
  const [dragging, setDragging] = useState<QuadCorner | null>(null)
  const [error, setError] = useState('')
  const stageRef = useRef<HTMLDivElement>(null)
  const photoCanvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return
    setError('')
    try {
      const next = await loadPhoto(file)
      setPhoto(next)
      setQuad(defaultQuadForImage(next.width, next.height))
    } catch {
      setError('写真を読み込めませんでした。別の画像を選んでください。')
    }
  }, [])

  // Draw the photo scaled to the stage width; the overlay uses the same scale.
  useEffect(() => {
    const canvas = photoCanvasRef.current
    if (!canvas || !photo) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = photo.width
    canvas.height = photo.height
    ctx.drawImage(photo.image, 0, 0)
  }, [photo])

  // Half resolution while dragging keeps the preview responsive; full on release.
  const textureUrl = useMemo(() => {
    if (!photo || !quad || !isQuadUsable(quad)) return null
    return renderTexture(photo, quad, dragging ? PREVIEW_SCALE : 1)
  }, [photo, quad, dragging])

  const stageToImage = useCallback(
    (event: ReactPointerEvent): readonly [number, number] | null => {
      const stage = stageRef.current
      if (!stage || !photo) return null
      const rect = stage.getBoundingClientRect()
      const scale = photo.width / rect.width
      const x = Math.min(photo.width, Math.max(0, (event.clientX - rect.left) * scale))
      const y = Math.min(photo.height, Math.max(0, (event.clientY - rect.top) * scale))
      return [x, y]
    },
    [photo],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!dragging) return
      const point = stageToImage(event)
      if (!point) return
      setQuad(current => (current ? { ...current, [dragging]: point } : current))
    },
    [dragging, stageToImage],
  )

  const nailSet = useMemo(
    () => ({
      contractVersion: 1,
      reconstructionVersion: 1,
      handedness: 'right',
      handProfileRef: 'studio:hand',
      completeness: 'partial',
      quality: { overall: 1 },
      nails: [
        {
          socketRef: params.finger,
          geometry: {
            shape: params.shape,
            curveV: params.curveV,
            curveH: params.curveH,
            length: params.lengthMm / 1000,
            thickness: 0.0006,
            confidence: 1,
          },
          texture: { textureRef: TEXTURE_REF, uvTransform: IDENTITY_UV_TRANSFORM },
        },
      ],
    }),
    [params],
  )

  const resolveTextureUrl = useCallback(
    (ref: string) => (ref === TEXTURE_REF && textureUrl ? textureUrl : undefined),
    [textureUrl],
  )

  // Overlay strokes and handles are in photo pixels; divide by the on-screen
  // scale so they stay the same size whatever the photo resolution.
  const [stageWidth, setStageWidth] = useState(STAGE_MAX_WIDTH)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width
      if (width) setStageWidth(width)
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [photo])

  const resolution = quad ? sourceResolution(quad) : null
  const lowResolution = resolution !== null && Math.min(resolution.across, resolution.along) < 1
  const exportJson = JSON.stringify(nailSet.nails[0], null, 2)
  const viewScale = photo ? stageWidth / photo.width : 1
  const handleRadius = 14 / viewScale

  return (
    <section id="center">
      <h1 id="app-title">Nailous</h1>
      <div className="nail3d-preview">
        <h2>H1 — 写真から爪テクスチャ</h2>
        <p className="nail3d-preview-status">
          爪の 4 隅（甘皮の両端・先端の両端）を写真の上で合わせると、その中の画素がパラメトリックな爪に貼られます。
          A は親指側。写真は端末の外に出ません。
        </p>

        <div className="nail3d-preview-controls">
          <label className="nail3d-file">
            写真を選ぶ
            <input
              type="file"
              accept="image/*"
              onChange={event => void handleFile(event.target.files?.[0])}
            />
          </label>
          {photo && quad && (
            <button type="button" onClick={() => setQuad(defaultQuadForImage(photo.width, photo.height))}>
              4 隅をリセット
            </button>
          )}
        </div>
        {error && <p className="nail3d-preview-status">{error}</p>}

        {photo && quad && (
          <div
            ref={stageRef}
            className="nail3d-studio-stage"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
          >
            <canvas ref={photoCanvasRef} className="nail3d-studio-photo" />
            <svg
              className="nail3d-studio-overlay"
              viewBox={`0 0 ${photo.width} ${photo.height}`}
              preserveAspectRatio="none"
            >
              <polygon
                points={QUAD_CORNERS.map(corner => quad[corner].join(',')).join(' ')}
                className={isQuadUsable(quad) ? 'nail3d-studio-quad' : 'nail3d-studio-quad is-invalid'}
                strokeWidth={2 / viewScale}
              />
              <line
                x1={quad.cuticleA[0]}
                y1={quad.cuticleA[1]}
                x2={quad.cuticleB[0]}
                y2={quad.cuticleB[1]}
                className="nail3d-studio-cuticle"
                strokeWidth={4 / viewScale}
              />
              {QUAD_CORNERS.map(corner => (
                <g key={corner}>
                  <circle
                    cx={quad[corner][0]}
                    cy={quad[corner][1]}
                    r={handleRadius}
                    className={dragging === corner ? 'nail3d-studio-handle is-active' : 'nail3d-studio-handle'}
                    onPointerDown={event => {
                      event.preventDefault()
                      // Route the rest of the drag to the stage even when the
                      // finger leaves the handle.
                      stageRef.current?.setPointerCapture(event.pointerId)
                      setDragging(corner)
                    }}
                  />
                  <text
                    x={quad[corner][0]}
                    y={quad[corner][1] - handleRadius * 1.3}
                    className="nail3d-studio-label"
                    fontSize={13 / viewScale}
                    textAnchor="middle"
                  >
                    {CORNER_LABEL[corner]}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        {resolution && (
          <p className="nail3d-preview-status">
            写真の解像度: 横 {resolution.across.toFixed(2)} px/texel・縦 {resolution.along.toFixed(2)} px/texel
            {lowResolution && ' — 爪が小さく写っています。2× で寄った写真のほうがきれいに貼れます（E0 の接写条件）。'}
          </p>
        )}

        <div className="nail3d-preview-controls">
          {NAIL_SHAPES.map(shape => (
            <button
              key={shape}
              type="button"
              aria-pressed={shape === params.shape}
              onClick={() => setParams(current => ({ ...current, shape }))}
            >
              {SHAPE_LABEL[shape]}
            </button>
          ))}
        </div>
        <label className="nail3d-slider">
          長さ {params.lengthMm.toFixed(1)} mm
          <input
            type="range"
            min={8}
            max={30}
            step={0.5}
            value={params.lengthMm}
            onChange={event => setParams(current => ({ ...current, lengthMm: Number(event.target.value) }))}
          />
        </label>
        <label className="nail3d-slider">
          縦のカーブ {params.curveV.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={params.curveV}
            onChange={event => setParams(current => ({ ...current, curveV: Number(event.target.value) }))}
          />
        </label>
        <label className="nail3d-slider">
          横のカーブ {params.curveH.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={params.curveH}
            onChange={event => setParams(current => ({ ...current, curveH: Number(event.target.value) }))}
          />
        </label>

        <Nail3DView nailSet={nailSet} handProfile={handprofileValidRight} resolveTextureUrl={resolveTextureUrl} />

        {textureUrl && (
          <div className="nail3d-preview-controls">
            <a className="nail3d-download" href={textureUrl} download="nail-texture.png">
              テクスチャ PNG を保存
            </a>
          </div>
        )}
        <textarea className="nail3d-export" readOnly rows={12} value={exportJson} aria-label="NailEntry JSON" />
      </div>
    </section>
  )
}

export default Nail3DTextureStudio
