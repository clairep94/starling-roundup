import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useUserIdentityStore } from '../store/userIdentity'
import LoginForm from '../components/LoginForm.vue'
import { generateMockToken } from '../types/auth.type'

function loginFormFactory(): VueWrapper<any> {
  return shallowMount(LoginForm, {
    global: {
      plugins: [createTestingPinia()]
    },
  })
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the right title', () => {
    const wrapper = loginFormFactory()
    expect(wrapper.find('[data-test="login-form-title"]').text()).toBe('Log in to Online Banking Roundup')
  })
  it('should render the right button', () => {
    const wrapper = loginFormFactory()
    expect(wrapper.find('button').text()).toBe('Log in with sandbox user')
  })
  it('should render a form field for the session token', () => {
    const wrapper = loginFormFactory()
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('session-token')
    expect(input.attributes('placeholder')).toBe('Enter your Session Token')
    const label = wrapper.find('label')
    expect(label.attributes('for')).toBe('session-token')
    expect(label.text()).toBe('Session Token')
  })
  it('should attempt to log in the user when clicked', async() => {
    const wrapper = loginFormFactory()
    const userIdentityStore = useUserIdentityStore()
    const token = generateMockToken()
    await wrapper.find('input').setValue('#session-token', token)
    await wrapper.find('form').trigger('submit')
    expect(userIdentityStore.login).toHaveBeenCalled()
  })

  it('should show an error message when showErrorMessage is true', async () => {
    const wrapper = loginFormFactory()
    wrapper.vm.showErrorMessage = true
    await wrapper.vm.$nextTick()
    console.log(wrapper.html())
    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
  })

  it('should disabled the button when loading login', async () => {
    const wrapper = loginFormFactory()
    const userIdentityStore = useUserIdentityStore()
    userIdentityStore.isLoadingLogin = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})