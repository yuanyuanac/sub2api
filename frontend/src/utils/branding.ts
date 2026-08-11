import { sanitizeUrl } from '@/utils/url'

function inferFaviconMimeType(logoUrl: string): string {
  const normalized = logoUrl.toLowerCase()
  if (normalized.startsWith('data:image/svg+xml')) {
    return 'image/svg+xml'
  }
  if (normalized.startsWith('data:image/png')) {
    return 'image/png'
  }
  if (normalized.startsWith('data:image/x-icon')) {
    return 'image/x-icon'
  }

  const path = normalized.replace(/[?#].*$/, '')
  if (path.endsWith('.svg')) {
    return 'image/svg+xml'
  }
  if (path.endsWith('.png')) {
    return 'image/png'
  }
  if (path.endsWith('.ico')) {
    return 'image/x-icon'
  }
  return ''
}

export function updateFavicon(logoUrl: string): void {
  const sanitizedLogoUrl = sanitizeUrl(logoUrl, {
    allowRelative: true,
    allowDataUrl: true,
  })
  if (!sanitizedLogoUrl) {
    return
  }

  document.querySelectorAll<HTMLLinkElement>('link[rel]').forEach((candidate) => {
    const relTokens = candidate.rel.toLowerCase().split(/\s+/)
    if (relTokens.includes('icon')) {
      candidate.remove()
    }
  })

  const link = document.createElement('link')
  link.rel = 'icon'
  const mimeType = inferFaviconMimeType(sanitizedLogoUrl)
  if (mimeType) {
    link.type = mimeType
  }
  link.href = sanitizedLogoUrl
  document.head.appendChild(link)
}
