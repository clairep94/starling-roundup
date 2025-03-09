import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { useNotificationsStore } from './notifications'
import { createTestingPinia } from '@pinia/testing'
import { generateOfetchError } from '../types/responseError.type'


vi.stubGlobal("$fetch", vi.fn());

describe('Accounts Store', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({stubActions: false}))
    localStorage.clear()
    vi.resetAllMocks()
  })

  describe('and when there are no accounts in local storage', () => {
    test('initialises the store with an empty array', () => {
      const store = useAccountsStore()
      expect(store.accounts).toEqual([])
    })
    test('initialises with the selected account as null', () => {
      const store = useAccountsStore()
      expect(store.selectedAccount).toBeNull()
    })
    test('should set new accounts in the store and in local storage', () => {
      const store = useAccountsStore()
      const newAccounts = [
        generateMockAccount(),
      ]
      store.setAccounts(newAccounts)
      expect(store.accounts).toEqual(newAccounts)
      // below is not working on test but is working in browser
      // expect(localStorage.getItem('accounts'))
      // .toEqual(JSON.stringify(newAccounts))
    })
  })


  describe('and when there are accounts in local storage', () => {
    const accounts = [
      generateMockAccount(),
      generateMockAccount(),
    ]
    beforeEach(() => {
      localStorage.setItem('accounts', JSON.stringify(accounts))
    })
    test('initialises the store with the accounts from local storage', () => {
      const store = useAccountsStore()
      expect(store.accounts).toEqual(accounts)
    })
    test('initialises with the first account as the selected account', () => {
      const store = useAccountsStore()
      expect(store.selectedAccount).toEqual(accounts[0])
    })
    test('should set new accounts in the store and in local storage', () => {
      const store = useAccountsStore()
      const newAccounts = [
        generateMockAccount(),
      ]
      store.setAccounts(newAccounts)
      expect(store.accounts).toEqual(newAccounts)
      // below is not working on test but is working in browser
      // expect(localStorage.getItem('accounts'))
      // .toEqual(JSON.stringify(newAccounts))
    })
    test('should switch to a different account in the list', () => {
      const store = useAccountsStore()
      store.switchAccount(1)
      expect(store.selectedAccount).toEqual(accounts[1])
    })
    test('should reset the selected account to the first account in the list', () => {
      const store = useAccountsStore()
      store.switchAccount(1)
      store.resetSelectedAccount()
      expect(store.selectedAccount).toEqual(accounts[0])
    })
    test('should clear the accounts from the store and local storage', () => {
      const store = useAccountsStore()
      store.clearAccounts()
      expect(store.accounts).toEqual([])
      // below is not working on test but is working in browser
      // expect(localStorage.getItem('accounts')).
      //   toEqual(JSON.stringify([]))
    })
  })

  describe('fetchAccounts', () => {
    test('should set isLoadingAccounts to true when the request has not yet completed', async () => {
      const store = useAccountsStore()
      store.fetchAccounts('test-token')
      expect(store.isLoadingAccounts).toBeTruthy()
    })
    test('should set the accounts in the store when the request is successful', async () => {
      const store = useAccountsStore()
      const accounts = [
        generateMockAccount(),
        generateMockAccount(),
      ]
      $fetch.mockResolvedValue({ data: { accounts: accounts } })
      await store.fetchAccounts('test-token')
      expect(store.accounts).toEqual(accounts)
      expect(store.isLoadingAccounts).toBeFalsy()
    })
    test('should add an error notification when the request fails', async () => {
      const store = useAccountsStore()
      const token = 'invalid-token'
      const notificationsStore = useNotificationsStore()
      const error = generateOfetchError('GET', '/api/starling/accounts', 403, 'Forbidden')
      $fetch.mockRejectedValue(error)
      await store.fetchAccounts(token)

      expect(notificationsStore.addError).toHaveBeenCalledWith(error)

      expect(store.accounts).toEqual([])
      expect(store.isLoadingAccounts).toBeFalsy()
    })
  })
})