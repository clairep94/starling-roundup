import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useAccountsStore } from '../store/accounts'
import { useUserIdentityStore } from '../store/userIdentity'
import { generateMockAccount } from '../types/account.type'
import { generateMockUserIdentity } from '../types/userIdentity.type'
import NavigationBarProfile from './NavigationBarProfile.vue'

function factory(): VueWrapper<any>{
  return shallowMount(NavigationBarProfile, {
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    }
  })
}

describe('NavigationBarProfile component', () => {
  let wrapper: VueWrapper<any>
  let userIdentityStore: ReturnType<typeof useUserIdentityStore>
  let accountsStore: ReturnType<typeof useAccountsStore>

  describe('and when the component mounts', () => {
    beforeEach(() => {
      wrapper = factory()
      userIdentityStore = useUserIdentityStore()
      accountsStore = useAccountsStore()
    })
    it('should display a user icon', () => {
      expect(wrapper.find('[data-test="user-icon-container"]').exists()).toBeTruthy()
    })
  })

  describe('and when either of the loading refs are true', ()=> {
    beforeEach(() => {
      wrapper = factory()
      userIdentityStore = useUserIdentityStore()
      accountsStore = useAccountsStore()
    })
    it('should only display the loading graphic', async () => {
      userIdentityStore.isLoadingLogin = true
      accountsStore.isLoadingAccounts = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()

      userIdentityStore.isLoadingLogin = false
      accountsStore.isLoadingAccounts = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()

      userIdentityStore.isLoadingLogin = true
      accountsStore.isLoadingAccounts = false
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()
    })
  })

  describe('and when either of the data refs are nullish', ()=> {
    beforeEach(() => {
      wrapper = factory()
      userIdentityStore = useUserIdentityStore()
      accountsStore = useAccountsStore()
    })
    it('should only display the no data graphic', async () => {
      userIdentityStore.userIdentity = {}
      accountsStore.accounts = []
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()

      userIdentityStore.userIdentity = generateMockUserIdentity()
      accountsStore.accounts = []
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()

      userIdentityStore.userIdentity = {}
      accountsStore.accounts = [generateMockAccount()]
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeFalsy()
    })
  })

  describe('and when there is valid accounts and userID data', () => {
    let mockAccounts, userIdentity
    beforeEach(() => {
      wrapper = factory()
      userIdentityStore = useUserIdentityStore()
      accountsStore = useAccountsStore()
      mockAccounts = [generateMockAccount()]
      userIdentity = generateMockUserIdentity()
      userIdentityStore.userIdentity = userIdentity
      accountsStore.accounts = mockAccounts
    })
    it('should only display the user name and account type', () => {
      expect(wrapper.find('[data-test="user-name-and-account-type"]').exists()).toBeTruthy()
      expect(wrapper.find('[data-test="user-and-account-no-data-found"]').exists()).toBeFalsy()
      expect(wrapper.find('[data-test="user-and-account-loading"]').exists()).toBeFalsy()
    })
    it('should display the users full name', () => {
      expect(wrapper.find('[data-test="user-full-name"]').text()).toBe(`${userIdentity.firstName} ${userIdentity.lastName}`)
    })
    it('should display the users selected account name', () => {
      expect(wrapper.find('[data-test="user-account-type"]').text()).toBe(mockAccounts[0].name)
    })
  })
})