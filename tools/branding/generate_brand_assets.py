#!/usr/bin/env python3
"""Generate the versioned AINODE browser and install assets.

The approved artwork is deliberately treated as immutable input.  Ingestion
validates its SHA-256 digest, and every output starts from the same fixed,
square crop so the symbol is never stretched or redrawn.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import shutil
import sys
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
APPROVED_SOURCE = Path(__file__).parent / "source" / "ainode-approved-original.png"
APPROVED_SHA256 = "4498dc6be1de3be9ab417b7de057cc80c057265303685fc9709848c479f24b9d"
SOURCE_SIZE = (83, 88)
CROP_BOX = (3, 17, 59, 73)
PUBLIC_DIR = REPOSITORY_ROOT / "frontend" / "public"
BRAND_DIR = PUBLIC_DIR / "brand"
WHITE = (255, 255, 255)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(64 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_source(path: Path) -> None:
    if not path.is_file():
        raise ValueError(f"approved source is missing: {path}")
    actual_hash = sha256(path)
    if actual_hash != APPROVED_SHA256:
        raise ValueError(
            f"approved source SHA-256 mismatch: expected {APPROVED_SHA256}, got {actual_hash}"
        )
    with Image.open(path) as image:
        if image.size != SOURCE_SIZE or image.mode != "RGB":
            raise ValueError(
                f"approved source must be RGB {SOURCE_SIZE[0]}x{SOURCE_SIZE[1]}, "
                f"got {image.mode} {image.size[0]}x{image.size[1]}"
            )


def ingest_source(candidate: Path) -> None:
    validate_source(candidate)
    APPROVED_SOURCE.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, APPROVED_SOURCE)


def png_bytes(image: Image.Image) -> bytes:
    output = io.BytesIO()
    image.save(output, format="PNG", optimize=False, compress_level=9)
    return output.getvalue()


def resized(master: Image.Image, size: int) -> Image.Image:
    return master.resize((size, size), Image.Resampling.LANCZOS)


def maskable(master: Image.Image, size: int = 512) -> Image.Image:
    # Keep the complete rounded-square symbol inside the maskable safe zone.
    symbol_size = 358
    symbol = resized(master, symbol_size)
    canvas = Image.new("RGB", (size, size), WHITE)
    offset = (size - symbol_size) // 2
    canvas.paste(symbol, (offset, offset))
    return canvas


def svg_bytes(master_png: bytes) -> bytes:
    encoded = base64.b64encode(master_png).decode("ascii")
    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" '
        'viewBox="0 0 56 56">\n'
        f'  <image width="56" height="56" href="data:image/png;base64,{encoded}"/>\n'
        '</svg>\n'
    )
    return svg.encode("utf-8")


def manifest_bytes() -> bytes:
    manifest = {
        "id": "/",
        "name": "AINODE",
        "short_name": "AINODE",
        "description": "AINODE AI API Gateway",
        "start_url": "/home",
        "scope": "/",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#FFFFFF",
        "icons": [
            {
                "src": "/brand/pwa-192-v1.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "/brand/pwa-512-v1.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "/brand/pwa-maskable-512-v1.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable",
            },
        ],
    }
    return (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def expected_outputs() -> dict[Path, bytes]:
    validate_source(APPROVED_SOURCE)
    with Image.open(APPROVED_SOURCE) as source:
        master = source.crop(CROP_BOX).convert("RGB")

    master_png = png_bytes(master)
    svg = svg_bytes(master_png)
    return {
        BRAND_DIR / "logo-v1.svg": svg,
        BRAND_DIR / "favicon-v1.svg": svg,
        BRAND_DIR / "favicon-16-v1.png": png_bytes(resized(master, 16)),
        BRAND_DIR / "favicon-32-v1.png": png_bytes(resized(master, 32)),
        BRAND_DIR / "apple-touch-180-v1.png": png_bytes(resized(master, 180)),
        BRAND_DIR / "pwa-192-v1.png": png_bytes(resized(master, 192)),
        BRAND_DIR / "pwa-512-v1.png": png_bytes(resized(master, 512)),
        BRAND_DIR / "pwa-maskable-512-v1.png": png_bytes(maskable(master)),
        PUBLIC_DIR / "logo.svg": svg,
        PUBLIC_DIR / "site.webmanifest": manifest_bytes(),
    }


def write_outputs(outputs: dict[Path, bytes]) -> None:
    for path, content in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)


def check_outputs(outputs: dict[Path, bytes]) -> bool:
    failures: list[str] = []
    for path, expected in outputs.items():
        relative = path.relative_to(REPOSITORY_ROOT)
        if not path.is_file():
            failures.append(f"missing: {relative}")
        elif path.read_bytes() != expected:
            failures.append(f"stale: {relative}")
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return False
    print(f"verified {len(outputs)} deterministic AINODE assets")
    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--approved-source",
        type=Path,
        help="ingest the product-owner supplied PNG after exact hash validation",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify committed outputs without changing them",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.approved_source:
        ingest_source(args.approved_source.resolve())
    outputs = expected_outputs()
    if args.check:
        return 0 if check_outputs(outputs) else 1
    write_outputs(outputs)
    print(f"generated {len(outputs)} deterministic AINODE assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
