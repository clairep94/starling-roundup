import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTransactionFeedStore } from './transactionFeed'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { generateMockBalance } from '../types/balance.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'
import { generateOfetchError } from '../types/responseError.type'
import { faker } from '@faker-js/faker'

vi.stubGlobal("$fetch", vi.fn())
const minTransactionTimestamp = faker.date.past().toISOString()
const maxTransactionTimestamp = faker.date.recent().toISOString()

describe('Transaction Feed Store', () => {
    let store: ReturnType<typeof useTransactionFeedStore>
    let notificationsStore: ReturnType<typeof useNotificationsStore> 
    let userIdentityStore: ReturnType<typeof useUserIdentityStore>
    let accountsStore: ReturnType<typeof useAccountsStore>
  

  beforeEach(() => {
    setActivePinia(createTestingPinia({stubActions: false}))
    vi.resetAllMocks()

    store = useTransactionFeedStore()
    notificationsStore = useNotificationsStore();
    userIdentityStore = useUserIdentityStore();
    accountsStore = useAccountsStore();
  })

  describe('initialisation', () => {
    test('should initialise with an empty transaction feed array', () => {
      expect(store.transactionFeed).toEqual([])
    })
    test('should initialise with isLoadingTransactions set to false', () => {
      expect(store.isLoadingTransactionFeed).toBeFalsy()
    })
  })

  describe('fetchTransactionFeed', () => {
    const setupValidAuthentication = () => {
      accountsStore.accounts = [generateMockAccount()];
      userIdentityStore.token = generateMockToken();
    };

    test('should not fetch transactions if selected account or token is missing', async() => {
      await store.fetchTransactionFeed(minTransactionTimestamp, maxTransactionTimestamp)

      expect(notificationsStore.addError).toHaveBeenCalledWith(
        'Cannot fetch transactions without an account or token'
      )
      expect($fetch).not.toHaveBeenCalled()
    })

    test('should set isLoadingTransactions to true when fetching transactions', () => {
      setupValidAuthentication()
      store.fetchTransactionFeed(minTransactionTimestamp, maxTransactionTimestamp)
      expect(store.isLoadingTransactionFeed).toBeTruthy()
    })

    test('should call the correct endpoint & headers using the minTransactionTimestamp and maxTransactionTimestamp', () => {
      setupValidAuthentication()
      const { accountUid, defaultCategory } = accountsStore.selectedAccount;
      const token = userIdentityStore.token;

      store.fetchTransactionFeed(minTransactionTimestamp, maxTransactionTimestamp)
      expect($fetch).toHaveBeenCalledWith(
        `/api/starling/feed/account/${accountUid}/category/${defaultCategory}/transactions-between?minTransactionTimestamp=${minTransactionTimestamp}&maxTransactionTimestamp=${maxTransactionTimestamp}`,
        {
          "headers": {
            "session-token": token
          },
          "method": "GET"
        }
      )
    })

    test('should add an error notification when the request fails', async()=> {
      setupValidAuthentication();
      const { accountUid, defaultCategory } = accountsStore.selectedAccount;
      const token = userIdentityStore.token;

      const error = generateOfetchError(
        'GET', 
        `/api/starling/feed/account/${accountUid}/category/${defaultCategory}/transactions-between?minTransactionTimestamp=${minTransactionTimestamp}&maxTransactionTimestamp=${maxTransactionTimestamp}`,
        403,
        'Forbidden'
      )
      $fetch.mockRejectedValue(error);
      await store.fetchTransactionFeed(minTransactionTimestamp, maxTransactionTimestamp)
      expect(notificationsStore.addError).toHaveBeenCalledWith(error)
    })
  })
})