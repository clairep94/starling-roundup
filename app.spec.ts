import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './app.vue'

vi.mock('#build/components', () => ({
  NuxtLayout: {
    template: '<div><slot /></div>',
  },
  NuxtPage: {
    template: '<div>Nuxt Page</div>',
  },
}))

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})