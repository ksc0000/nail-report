#!/usr/bin/env python3
"""Generates the synthetic angle-photo test set for the Phase 2 shape/curve
estimator benchmark (issue #389, scripts/bench-angles.sh).

Real 立体スキャン photos (a hand, four angles, real lighting) would be a
better ground truth, but per the #352 precedent for the detection benchmark,
a synthesized stand-in is an acceptable first step: it still exercises the
*real* pipeline end to end (Vision's VNGenerateForegroundInstanceMaskRequest
foreground mask + the skin-chroma exclusion in NailAngleMeasurer, not a
mocked mask), it's just missing real-world lighting/skin-tone/background
variety. A follow-up should replace or augment this set once real capture
data exists.

Each "case" is one nail sample scanned from all four angles: a top photo
(shape/corner ground truth, rendered from the *exact* same
NailGeometry.widthFactor formula the estimator fits against) and
side/otherSide/catHand photos (curveV/curveH ground truth, rendered so that
NailAngleMeasurer's own sagitta/chord measurements hit a target ratio
derived from NailShapeEstimator's calibration constants — see the comments
below and keep this file's constants in sync with NailShapeEstimator.swift's
if those ever change).

Run manually to regenerate:
    python3 ios/BenchmarkAssets/angles/generate_assets.py

Writes PNGs + manifest.json into this directory. Both the images and the
generator are committed, so the benchmark is reproducible without re-running
this script.
"""
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).parent
SUPERSAMPLE = 2
CANVAS = (300, 460)  # portrait, matches the vertical single-nail crop guide

BACKGROUND = (238, 236, 232)  # neutral studio grey — not skin, not nail toned
SKIN = (222, 176, 146)
NAIL = (70, 96, 200)  # a saturated, distinctly non-skin colour


# ---- ported from NailGeometry.swift (keep in sync) -------------------------

def smoothstep(a, b, x):
    t = min(1, max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def width_factor(t, shape, corner=0.0):
    base_cap = 0.09
    base_round = math.sqrt(max(0, 1 - ((base_cap - t) / base_cap) ** 2)) if t < base_cap else 1
    base_taper = 1 - 0.07 * smoothstep(0.3, 0, t)
    corner_mul = 1 + 0.75 * corner

    if shape == "square":
        tip_cap = min(0.2, max(0.01, 0.03 * corner_mul))
        floor = max(0.5, 0.86 - 0.2 * corner)
        tip_round = floor + (1 - floor) * math.sqrt(max(0, 1 - ((t - (1 - tip_cap)) / tip_cap) ** 2)) if t > 1 - tip_cap else 1
        return base_round * base_taper * tip_round
    if shape == "squoval":
        body = 1 - 0.09 * smoothstep(0.3, 1, t)
        tip_cap = min(0.4, max(0.03, 0.13 * corner_mul))
        floor = max(0.2, 0.5 - 0.25 * corner)
        tip_round = floor + (1 - floor) * math.sqrt(max(0, 1 - ((t - (1 - tip_cap)) / tip_cap) ** 2)) if t > 1 - tip_cap else 1
        return body * base_round * base_taper * tip_round
    if shape == "round":
        body = 1 - 0.05 * smoothstep(0.4, 1, t)
        tip_cap = min(0.45, max(0.1, 0.3 * corner_mul))
        tip_round = math.sqrt(max(0, 1 - ((t - (1 - tip_cap)) / tip_cap) ** 2)) if t > 1 - tip_cap else 1
        return body * base_round * base_taper * tip_round
    if shape == "oval":
        body = 1 - 0.1 * smoothstep(0.45, 1, t)
        tip_cap = min(0.4, max(0.08, 0.22 * corner_mul))
        tip_round = math.sqrt(max(0, 1 - ((t - (1 - tip_cap)) / tip_cap) ** 2)) if t > 1 - tip_cap else 1
        return body * base_round * base_taper * tip_round
    if shape == "almond":
        progress = smoothstep(0.18, 1, t)
        body = 1 - 0.62 * progress ** 1.6
        tip_cap = min(0.3, max(0.04, 0.09 * corner_mul))
        tip_round = math.sqrt(max(0, 1 - ((t - (1 - tip_cap)) / tip_cap) ** 2)) if t > 1 - tip_cap else 1
        return body * base_round * base_taper * tip_round
    if shape == "coffin":
        linear = max(0, (t - 0.12) / 0.88)
        body = 1 - 0.42 * linear
        corner_cap = min(0.14, max(0.008, 0.03 * corner_mul))
        corner_round = 0.9 + 0.1 * math.sqrt(max(0, 1 - ((t - (1 - corner_cap)) / corner_cap) ** 2)) if t > 1 - corner_cap else 1
        return body * base_round * base_taper * corner_round
    raise ValueError(shape)


SHAPES = ["round", "oval", "almond", "square", "squoval", "coffin"]

# These pick the *rendered* geometry for a target curveV/curveH — not the
# same thing as NailShapeEstimator.swift's estimation constants, which map
# NailAngleMeasurer's actual pixel measurements back to a value. ARCH_SENSITIVITY
# was derived from NailGeometry's mesh formula and happens to match the
# estimator's directly (the render-to-measurement round trip landed within
# tolerance without a fudge factor). CATPAW_BASELINE/SENSITIVITY did not —
# NailShapeEstimator.estimateCatPaw's constants were refit by linear
# regression against what this file's cat's-paw renderer actually produces,
# so they intentionally no longer match these two.
MEAN_PLATE_HEIGHT = 2.2
ARCH_SENSITIVITY = 0.14 / MEAN_PLATE_HEIGHT
THICKNESS_BASELINE = 0.055 / MEAN_PLATE_HEIGHT
CATPAW_BASELINE = 0.145
CATPAW_SENSITIVITY = 0.85 * CATPAW_BASELINE


def draw_background(size):
    w, h = size[0] * SUPERSAMPLE, size[1] * SUPERSAMPLE
    img = Image.new("RGB", (w, h), BACKGROUND)
    draw = ImageDraw.Draw(img)
    # A finger filling most of the frame, like the guide crop.
    margin_x = w * 0.22
    draw.rounded_rectangle([margin_x, h * 0.04, w - margin_x, h * 0.98], radius=w * 0.16, fill=SKIN)
    return img, draw, w, h


def render_top(shape, corner, path):
    img, draw, w, h = draw_background(CANVAS)
    top_y, bottom_y = h * 0.08, h * 0.62  # nail occupies the fingertip region
    cx = w / 2
    max_half_width = w * 0.30
    steps = 200
    left, right = [], []
    for i in range(steps + 1):
        t = i / steps
        y = top_y + (bottom_y - top_y) * t
        half = width_factor(t, shape, corner) * max_half_width
        left.append((cx - half, y))
        right.append((cx + half, y))
    polygon = left + list(reversed(right))
    draw.polygon(polygon, fill=NAIL)
    img = img.resize(CANVAS, Image.LANCZOS)
    img.save(path)


def render_side(curve_v, path, jitter=0.0):
    img, draw, w, h = draw_background(CANVAS)
    top_y, bottom_y = h * 0.10, h * 0.85
    length = bottom_y - top_y
    band_half_width = w * 0.05
    cx = w / 2
    arch_ratio = ARCH_SENSITIVITY * curve_v + jitter
    amplitude = arch_ratio * length
    steps = 200
    left, right = [], []
    for i in range(steps + 1):
        t = i / steps
        y = top_y + length * t
        bow = amplitude * (1 - (2 * t - 1) ** 2)
        x = cx + bow
        left.append((x - band_half_width, y))
        right.append((x + band_half_width, y))
    polygon = left + list(reversed(right))
    draw.polygon(polygon, fill=NAIL)
    img = img.resize(CANVAS, Image.LANCZOS)
    img.save(path)


def render_cat_paw(curve_h, path):
    img, draw, w, h = draw_background(CANVAS)
    top_y, bottom_y = h * 0.15, h * 0.75
    length = bottom_y - top_y
    peak_y = (top_y + bottom_y) / 2
    span = length / 12 * 2  # matches NailAngleMeasurer's `step` neighbourhood
    peak_half_width = w * 0.34
    sagitta_over_chord = CATPAW_BASELINE + CATPAW_SENSITIVITY * curve_h
    near_far_half_width = peak_half_width * (1 - 2 * sagitta_over_chord)
    cx = w / 2
    steps = 200
    left, right = [], []
    for i in range(steps + 1):
        t = i / steps
        y = top_y + length * t
        d = abs(y - peak_y)
        if d >= span:
            half = near_far_half_width
        else:
            # smooth bump from near/far width up to the peak width
            bump_t = 1 - d / span
            half = near_far_half_width + (peak_half_width - near_far_half_width) * bump_t
        left.append((cx - half, y))
        right.append((cx + half, y))
    polygon = left + list(reversed(right))
    draw.polygon(polygon, fill=NAIL)
    img = img.resize(CANVAS, Image.LANCZOS)
    img.save(path)


def main():
    cases = []
    # Non-negative only: NailAngleMeasurer.sideArchAndThickness takes the
    # magnitude of the mask's bow (a 2D side silhouette can't reliably tell a
    # convex arch from a concave one), so NailShapeEstimator.estimateCurveV
    # never returns a negative value either — see its doc comment.
    curve_vs = [0.8, 0.4, 0.0, 0.3, 0.6, 0.9]
    curve_hs = [0.8, -0.6, 0.2, -0.9, 0.5, 0.0]
    for i, shape in enumerate(SHAPES):
        corner = 0.0
        curve_v = curve_vs[i]
        curve_h = curve_hs[i]
        top_file = f"set{i + 1}_top.png"
        side_file = f"set{i + 1}_side.png"
        other_file = f"set{i + 1}_otherside.png"
        cat_file = f"set{i + 1}_catpaw.png"

        render_top(shape, corner, OUT_DIR / top_file)
        render_side(curve_v, OUT_DIR / side_file)
        render_side(curve_v, OUT_DIR / other_file, jitter=0.01)
        render_cat_paw(curve_h, OUT_DIR / cat_file)

        cases.append({
            "id": f"set{i + 1}_{shape}",
            "shape": shape,
            "corner": corner,
            "curveV": curve_v,
            "curveH": curve_h,
            "top": top_file,
            "side": side_file,
            "otherSide": other_file,
            "catHand": cat_file,
        })

    manifest = {"cases": cases}
    with open(OUT_DIR / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"wrote {len(cases)} cases to {OUT_DIR}")


if __name__ == "__main__":
    main()
