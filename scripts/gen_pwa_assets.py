#!/usr/bin/env python3
"""Rasterize the Hamro Bazaar basket mark into PWA PNG assets.

Reproduces public/icons/icon-192.svg (512 viewBox) exactly with PIL at 4x
supersampling, then downsamples with LANCZOS. Outputs:
  public/icons/apple-touch-icon.png  (180x180, any)
  public/icons/icon-192.png / icon-512.png  (any)
  public/icons/icon-maskable-192.png / icon-maskable-512.png  (maskable, 80% safe zone)
  public/splash/splash-<WxH>.png  (ivory, centered tile)
"""
from PIL import Image, ImageDraw

MAROON = (0x8C, 0x2B, 0x2B, 255)
GOLD = (0xC6, 0xA1, 0x5B, 255)
IVORY = (0xFA, 0xF6, 0xEF, 255)
BASE = 512
SS = 4  # supersample factor

# Basket body outline from the SVG path:
# M128 208h256 l-35 132 a32.. H193 a32.. L128 208 z
BODY = [(128, 208), (384, 208), (349, 340), (319, 364), (193, 364), (163, 340), (128, 208)]
# Handle: M160 208 c0-56 43-96 96-96 s96 40 96 96
HANDLE_SEGS = [
    ((160, 208), (160, 152), (203, 112), (256, 112)),
    ((256, 112), (309, 112), (352, 152), (352, 208)),
]
STRIPE = [(200, 272), (312, 272)]


def cubic(p0, p1, p2, p3, n=64):
    pts = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def draw_mark(d, s):
    """Draw the gold basket mark (+ ivory stripe) on draw context d; s = px per base unit."""
    gold_w = int(round(28 * s))
    body = [(x * s, y * s) for x, y in BODY]
    d.line(body, fill=GOLD, width=gold_w, joint="curve")
    for seg in HANDLE_SEGS:
        pts = [(x * s, y * s) for x, y in cubic(*seg)]
        d.line(pts, fill=GOLD, width=gold_w, joint="curve")
    stripe = [(x * s, y * s) for x, y in STRIPE]
    d.line(stripe, fill=IVORY, width=int(round(20 * s)))


def render_icon(size):
    """Full-bleed maroon rounded tile with centered mark, at `size` px."""
    big = size * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, big, big], radius=int(round(112 * big / BASE)), fill=MAROON)
    draw_mark(d, big / BASE)
    return img.resize((size, size), Image.LANCZOS)


def render_maskable(size):
    """Solid maroon canvas with the full icon tile centered at 80% (safe zone)."""
    big = size * SS
    img = Image.new("RGBA", (big, big), MAROON)
    tile_px = int(round(big * 0.8))
    tile = render_icon(tile_px)
    img.alpha_composite(tile, (int((big - tile_px) / 2), int((big - tile_px) / 2)))
    return img.resize((size, size), Image.LANCZOS)


def render_splash(w, h):
    img = Image.new("RGB", (w, h), IVORY[:3])
    tile_size = int(round(min(w, h) * 0.30))
    tile = render_icon(tile_size)  # RGBA: keep rounded corners transparent
    img.paste(tile, ((w - tile_size) // 2, (h - tile_size) // 2), tile)
    return img


def main():
    import os
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons = os.path.join(root, "public", "icons")
    splash = os.path.join(root, "public", "splash")
    os.makedirs(icons, exist_ok=True)
    os.makedirs(splash, exist_ok=True)

    jobs = [
        ("apple-touch-icon.png", 180, render_icon),
        ("icon-192.png", 192, render_icon),
        ("icon-512.png", 512, render_icon),
        ("icon-maskable-192.png", 192, render_maskable),
        ("icon-maskable-512.png", 512, render_maskable),
    ]
    for name, size, fn in jobs:
        fn(size).save(os.path.join(icons, name), optimize=True)
        print("wrote", name, size)

    for w, h in [(1170, 2532), (1290, 2796), (1125, 2436), (1242, 2688), (828, 1792)]:
        render_splash(w, h).save(os.path.join(splash, f"splash-{w}x{h}.png"), optimize=True)
        print("wrote", f"splash-{w}x{h}.png")


if __name__ == "__main__":
    main()
