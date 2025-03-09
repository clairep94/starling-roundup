import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// import { useUserStore } from './store/user'
import App from './app.vue'

const navigateTo = vi.fn()
vi.stubGlobal('navigateTo', navigateTo)

describe.skip('App.vue', () => {
  let wrapper: VueWrapper<any>
  let userStore: ReturnType<typeof useUserStore>

  const mountApp = (initialState = {}) => {
    return shallowMount(App, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
            initialState: {
              user: { token: null, ...initialState }, //override the default state
            },
          }),
        ],
        stubs: {
          Notifications: true,
          NuxtLayout: true,
        },
      },
    })
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders and contains expected components', () => {
    wrapper = mountApp()
    expect(wrapper.findComponent({ name: 'Notifications' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NuxtLayout' }).exists()).toBe(true)
  })

  it('navigates to the login page when there is no token', async () => {
    wrapper = mountApp({ token: null })
    await wrapper.vm.$nextTick()

    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('does not navigate to the login page when there is a token', async () => {
    wrapper = mountApp({ token: 'valid-token' })
    await wrapper.vm.$nextTick()

    expect(navigateTo).not.toHaveBeenCalled()
  })
})
