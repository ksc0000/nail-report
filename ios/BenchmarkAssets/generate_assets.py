#!/usr/bin/env python3
"""Generates the synthetic test-image set for the nail-detection benchmark
(scripts/bench-detect.sh). Real hand photos would be a better ground truth,
but per issue #352 a synthesized hand/nail stand-in is an acceptable first
step, since Vision's hand-pose accuracy on *real* photos is the thing a
follow-up issue (#353) needs to move — this harness just needs a stable,
reproducible, checked-in image set to measure against.

Run manually to regenerate:
    python3 ios/BenchmarkAssets/generate_assets.py

Writes PNGs + manifest.json into this directory. Both the images and the
generator are committed, so the benchmark is reproducible without re-running
this script.
"""
import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).parent
SUPERSAMPLE = 4  # draw big, downscale for anti-aliasing


def _finger(draw, base, tip, width, color):
    """Draws one tapered finger as a rounded capsule from base to tip."""
    bx, by = base
    tx, ty = tip
    length = math.hypot(tx - bx, ty - by)
    if length < 1:
        return
    ux, uy = (tx - bx) / length, (ty - by) / length
    nx, ny = -uy, ux
    base_w = width
    tip_w = width * 0.72
    poly = [
        (bx + nx * base_w, by + ny * base_w),
        (tx + nx * tip_w, ty + ny * tip_w),
        (tx - nx * tip_w, ty - ny * tip_w),
        (bx - nx * base_w, by - ny * base_w),
    ]
    draw.polygon(poly, fill=color)
    draw.ellipse([tx - tip_w, ty - tip_w, tx + tip_w, ty + tip_w], fill=color)
    draw.ellipse([bx - base_w, by - base_w, bx + base_w, by + base_w], fill=color)
    # nail highlight near the tip
    nail_len = width * 1.6
    nail_w = width * 0.55
    ntx, nty = tx - ux * nail_len * 0.15, ty - uy * nail_len * 0.15
    nail_poly = [
        (ntx + nx * nail_w, nty + ny * nail_w),
        (ntx + ux * nail_len * 0.6 + nx * nail_w * 0.5, nty + uy * nail_len * 0.6 + ny * nail_w * 0.5),
        (ntx - nx * nail_w, nty - ny * nail_w),
    ]
    draw.polygon(nail_poly, fill=(255, 235, 225))


def draw_hand(size, angle_deg, finger_count, skin, dark=False, jitter_seed=0):
    """Draws a crude palm + tapered fingers, rotated by angle_deg (0 = fingers up)."""
    rng = random.Random(jitter_seed)
    W, H = size[0] * SUPERSAMPLE, size[1] * SUPERSAMPLE
    img = Image.new("RGB", (W, H), (30, 28, 26) if dark else (235, 230, 225))
    draw = ImageDraw.Draw(img)

    cx, cy = W / 2, H * 0.62
    palm_w, palm_h = W * 0.30, H * 0.28
    draw.ellipse([cx - palm_w / 2, cy - palm_h / 2, cx + palm_w / 2, cy + palm_h / 2], fill=skin)

    spread = [-1.15, -0.55, 0.0, 0.55, 1.05][:finger_count]
    lengths = [H * f for f in (0.30, 0.42, 0.46, 0.43, 0.34)][:finger_count]
    widths = [W * f for f in (0.052, 0.040, 0.038, 0.038, 0.034)][:finger_count]
    base_r = palm_w * 0.42

    theta = math.radians(angle_deg)
    for i, (a, length, width) in enumerate(zip(spread, lengths, widths)):
        finger_angle = a * 0.32
        bx = cx + math.sin(finger_angle) * base_r * 1.1
        by = cy - math.cos(finger_angle) * base_r * 0.5
        length *= 1 + rng.uniform(-0.04, 0.04)
        tx = bx + math.sin(finger_angle) * length
        ty = by - math.cos(finger_angle) * length
        # rotate (bx,by)/(tx,ty) around (cx, cy) by theta for orientation variants
        def rot(px, py):
            dx, dy = px - cx, py - cy
            rx = dx * math.cos(theta) - dy * math.sin(theta)
            ry = dx * math.sin(theta) + dy * math.cos(theta)
            return cx + rx, cy + ry

        _finger(draw, rot(bx, by), rot(tx, ty), width, skin)

    img = img.filter(ImageFilter.GaussianBlur(radius=SUPERSAMPLE * 0.6))
    img = img.resize(size, Image.LANCZOS)
    return img


def draw_single_nail(size, skin, dark=False):
    W, H = size[0] * SUPERSAMPLE, size[1] * SUPERSAMPLE
    img = Image.new("RGB", (W, H), (25, 24, 22) if dark else (240, 236, 232))
    draw = ImageDraw.Draw(img)
    _finger(draw, (W * 0.5, H * 0.95), (W * 0.5, H * 0.15), W * 0.16, skin)
    img = img.filter(ImageFilter.GaussianBlur(radius=SUPERSAMPLE * 0.6))
    return img.resize(size, Image.LANCZOS)


def draw_blank(size):
    img = Image.new("RGB", size, (210, 205, 198))
    draw = ImageDraw.Draw(img)
    for i in range(0, size[0], 40):
        draw.line([(i, 0), (i, size[1])], fill=(198, 192, 184), width=2)
    return img


SKIN_TONES = [
    (222, 178, 150),
    (198, 148, 116),
    (236, 200, 176),
]

CASES = []


def add_case(name, image, expected):
    path = OUT_DIR / f"{name}.png"
    image.save(path, "PNG")
    CASES.append({"file": path.name, "expectedNails": expected})


def main():
    size = (600, 900)

    add_case("hand_up_01", draw_hand(size, 0, 5, SKIN_TONES[0], jitter_seed=1), 5)
    add_case("hand_up_02", draw_hand(size, 0, 5, SKIN_TONES[1], jitter_seed=2), 5)
    add_case("hand_up_03", draw_hand(size, 0, 5, SKIN_TONES[2], jitter_seed=3), 5)
    add_case("hand_sideways_left", draw_hand(size, -90, 5, SKIN_TONES[0], jitter_seed=4), 5)
    add_case("hand_sideways_right", draw_hand(size, 90, 5, SKIN_TONES[1], jitter_seed=5), 5)
    add_case("hand_down_01", draw_hand(size, 180, 5, SKIN_TONES[2], jitter_seed=6), 5)
    add_case("hand_tilted_45", draw_hand(size, 45, 5, SKIN_TONES[0], jitter_seed=7), 5)
    add_case("hand_partial_3finger", draw_hand(size, 0, 3, SKIN_TONES[1], jitter_seed=8), 3)
    add_case("hand_dark_01", draw_hand(size, 0, 5, SKIN_TONES[0], dark=True, jitter_seed=9), 5)
    add_case("hand_dark_sideways", draw_hand(size, 90, 5, SKIN_TONES[2], dark=True, jitter_seed=10), 5)
    add_case("single_nail_01", draw_single_nail(size, SKIN_TONES[0]), 1)
    add_case("single_nail_02", draw_single_nail(size, SKIN_TONES[1]), 1)
    add_case("single_nail_dark", draw_single_nail(size, SKIN_TONES[2], dark=True), 1)
    add_case("no_hand_background", draw_blank(size), 0)

    manifest = {"cases": CASES}
    with open(OUT_DIR / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"generated {len(CASES)} images -> {OUT_DIR}")


if __name__ == "__main__":
    main()
