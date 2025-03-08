import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import App from './app.vue'

describe('App.vue', () => {
  it('renders and contains expected components', () => {
    const wrapper = shallowMount(App, {
      global: {
        stubs: {
          Notifications: true,
          NuxtLayout: true,
        },
      },
    })
    expect(wrapper.findComponent({ name: 'Notifications' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NuxtLayout' }).exists()).toBe(true)
  })
})
