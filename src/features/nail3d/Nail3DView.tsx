// R3F rendering of Canonical Nail Data.
//
// Everything three.js-specific lives under src/features/nail3d. The shape of
// a nail and the decision of what may be rendered come from src/lib
// (nail3dGeometry / nail3dContract) and are tested without WebGL.
//
// INV-1/INV-3: an L0 plan renders *nothing* — not an error, not a placeholder.
// A photo record without a 3D layer is complete, and must not be made to look
// unfinished. See docs/product/CANONICAL_NAIL_DATA_CONTRACT.md.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  TextureLoader,
} from 'three'
import type { Mesh, Texture } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { planNail3DRender } from '../../lib/nail3dContract'
import { boundsOfPlacedNails, buildFlatLayout, buildPlacedNails, cameraFraming } from '../../lib/nail3dGeometry'
import type { Nail3DPlan } from '../../lib/nail3dContract'
import type { CameraFraming, PlacedNail } from '../../lib/nail3dGeometry'
import { CAMERA_FOV, SCENE_SCALE, VIEW_FRAMING_OPTIONS } from './viewFraming'
import './nail3d.css'

/** Used until a NailTexture resolves — a neutral nail tone, never an error colour. */
const UNTEXTURED_COLOR = '#e8c4cb'

const toBufferGeometry = (mesh: PlacedNail['mesh']): BufferGeometry => {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(mesh.positions, 3))
  geometry.setAttribute('normal', new Float32BufferAttribute(mesh.normals, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(mesh.uvs, 2))
  geometry.setIndex(mesh.indices)
  return geometry
}

/** Loads a texture if one is available, and never fails the render if it is not. */
const useOptionalTexture = (url: string | undefined): Texture | null => {
  // The loaded url is kept alongside the texture so a stale result can be
  // discarded during render instead of being cleared from the effect body.
  const [loaded, setLoaded] = useState<{ url: string; texture: Texture } | null>(null)

  useEffect(() => {
    if (!url) return
    let active = true
    let created: Texture | null = null
    new TextureLoader().load(
      url,
      next => {
        if (!active) {
          next.dispose()
          return
        }
        created = next
        setLoaded({ url, texture: next })
      },
      undefined,
      // A missing texture degrades to the untextured material; the nail is
      // still worth showing, so the failure is swallowed deliberately.
      () => {},
    )
    return () => {
      active = false
      created?.dispose()
    }
  }, [url])

  return loaded && loaded.url === url ? loaded.texture : null
}

const NailMeshObject = ({ nail, textureUrl }: { nail: PlacedNail; textureUrl?: string }) => {
  const meshRef = useRef<Mesh>(null)
  const geometry = useMemo(() => toBufferGeometry(nail.mesh), [nail.mesh])
  const texture = useOptionalTexture(textureUrl)

  useEffect(() => () => geometry.dispose(), [geometry])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    // The socket matrix already encodes position and orientation, so drive the
    // transform directly instead of decomposing it.
    mesh.matrixAutoUpdate = false
    mesh.matrix.fromArray(nail.matrix)
    mesh.matrixWorldNeedsUpdate = true
  }, [nail.matrix])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        map={texture}
        color={texture ? '#ffffff' : UNTEXTURED_COLOR}
        roughness={0.25}
        metalness={0.05}
        side={DoubleSide}
      />
    </mesh>
  )
}

const OrbitRig = ({ target, distance }: { target: [number, number, number]; distance: number }) => {
  const camera = useThree(state => state.camera)
  const domElement = useThree(state => state.gl.domElement)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    const controls = new OrbitControls(camera, domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = distance * 0.35
    controls.maxDistance = distance * 3
    controls.target.set(...target)
    controls.update()
    controlsRef.current = controls
    return () => {
      controls.dispose()
      controlsRef.current = null
    }
  }, [camera, domElement, target, distance])

  useFrame(() => controlsRef.current?.update())
  return null
}

export interface Nail3DViewProps {
  /** Raw `nailItems/{id}/nail3d/current` data. */
  nailSet: unknown
  /** Raw `handProfiles/{handedness}` data. Absent is normal and yields L1/L0. */
  handProfile?: unknown
  /** Storage refs known to be unfetchable. */
  unavailableRefs?: readonly string[]
  /** Maps a NailTexture ref to a loadable URL. Omit to render untextured. */
  resolveTextureUrl?: (ref: string) => string | undefined
  /** Called with the decided plan, so callers can show the level in dev tools. */
  onPlan?: (plan: Nail3DPlan) => void
  /**
   * Fixes the camera instead of framing from this view's own geometry.
   *
   * Two views being compared MUST share one framing. If each framed itself,
   * a size or position difference would be normalized away and become
   * invisible — hiding exactly what the comparison is there to reveal.
   */
  framing?: CameraFraming | null
}

/**
 * Renders the 3D layer for one NailSet, or nothing at all.
 *
 * Returns null for L0 so the caller can mount it unconditionally wherever a
 * record is shown: a record with no 3D layer simply shows no 3D area.
 */
const Nail3DView = ({
  nailSet,
  handProfile,
  unavailableRefs,
  resolveTextureUrl,
  onPlan,
  framing: framingOverride,
}: Nail3DViewProps) => {
  const plan = useMemo(
    () => planNail3DRender({ nailSet, handProfile, unavailableRefs }),
    [nailSet, handProfile, unavailableRefs],
  )

  const placed = useMemo<PlacedNail[]>(() => {
    if (plan.level === 'L2') return buildPlacedNails(plan.nails, plan.handProfile)
    if (plan.level === 'L1') return buildFlatLayout(plan.nails)
    return []
  }, [plan])

  useEffect(() => {
    onPlan?.(plan)
  }, [plan, onPlan])

  // Frame from the geometry itself so any HandProfile — including real scan
  // data — is in view without retuning the camera.
  const ownFraming = useMemo(() => {
    const bounds = boundsOfPlacedNails(placed)
    if (!bounds) return null
    return cameraFraming(bounds, VIEW_FRAMING_OPTIONS)
  }, [placed])

  const framing = framingOverride ?? ownFraming

  // L0, or geometry that could not be built: show no 3D area whatsoever.
  if (plan.level === 'L0' || placed.length === 0 || !framing) return null

  return (
    <div className="nail3d-view" data-level={plan.level}>
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: framing.position,
          fov: CAMERA_FOV,
          near: Math.max(0.01, framing.distance * 0.05),
          far: framing.distance * 10,
          up: framing.up,
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 4]} intensity={1.4} />
        <directionalLight position={[-3, -1, 2]} intensity={0.4} />
        <group scale={SCENE_SCALE}>
          {placed.map(nail => (
            <NailMeshObject
              key={nail.finger}
              nail={nail}
              textureUrl={resolveTextureUrl?.(nail.textureRef)}
            />
          ))}
        </group>
        <OrbitRig target={framing.target} distance={framing.distance} />
      </Canvas>
    </div>
  )
}

export default Nail3DView
