import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, PresentationControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export type Nail3DProps = {
  imageUrl?: string
  tone?: string
  className?: string
}

const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Nail-plate silhouette. A sine profile gives rounded (non-cusped) ends so it
// reads as an almond/oval nail; the exponent fattens the body, and a gentle
// taper makes the free-edge tip a touch narrower than the cuticle base.
const BASE_CAP = 0.16 // rounded cuticle end
const TIP_CAP = 0.24 // slightly longer rounded free-edge

const nailWidthFactor = (t: number): number => {
  // near-parallel sides through the body, a touch narrower toward the tip
  const body = 1 - 0.2 * smoothstep(0.5, 1, t)
  // circular arc caps → ends round off (no point, no flat, no bulge)
  const baseRound = t < BASE_CAP ? Math.sqrt(1 - Math.pow((BASE_CAP - t) / BASE_CAP, 2)) : 1
  const tipRound = t > 1 - TIP_CAP ? Math.sqrt(1 - Math.pow((t - (1 - TIP_CAP)) / TIP_CAP, 2)) : 1
  return body * baseRound * tipRound
}

// A convex (C-curve) nail plate with clean 0..1 UVs so a photo maps on cleanly.
const useNailGeometry = (): THREE.BufferGeometry =>
  useMemo(() => {
    const w = 1.55
    const h = 2.4
    const geo = new THREE.PlaneGeometry(w, h, 48, 88)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x0 = pos.getX(i)
      const y = pos.getY(i)
      const t = (y + h / 2) / h // 0 at base (cuticle) → 1 at tip
      const u = x0 / (w / 2) // -1 … 1 across the plate
      const wf = nailWidthFactor(t)
      const x = x0 * wf
      // convex cross-section (C-curve), fading to flat at the rounded ends so
      // the collapsed tip/base rows stay clean.
      const endFade = Math.min(1, wf * 1.5)
      const bulge = 0.16 * (1 - u * u) * (0.85 + 0.15 * (1 - t)) * endFade
      // free edge curls slightly away
      const curl = 0.06 * smoothstep(0.5, 1, t)
      pos.setXYZ(i, x, y, bulge - curl)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

const NailPhotoMesh = ({ geometry, imageUrl }: { geometry: THREE.BufferGeometry; imageUrl: string }) => {
  const texture = useTexture(imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        map={texture}
        roughness={0.38}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={1.15}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

const NailPlainMesh = ({ geometry, tone }: { geometry: THREE.BufferGeometry; tone: string }) => (
  <mesh geometry={geometry}>
    <meshPhysicalMaterial
      color={tone}
      roughness={0.34}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.07}
      envMapIntensity={1.2}
      side={THREE.FrontSide}
    />
  </mesh>
)

const NailModel = ({ imageUrl, tone }: { imageUrl?: string; tone: string }) => {
  const geometry = useNailGeometry()
  return (
    <group rotation={[0, 0, 0]}>
      {imageUrl ? (
        <NailPhotoMesh geometry={geometry} imageUrl={imageUrl} />
      ) : (
        <NailPlainMesh geometry={geometry} tone={tone} />
      )}
      {/* frosted underside so a full spin still looks like a real press-on tip */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#efdfe6"
          roughness={0.5}
          metalness={0}
          clearcoat={0.8}
          clearcoatRoughness={0.18}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

const InteractiveNail3D = ({ imageUrl, tone = '#eab6c6', className }: Nail3DProps) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%', touchAction: 'none' }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 6.6], fov: 30 }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2.5, 3.5, 4]} intensity={1.1} />
        <Suspense fallback={null}>
          <Environment resolution={128}>
            <Lightformer intensity={2.2} position={[0, 1.5, 3]} scale={[4, 4, 1]} />
            <Lightformer intensity={1.1} position={[-3, 0.5, 2]} scale={[2, 5, 1]} />
            <Lightformer intensity={0.8} position={[3, -1, 2]} scale={[3, 3, 1]} />
          </Environment>
          <PresentationControls
            global
            snap
            cursor
            speed={1.4}
            polar={[-Math.PI / 5, Math.PI / 5]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <NailModel imageUrl={imageUrl} tone={tone} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default InteractiveNail3D
