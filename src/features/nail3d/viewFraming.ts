// Camera framing shared by the 3D views.
//
// Kept out of the component file so a comparison page can compute ONE framing
// from its reference and hand the same one to every view. Views that frame
// themselves would each normalize away the differences being compared.

import {
  boundsOfPlacedNails,
  buildFlatLayout,
  buildPlacedNails,
  cameraFraming,
} from '../../lib/nail3dGeometry'
import { planNail3DRender } from '../../lib/nail3dContract'
import type { CameraFraming, CameraFramingOptions } from '../../lib/nail3dGeometry'

/**
 * CND is in metres (a nail bed is ~0.012). Scaling the scene up keeps the
 * geometry clear of three's default near plane and lets a conventional camera
 * distance work.
 */
export const SCENE_SCALE = 20
export const CAMERA_FOV = 40
/** Headroom around the bounding sphere so the nails are not flush to the edge. */
export const FRAMING_MARGIN = 1.9

export const VIEW_FRAMING_OPTIONS: CameraFramingOptions = {
  sceneScale: SCENE_SCALE,
  fovDeg: CAMERA_FOV,
  margin: FRAMING_MARGIN,
}

/**
 * Framing for a given NailSet / HandProfile pair, computed without rendering.
 * Returns null when there is nothing to frame (an L0 plan, or no geometry).
 */
export const framingFor = (nailSet: unknown, handProfile?: unknown): CameraFraming | null => {
  const plan = planNail3DRender({ nailSet, handProfile })
  const placed =
    plan.level === 'L2'
      ? buildPlacedNails(plan.nails, plan.handProfile)
      : plan.level === 'L1'
        ? buildFlatLayout(plan.nails)
        : []
  const bounds = boundsOfPlacedNails(placed)
  return bounds ? cameraFraming(bounds, VIEW_FRAMING_OPTIONS) : null
}
