import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useUserIdentityStore } from '../store/userIdentity'
import LogoutButton from '../components/LogoutButton.vue'

const mockLogout = vi.fn()

vi.mock('../store/userIdentity', () => ({
  useUserIdentityStore: vi.fn(() => ({
    logout: mockLogout,
  }))
}))

function logoutButtonFactory(): VueWrapper<any> {
  return shallowMount(LogoutButton, {
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    },
  })
}

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render a  button with the right text', () => {
    const wrapper = logoutButtonFactory()
    expect(wrapper.find('button').text()).toBe('Log out')
  })

  it('should log out the user when clicked', async () => {
    const wrapper = logoutButtonFactory()
    await wrapper.find('button').trigger('click')

    expect(mockLogout).toHaveBeenCalled()
  })
})