import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import App from './app.vue'

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = shallowMount(App)
    console.log(wrapper.html())
    expect(wrapper.exists()).toBe(true)
  })
})