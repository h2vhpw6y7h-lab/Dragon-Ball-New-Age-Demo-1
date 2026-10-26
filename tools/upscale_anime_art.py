#!/usr/bin/env python3
"""Safe, reproducible AI super-resolution for existing anime art (FSRCNN x4)."""
from pathlib import Path
import cv2
import numpy as np
import sys

MODEL = Path("models/FSRCNN_x4.pb")
PAIRS = [
    ("assets/anime-scene-battle-v1.png", "assets/anime-scene-battle-hd.webp"),
    ("assets/anime-scene-ki-v1.png", "assets/anime-scene-ki-hd.webp"),
]
assert MODEL.stat().st_size > 30000, "FSRCNN model is missing or incomplete"
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(str(MODEL))
sr.setModel("fsrcnn", 4)

for source, destination in PAIRS:
    src = cv2.imread(source, cv2.IMREAD_COLOR)
    if src is None: raise RuntimeError("Missing original: " + source)
    h, w = src.shape[:2]
    assert w == 199 and h == 128, f"Source changed unexpectedly: {source} {w}x{h}"
    enhanced = sr.upsample(src)
    nh, nw = enhanced.shape[:2]
    assert (nw, nh) == (796, 512), (nw, nh)
    # Resample a small remaining 1.15x to more closely match the original
    # illustration size; mildly restore cel-shaded line edges without halos.
    enhanced = cv2.resize(enhanced, (920, 592), interpolation=cv2.INTER_LANCZOS4)
    blurred = cv2.GaussianBlur(enhanced, (0,0), 0.75)
    enhanced = cv2.addWeighted(enhanced, 1.13, blurred, -0.13, 0)
    assert np.isfinite(enhanced).all(), "Non-finite pixels"
    dst = Path(destination)
    dst.parent.mkdir(parents=True, exist_ok=True)
    ok = cv2.imwrite(str(dst), enhanced, [cv2.IMWRITE_WEBP_QUALITY, 94])
    assert ok and dst.stat().st_size > 50000, "HD output empty or too compressed"
    verify = cv2.imread(str(dst), cv2.IMREAD_COLOR)
    assert verify is not None and verify.shape[:2] == (592, 920)
    print(f"PASS {source}: {w}x{h} -> {nw}x{nh} -> 920x592 ({dst.stat().st_size:,} bytes)")
