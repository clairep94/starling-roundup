import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import NavigationBarLink from '../components/NavigationBarLink.vue'
import { useRoute } from 'vue-router'

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}))

function navigationBarLinkFactory(
  link: {
    path: string
    icon: string
    iconFilled: string
    title: string
  }
): VueWrapper<any> {
  return shallowMount(NavigationBarLink, {
    props: {
      link
    }
  })
}

describe.skip('NavigationBarLink', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render a link with the correct title', () => {
    (useRoute as vi.Mock).mockReturnValue({ path: '/some-other-route' })

    const link = {
      path: '/test',
      icon: 'icon',
      iconFilled: 'icon-filled',
      title: 'Test'
    }
    const wrapper = navigationBarLinkFactory(link)

    expect(wrapper.find('p').text()).toBe(link.title)
  })

  it('should apply active styles when the route matches the link path', () => {
    (useRoute as vi.Mock).mockReturnValue({ path: '/test' }) // Mock matching route

    const link = {
      path: '/test',
      icon: 'icon',
      iconFilled: 'icon-filled',
      title: 'Test'
    }
    const wrapper = navigationBarLinkFactory(link)

    expect(wrapper.classes()).toContain('bg-white/30') // Class for active state
    expect(wrapper.classes()).toContain('bg-white/10') // Class for active link
  })

  it('should not apply active styles when the route does not match', () => {
    (useRoute as vi.Mock).mockReturnValue({ path: '/not-matching' }) // Mock different route

    const link = {
      path: '/test',
      icon: 'icon',
      iconFilled: 'icon-filled',
      title: 'Test'
    }
    const wrapper = navigationBarLinkFactory(link)

    expect(wrapper.classes()).toContain('bg-white/10') // Class for inactive state
    expect(wrapper.classes()).toContain('border-l-blue-400') // Class for inactive link
  })

  it('should render the correct icon based on active state', () => {
    (useRoute as vi.Mock).mockReturnValue({ path: '/test' }) // Mock active route

    const link = {
      path: '/test',
      icon: 'icon-default',
      iconFilled: 'icon-active',
      title: 'Test'
    }
    const wrapper = navigationBarLinkFactory(link)

    expect(wrapper.findComponent({ name: 'icon-active' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'icon-default' }).exists()).toBe(false)
  })

  it('should render the default icon when inactive', () => {
    (useRoute as vi.Mock).mockReturnValue({ path: '/not-matching' }) // Mock inactive route

    const link = {
      path: '/test',
      icon: 'icon-default',
      iconFilled: 'icon-active',
      title: 'Test'
    }
    const wrapper = navigationBarLinkFactory(link)

    expect(wrapper.findComponent({ name: 'icon-default' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'icon-active' }).exists()).toBe(false)
  })
})
