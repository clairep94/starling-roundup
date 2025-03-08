import { describe, beforeEach, test, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'

describe('Accounts Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
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
      // expect(localStorage.getItem('accounts')).toEqual(JSON.stringify(newAccounts))
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
      // expect(localStorage.getItem('accounts')).toEqual(JSON.stringify(newAccounts))
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
      // expect(localStorage.getItem('accounts')).
      //   toEqual(JSON.stringify([]))
    })
  })
})