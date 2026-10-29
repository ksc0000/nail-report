// H1 texture projection: photo quad -> UV square. Pure arithmetic, no canvas.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  defaultQuadForImage,
  isQuadUsable,
  projectNailTexture,
  samplerFromRgba,
  sourceResolution,
  uvToImage,
} from '../src/lib/nail3dTextureProjection.ts'
import type { NailQuad, PixelSampler } from '../src/lib/nail3dTextureProjection.ts'
import type { Vec2 } from '../src/lib/nail3dContract.ts'

const near = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) <= eps, `expected ${a} ≈ ${b}`)
const nearPoint = (a: Vec2, b: Vec2, eps = 1e-6) => {
  near(a[0], b[0], eps)
  near(a[1], b[1], eps)
}

/** An almond-ish nail photographed tip-up: cuticle wide at the bottom, free edge narrow at the top. */
const tapered: NailQuad = {
  cuticleA: [100, 400],
  cuticleB: [300, 400],
  freeEdgeA: [170, 100],
  freeEdgeB: [230, 100],
}

test('uvToImage: corners map to corners, cuticle is v=0 and side A is u=0', () => {
  nearPoint(uvToImage(tapered, 0, 0), tapered.cuticleA)
  nearPoint(uvToImage(tapered, 1, 0), tapered.cuticleB)
  nearPoint(uvToImage(tapered, 0, 1), tapered.freeEdgeA)
  nearPoint(uvToImage(tapered, 1, 1), tapered.freeEdgeB)
})

test('uvToImage: v is proportional along the nail even when it tapers (no perspective slide)', () => {
  // Two-thirds of the way from cuticle to free edge must land two-thirds of
  // the way up the photo, on the centre line. A homography would put it lower.
  const p = uvToImage(tapered, 0.5, 2 / 3)
  near(p[0], 200)
  near(p[1], 400 - 300 * (2 / 3))
  // And the width at that height is the linear blend of the two edges.
  const left = uvToImage(tapered, 0, 2 / 3)
  const right = uvToImage(tapered, 1, 2 / 3)
  near(right[0] - left[0], 200 * (1 / 3) + 60 * (2 / 3))
})

test('projectNailTexture: an axis-aligned quad copies the photo region, cuticle row first', () => {
  // 8x8 photo whose red channel is x and green channel is y.
  const w = 8
  const h = 8
  const rgba = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const o = (y * w + x) * 4
      rgba[o] = x * 30
      rgba[o + 1] = y * 30
      rgba[o + 2] = 0
      rgba[o + 3] = 255
    }
  }
  const sample = samplerFromRgba(rgba, w, h)
  // Cuticle at the bottom of the photo (y = 8), free edge at the top (y = 0).
  const quad: NailQuad = {
    cuticleA: [0, 8],
    cuticleB: [8, 8],
    freeEdgeA: [0, 0],
    freeEdgeB: [8, 0],
  }
  const tex = projectNailTexture(sample, quad, 4, 4)
  assert.ok(tex)
  assert.equal(tex.width, 4)
  assert.equal(tex.height, 4)
  // Texel (col 0, row 0) is uv (0.125, 0.125) -> photo (1, 7). Pixel centres
  // sit at +0.5, so that is halfway between columns 0|1 and rows 6|7:
  // red (0+30)/2 = 15, green (180+210)/2 = 195.
  near(tex.data[0], 15, 1)
  near(tex.data[1], 195, 1)
  // Texel (col 3, row 3) is uv (0.875, 0.875) -> photo (7, 1): red 195, green 15.
  const last = (3 * 4 + 3) * 4
  near(tex.data[last], 195, 1)
  near(tex.data[last + 1], 15, 1)
  // Red grows left-to-right in every row (u follows side A -> side B).
  for (let row = 0; row < 4; row += 1) {
    for (let col = 1; col < 4; col += 1) {
      const o = (row * 4 + col) * 4
      assert.ok(tex.data[o] > tex.data[o - 4])
    }
  }
})

test('projectNailTexture: a photo rotated 90° gives the same texture', () => {
  // Same gradient photo, but the nail lies sideways: cuticle on the left.
  const w = 8
  const h = 8
  const rgba = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const o = (y * w + x) * 4
      // Along the nail (x) -> green; across (y) -> red, so it matches the upright case.
      rgba[o] = y * 30
      rgba[o + 1] = (7 - x) * 30
      rgba[o + 3] = 255
    }
  }
  const sample = samplerFromRgba(rgba, w, h)
  const quad: NailQuad = {
    cuticleA: [0, 0],
    cuticleB: [0, 8],
    freeEdgeA: [8, 0],
    freeEdgeB: [8, 8],
  }
  const tex = projectNailTexture(sample, quad, 4, 4)
  assert.ok(tex)
  near(tex.data[0], 15, 1)
  near(tex.data[1], 195, 1)
})

test('projectNailTexture: a mark two-thirds up a tapered nail stays two-thirds up the texture', () => {
  // Photo: everything black except a bright band at y = 200 (two-thirds up `tapered`).
  const sample: PixelSampler = (_x, y) => (Math.abs(y - 200) < 10 ? [255, 255, 255, 255] : [0, 0, 0, 255])
  const tex = projectNailTexture(sample, tapered, 8, 30)
  assert.ok(tex)
  let brightest = 0
  let brightestRow = -1
  for (let row = 0; row < 30; row += 1) {
    let sum = 0
    for (let col = 0; col < 8; col += 1) sum += tex.data[(row * 8 + col) * 4]
    if (sum > brightest) {
      brightest = sum
      brightestRow = row
    }
  }
  // Row 20 of 30 is v = 0.68; the band sits at v = 2/3.
  assert.ok(brightestRow >= 19 && brightestRow <= 20, `band found at row ${brightestRow}`)
})

test('projectNailTexture: bilinear sampling blends between pixels', () => {
  const sample: PixelSampler = x => (x < 1 ? [0, 0, 0, 255] : [200, 0, 0, 255])
  const quad: NailQuad = { cuticleA: [0, 2], cuticleB: [2, 2], freeEdgeA: [0, 0], freeEdgeB: [2, 0] }
  const tex = projectNailTexture(sample, quad, 1, 1)
  assert.ok(tex)
  // Texel centre is photo (1, 1): halfway between pixel 0 and pixel 1 in x.
  near(tex.data[0], 100, 1)
})

test('projectNailTexture: degenerate quad returns null', () => {
  const sample: PixelSampler = () => [0, 0, 0, 255]
  const coincident: NailQuad = { cuticleA: [0, 0], cuticleB: [0, 0], freeEdgeA: [1, 1], freeEdgeB: [0, 1] }
  assert.equal(projectNailTexture(sample, coincident, 2, 2), null)
  const bowtie: NailQuad = { cuticleA: [0, 0], cuticleB: [1, 1], freeEdgeB: [1, 0], freeEdgeA: [0, 1] }
  assert.equal(projectNailTexture(sample, bowtie, 2, 2), null)
})

test('defaultQuadForImage: usable, centred, cuticle below the free edge', () => {
  const quad = defaultQuadForImage(1000, 1500)
  assert.ok(isQuadUsable(quad))
  assert.ok(quad.cuticleA[1] > quad.freeEdgeA[1])
  assert.ok(quad.cuticleA[0] < quad.cuticleB[0])
  near((quad.cuticleA[0] + quad.cuticleB[0]) / 2, 500)
})

test('isQuadUsable: accepts a tapered quad in either winding, rejects a bow-tie', () => {
  assert.ok(isQuadUsable(tapered))
  const mirrored: NailQuad = {
    cuticleA: tapered.cuticleB,
    cuticleB: tapered.cuticleA,
    freeEdgeA: tapered.freeEdgeB,
    freeEdgeB: tapered.freeEdgeA,
  }
  assert.ok(isQuadUsable(mirrored))
  const bowtie: NailQuad = { cuticleA: [0, 0], cuticleB: [1, 1], freeEdgeB: [1, 0], freeEdgeA: [0, 1] }
  assert.equal(isQuadUsable(bowtie), false)
})

test('sourceResolution: photo pixels per texel', () => {
  const quad: NailQuad = { cuticleA: [0, 768], cuticleB: [256, 768], freeEdgeA: [0, 0], freeEdgeB: [256, 0] }
  const res = sourceResolution(quad, 512, 768)
  near(res.across, 0.5)
  near(res.along, 1)
})
