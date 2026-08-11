# AINODE Brand Asset Pipeline

The product-owner supplied PNG is the immutable source for every AINODE
browser and install icon. The generator validates the original file by SHA-256,
applies the approved `(3, 17, 59, 73)` square crop, and only performs
aspect-preserving resize or centered maskable placement. It does not redraw or
trace the symbol.

## Generate

The first command ingests an approved source only when its bytes match the
recorded digest. Later runs use the versioned source in this directory.

```powershell
python tools/branding/generate_brand_assets.py `
  --approved-source C:\path\to\approved-image.png
python tools/branding/generate_brand_assets.py
```

## Verify

```powershell
python tools/branding/generate_brand_assets.py --check
```

The check fails when any expected file is missing or differs from a freshly
generated deterministic result. PNG output is opaque RGB. The maskable icon
centers the unchanged symbol on an opaque white canvas and keeps it inside the
standard safe zone. No service worker is generated.
