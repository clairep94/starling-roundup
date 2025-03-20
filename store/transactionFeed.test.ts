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
import { generateFeedItem } from '../types/feedItem.type'

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

  async function performFetchTransactions(){
    await store.fetchTransactionFeed(minTransactionTimestamp, maxTransactionTimestamp)
  }
  const setupValidAuthentication = () => {
    accountsStore.accounts = [generateMockAccount()];
    userIdentityStore.token = generateMockToken();
  };

  describe('initialisation', () => {
    test('should initialise with an empty transaction feed array', () => {
      expect(store.transactionFeed).toEqual([])
    })
    test('should initialise with isLoadingTransactions set to false', () => {
      expect(store.isLoadingTransactionFeed).toBeFalsy()
    })
  })

  describe('fetchTransactionFeed', () => {
    describe('and when selected account or token are missing', async () => {
      beforeEach(async () => {
        await performFetchTransactions()
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot fetch transactions without an account or token'
        )
      })
    })

    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })
      test('should set isLoadingTransactions to true when fetching transactions', () => {
        performFetchTransactions()
        expect(store.isLoadingTransactionFeed).toBeTruthy()
      })
      test('should call the correct endpoint & headers using the minTransactionTimestamp and maxTransactionTimestamp', () => {
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
    })

    describe('and when the request fails', async () => {
      let accountUid, defaultCategory, error
      beforeEach(async () => {
        setupValidAuthentication()
        accountUid  = accountsStore.selectedAccount?.accountUid;
        defaultCategory = accountsStore.selectedAccount?.defaultCategory
        error = generateOfetchError(
          'GET', 
          `/api/starling/feed/account/${accountUid}/category/${defaultCategory}/transactions-between?minTransactionTimestamp=${minTransactionTimestamp}&maxTransactionTimestamp=${maxTransactionTimestamp}`,
          403,
          'Forbidden'
        )
        $fetch.mockRejectedValue(error)
        await performFetchTransactions()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should not update the savings goals', () => {
        expect(store.transactionFeed).toEqual([])
      })
      test('should set the loading ref to false', () => {
        expect(store.isLoadingTransactionFeed).toBe(false)
      })
    })

    describe('and when the request is successful', async () => {
      let accountUid, defaultCategory, mockResult
      beforeEach(async () => {
        setupValidAuthentication()
        accountUid  = accountsStore.selectedAccount?.accountUid;
        defaultCategory = accountsStore.selectedAccount?.defaultCategory
        mockResult = {
          feedItems: [
          generateFeedItem(),
          generateFeedItem(),
          generateFeedItem()
        ]}
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        await performFetchTransactions()
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should update the transaction feed list', () => {
        expect(store.transactionFeed).toEqual(mockResult.feedItems)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingTransactionFeed).toBe(false)
      })
    })


  })
})