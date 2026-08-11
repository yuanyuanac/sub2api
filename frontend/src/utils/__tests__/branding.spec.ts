import { beforeEach, describe, expect, it } from 'vitest'
import { updateFavicon } from '@/utils/branding'

describe('updateFavicon', () => {
  beforeEach(() => {
    document.head.innerHTML = `
      <link rel="icon" href="/logo.svg">
      <link rel="shortcut icon" href="/legacy.ico">
      <link rel="apple-touch-icon" href="/apple-touch.png">
      <link rel="manifest" href="/site.webmanifest">
    `
  })

  it('removes every favicon candidate while preserving Apple Touch and manifest links', () => {
    updateFavicon('https://example.com/custom-logo.png')

    const faviconLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel]')).filter(
      (link) => link.rel.toLowerCase().split(/\s+/).includes('icon'),
    )
    expect(faviconLinks).toHaveLength(1)
    expect(faviconLinks[0]?.href).toBe('https://example.com/custom-logo.png')
    expect(faviconLinks[0]?.type).toBe('image/png')
    expect(document.querySelector('link[rel="apple-touch-icon"]')).not.toBeNull()
    expect(document.querySelector('link[rel="manifest"]')).not.toBeNull()
  })

  it('infers SVG MIME type when the URL has a query string and fragment', () => {
    updateFavicon('/uploads/custom.svg?v=2#brand')

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    expect(link?.getAttribute('href')).toBe('/uploads/custom.svg?v=2#brand')
    expect(link?.type).toBe('image/svg+xml')
  })

  it('does not modify any nodes for an unsafe logo URL', () => {
    const originalHead = document.head.innerHTML

    updateFavicon('javascript:alert(1)')

    expect(document.head.innerHTML).toBe(originalHead)
  })

  it('creates a favicon when the document has none', () => {
    document.head.innerHTML = '<link rel="manifest" href="/site.webmanifest">'

    updateFavicon('/uploads/custom.ico')

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    expect(link?.getAttribute('href')).toBe('/uploads/custom.ico')
    expect(link?.type).toBe('image/x-icon')
    expect(document.querySelector('link[rel="manifest"]')).not.toBeNull()
  })

  it('omits the type attribute for an unknown image extension', () => {
    updateFavicon('https://example.com/custom-logo')

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    expect(link?.hasAttribute('type')).toBe(false)
  })
})
