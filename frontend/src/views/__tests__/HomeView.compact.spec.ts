import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import HomeView from '../HomeView.vue'

const { appStore, authStore } = vi.hoisted(() => ({
  appStore: {
    cachedPublicSettings: {} as Record<string, unknown>,
    siteName: 'Fallback site',
    siteLogo: '',
    docUrl: '',
    publicSettingsLoaded: true,
    fetchPublicSettings: vi.fn(),
  },
  authStore: {
    isAuthenticated: false,
    isAdmin: false,
    user: null as { email?: string } | null,
    checkAuth: vi.fn(),
  },
}))

vi.mock('@/stores', () => ({
  useAppStore: () => appStore,
  useAuthStore: () => authStore,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

function mountHome(settings: Record<string, unknown> = {}) {
  appStore.cachedPublicSettings = {
    site_name: 'Test site',
    site_subtitle: 'Test subtitle',
    ...settings,
  }

  return mount(HomeView, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        LocaleSwitcher: { template: '<div data-testid="locale-switcher" />' },
        Icon: { template: '<span data-testid="icon" />' },
      },
    },
  })
}

function compactDestination(wrapper: ReturnType<typeof mountHome>) {
  return wrapper.get('[data-testid="compact-home"]').findComponent(RouterLinkStub).props('to')
}

function primaryDestination(wrapper: ReturnType<typeof mountHome>) {
  const cta = wrapper
    .findAllComponents(RouterLinkStub)
    .find((link) => link.attributes('data-testid') === 'home-primary-cta')

  expect(cta).toBeDefined()
  return cta?.props('to')
}

function renderedClasses(wrapper: ReturnType<typeof mountHome>) {
  return wrapper.findAll('*').flatMap((element) => element.classes())
}

describe('HomeView compact mode', () => {
  beforeEach(() => {
    authStore.isAuthenticated = false
    authStore.isAdmin = false
    authStore.user = null
    appStore.siteName = 'Fallback site'
    appStore.siteLogo = ''
    appStore.docUrl = ''
    authStore.checkAuth.mockClear()
    appStore.fetchPublicSettings.mockClear()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList)
  })

  it('renders custom HTML ahead of compact mode', () => {
    const wrapper = mountHome({
      compact_home_enabled: true,
      home_content: '<section id="custom-home">Custom home</section>',
    })

    expect(wrapper.get('#custom-home').text()).toBe('Custom home')
    expect(wrapper.find('[data-testid="compact-home"]').exists()).toBe(false)
  })

  it('renders custom URL content ahead of compact mode', () => {
    const wrapper = mountHome({
      compact_home_enabled: true,
      home_content: ' https://example.com/home ',
    })

    const iframe = wrapper.get('iframe')

    expect(iframe.attributes('src')).toBe('https://example.com/home')
    expect(iframe.attributes('sandbox')).toBe('allow-forms allow-popups allow-scripts')
    expect(iframe.attributes('referrerpolicy')).toBe('no-referrer')
    expect(wrapper.find('[data-testid="compact-home"]').exists()).toBe(false)
  })

  it('treats whitespace-only custom content as empty and selects compact mode', () => {
    const wrapper = mountHome({ compact_home_enabled: true, home_content: ' \n\t ' })

    expect(wrapper.get('[data-testid="compact-home"]').text()).toContain('Test site')
  })

  it.each([undefined, false])('selects the default home when compact mode is %s', (enabled) => {
    const settings = enabled === undefined ? {} : { compact_home_enabled: enabled }
    const wrapper = mountHome(settings)

    expect(wrapper.find('[data-testid="compact-home"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="default-home"]').exists()).toBe(true)
    expect(wrapper.find('.terminal-container').exists()).toBe(true)
  })

  it.each([
    ['default', false, false, false, '/login'],
    ['default', false, true, false, '/dashboard'],
    ['default', false, true, true, '/admin/dashboard'],
    ['compact', true, false, false, '/login'],
    ['compact', true, true, false, '/dashboard'],
    ['compact', true, true, true, '/admin/dashboard'],
  ])(
    'routes the %s primary CTA for authenticated=%s admin=%s to %s',
    (mode, compactEnabled, authenticated, admin, destination) => {
      authStore.isAuthenticated = authenticated
      authStore.isAdmin = admin

      const wrapper = mountHome({ compact_home_enabled: compactEnabled })

      expect(wrapper.find(`[data-testid="${mode}-home"]`).exists()).toBe(true)
      expect(primaryDestination(wrapper)).toBe(destination)
      if (compactEnabled) expect(compactDestination(wrapper)).toBe(destination)
      expect(authStore.checkAuth).toHaveBeenCalledOnce()
      expect(appStore.fetchPublicSettings).not.toHaveBeenCalled()
    },
  )

  it.each([
    ['default', false],
    ['compact', true],
  ])('keeps the %s page opaque white under a dark preference', (mode, compactEnabled) => {
    document.documentElement.classList.add('dark')
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList)

    const wrapper = mountHome({ compact_home_enabled: compactEnabled })
    const root = wrapper.get(`[data-testid="${mode}-home"]`)
    const surfaces = wrapper.findAll('[data-home-surface]')
    const classes = renderedClasses(wrapper)

    expect(root.classes()).toEqual(
      expect.arrayContaining(['home-white-root', 'home-white-surface', 'bg-white']),
    )
    expect(surfaces.length).toBeGreaterThanOrEqual(4)
    for (const surface of surfaces) {
      expect(surface.classes()).toContain('home-white-surface')
      expect(surface.classes()).toContain('bg-white')
      expect(surface.classes().some((name) => name.includes('gradient'))).toBe(false)
    }
    expect(classes.some((name) => name.startsWith('dark:'))).toBe(false)
    expect(classes.some((name) => name.startsWith('bg-white/'))).toBe(false)
    expect(classes.some((name) => name.includes('backdrop-blur'))).toBe(false)
    expect(classes.some((name) => name.includes('linear-gradient'))).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it.each([
    ['default', false],
    ['compact', true],
  ])('keeps locale switching and documentation access on the %s page', (mode, compactEnabled) => {
    const wrapper = mountHome({
      compact_home_enabled: compactEnabled,
      doc_url: 'https://docs.example.com/ainode',
    })

    expect(wrapper.get(`[data-testid="${mode}-home"]`).exists()).toBe(true)
    expect(wrapper.get('[data-testid="locale-switcher"]').exists()).toBe(true)
    expect(wrapper.findAll('a[href="https://docs.example.com/ainode"]').length).toBeGreaterThan(0)
  })

  it.each([
    ['default', false],
    ['compact', true],
  ])('uses the bundled logo fallback with an accessible name on the %s page', (mode, compactEnabled) => {
    const wrapper = mountHome({ compact_home_enabled: compactEnabled, site_logo: '' })
    const logos = wrapper.findAll('img[src="/logo.svg"]')

    expect(wrapper.get(`[data-testid="${mode}-home"]`).exists()).toBe(true)
    expect(logos.length).toBeGreaterThan(0)
    for (const logo of logos) expect(logo.attributes('alt')).toBe('Test site logo')
  })

  it.each([
    ['default', false],
    ['compact', true],
  ])('uses AINODE when no configured or store site name exists on the %s page', (mode, compactEnabled) => {
    appStore.siteName = ''

    const wrapper = mountHome({ compact_home_enabled: compactEnabled, site_name: '' })

    expect(wrapper.get(`[data-testid="${mode}-home"]`).text()).toContain('AINODE')
    expect(wrapper.get('img').attributes('alt')).toBe('AINODE logo')
  })
})
