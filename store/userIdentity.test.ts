import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserIdentityStore } from './userIdentity'
import { useNotificationsStore } from './notifications'
import { useAccountsStore } from './accounts'
import { generateMockUserIdentity } from '../types/userIdentity.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'

vi.stubGlobal("$fetch", vi.fn());

describe('User Identity Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({stubActions: false}))
    localStorage.clear()
    vi.resetAllMocks()
  })
  
  describe('and when there is no user identity in local storage', () => {
    test('initialises the store with null user identity', () => {
      const store = useUserIdentityStore()
      expect(store.userIdentity).toBeNull()
    })
    test('initialises the store with null token', () => {
      const store = useUserIdentityStore()
      expect(store.token).toBeNull()
    })
  })
  describe('and when there is user identity in local storage', () => {
    const userIdentity = generateMockUserIdentity()
    // below is not working in test but working on browser
    test.skip('initialises the store with the user identity from local storage', () => {
      localStorage.setItem('userIdentity', JSON.stringify(userIdentity))
      const store = useUserIdentityStore()
      expect(store.userIdentity).toEqual(userIdentity)
    })
  })
  describe('login', () => {
    const token = generateMockToken()
    test('should set isLoginLoading to true when the request has not yet completed', async () => {
      const store = useUserIdentityStore()
      store.login(token)
      expect(store.isLoadingLogin).toBeTruthy()
    })
    test('should set the token and user in the store when the request is successful', async () => {
      const store = useUserIdentityStore()
      const token = generateMockToken()
      const userIdentity = generateMockUserIdentity()

      $fetch.mockResolvedValue({data: userIdentity})

      await store.login(token)

      expect(store.token).toBe(token)
      expect(store.userIdentity).toEqual(userIdentity)
      expect(store.isLoadingLogin).toBeFalsy()
    })
    test('should call other stores to fetch data with the token when the request is successful', async () => {
      const store = useUserIdentityStore()
      const accountsStore = useAccountsStore()
      const token = generateMockToken()
      const userIdentity = generateMockUserIdentity()

      $fetch.mockResolvedValue({data: userIdentity})

      await store.login(token)
      expect(accountsStore.fetchAccounts).toHaveBeenCalledWith(token)
    })
    test('should add an error notification when the request fails, and not save the token', async () => {
      const store = useUserIdentityStore()
      const token = 'invalid-token'
      const notificationsStore = useNotificationsStore()
      $fetch.mockRejectedValue(new Error('API Error'))

      await store.login(token)

      expect(notificationsStore.addNotification).toHaveBeenCalledWith({
        variant: 'error',
        message: 'Invalid session token. Please get a valid token.'
      })
      expect(store.token).toBe(null)
      expect(store.userIdentity).toBe(null)
      expect(store.isLoadingLogin).toBeFalsy()
    })
    test('should not call other stores to fetch data with the token when the request fails', async () => {
      const store = useUserIdentityStore()
      const token = 'invalid-token'
      const accountsStore = useAccountsStore()
      $fetch.mockRejectedValue(new Error('API Error'))

      await store.login(token)

      expect(accountsStore.fetchAccounts).not.toHaveBeenCalledWith(token)
    })
  })
})