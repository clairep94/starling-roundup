import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useUserIdentityStore } from './store/userIdentity'
import App from './app.vue'

vi.mock('nuxt/app', () => ({
  navigateTo: vi.fn()
}))

function factory(initialState = {}) {
  return shallowMount(App, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            userIdentity: {
              token: null, // default to no token
              ...initialState
            }
          }
        })
      ],
      stubs: {
        NuxtLayout: true,
        Notifications: true
      }
    }
  })
}

describe('App.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders and contains expected components', () => {
    const wrapper = factory()
    expect(wrapper.findComponent({ name: 'Notifications' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NuxtLayout' }).exists()).toBe(true)
  })

  it('navigates to the login page when there is no token', async () => {
    const wrapper = factory()
    const { navigateTo } = await import('nuxt/app')

    await wrapper.vm.$nextTick()

    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('navigates to the login page when there is a token', async () => {
    const wrapper = factory({token: 'some_token'})
    const { navigateTo } = await import('nuxt/app')

    await wrapper.vm.$nextTick()
    
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
