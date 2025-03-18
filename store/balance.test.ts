import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBalanceStore } from './balance'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { generateMockBalance } from '../types/balance.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'
import { generateOfetchError } from '../types/responseError.type'


vi.stubGlobal("$fetch", vi.fn());

describe('Balance Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({stubActions: false}))
    vi.resetAllMocks()
  })

  describe('initialisation', () => {
    test('should initialise with null balance', () => {
      const store = useBalanceStore()
      expect(store.balance).toBeNull()
    })

    test('should initialise with isLoadingBalance set to false', () => {
      const store = useBalanceStore()
      expect(store.isLoadingBalance).toBeFalsy()
    })
  })

  describe('fetchBalance', () => {
    test('should not fetch balance if selected account or token is missing', async () => {
      const store = useBalanceStore()
      const notificationsStore = useNotificationsStore()

      await store.fetchBalance()

      expect(notificationsStore.addError).toHaveBeenCalledWith('Cannot fetch balance without an account or token')
      expect($fetch).not.toHaveBeenCalled()
    })
    test('should set isLoadingBalance to true when fetching balance', () => {
      const store = useBalanceStore()
      const userIdentityStore = useUserIdentityStore()
      const accountsStore = useAccountsStore()

      const mockAccounts= [generateMockAccount()]
      const mockToken = generateMockToken()

      accountsStore.accounts = mockAccounts
      userIdentityStore.token = mockToken

      store.fetchBalance()
      expect($fetch).toHaveBeenCalled()

      expect(store.isLoadingBalance).toBeTruthy()
    })
    test('should set balance to the fetched balance', async () => {
      const store = useBalanceStore()
      const userIdentityStore = useUserIdentityStore()
      const accountsStore = useAccountsStore()
      const notificationsStore = useNotificationsStore()

      const mockAccounts= [generateMockAccount()]
      const mockToken = generateMockToken()

      accountsStore.accounts = mockAccounts
      userIdentityStore.token = mockToken

      const mockBalance = generateMockBalance()

      $fetch.mockResolvedValue({data: mockBalance})

      await store.fetchBalance()

      expect(store.balance).toEqual(mockBalance)
    })
  })
  test('should add an error notification when the request fails', async () => {
    const store = useBalanceStore()
    const userIdentityStore = useUserIdentityStore()
    const accountsStore = useAccountsStore()
    const notificationsStore = useNotificationsStore()

    const mockAccounts= [generateMockAccount()]
    const mockToken = generateMockToken()

    accountsStore.accounts = mockAccounts
    userIdentityStore.token = mockToken

    const error = generateOfetchError('GET', '/api/starling/account/1234/balance', 403, 'Forbidden')
    $fetch.mockRejectedValue(error)

    await store.fetchBalance()

    expect(notificationsStore.addError).toHaveBeenCalledWith(error)
  })
})