import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSpendingInsightsStore } from './spendingInsights'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'
import { generateOfetchError } from '../types/responseError.type'
import { generateMockSpendingCategorySummary } from '../types/spendingInsights.type'

vi.stubGlobal("$fetch", vi.fn())

describe('Spending Insights Store', () => {
  let store: ReturnType<typeof useSpendingInsightsStore>
  let notificationsStore: ReturnType<typeof useNotificationsStore> 
  let userIdentityStore: ReturnType<typeof useUserIdentityStore>
  let accountsStore: ReturnType<typeof useAccountsStore>
  const mockDate = new Date('2025-02-20T12:00:00Z')

  beforeEach(() => {
      setActivePinia(createTestingPinia({stubActions: false}))
      vi.resetAllMocks()
      vi.useFakeTimers()
      vi.setSystemTime(mockDate)
  
      store = useSpendingInsightsStore()
      notificationsStore = useNotificationsStore();
      userIdentityStore = useUserIdentityStore();
      accountsStore = useAccountsStore();
      resetStoreAndAuthentication()
    })
  afterEach(() => {
    vi.useRealTimers()
  })
  
  const setupValidAuthentication = () => {
    accountsStore.accounts = [generateMockAccount()];
    userIdentityStore.token = generateMockToken();
  };

  const resetStoreAndAuthentication = () => {
    store.spendingInsightsSummaryByCategory = undefined
    userIdentityStore.logout()
  }

  describe('initialisation', () => {
    test('should initialise with empty spending insights by cat', () => {
      expect(store.spendingInsightsSummaryByCategory).toEqual(undefined)
    })
    test('should initialise with is spending by category loading to be false', () => {
      expect(store.isLoadingSpendingInsightsByCategory).toBe(false)
    })
  })

  describe('fetchSpendingInsightsByCategory', () => {
    describe('and when selected account or token are missing', async () => {
      beforeEach(async () => {
        await store.fetchSpendingInsightsByCategory()
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot fetch spending insights without an account or token'
        )
      })
    })
    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })

      test('should set isLoadingSpendingInsightsByCategory to true when fetching savings goals', () => {
        store.fetchSpendingInsightsByCategory()     
        expect(store.isLoadingSpendingInsightsByCategory).toBe(true)
      })
      test('should call the correct endpoint and headers', () => {
        const { accountUid } = accountsStore.selectedAccount;
        const token = userIdentityStore.token;
  
        store.fetchSpendingInsightsByCategory()     
        expect($fetch).toHaveBeenCalledWith(
          `/api/starling/accounts/${accountUid}/spending-insights/spending-category?year=2025&month=FEBRUARY`,
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
      let accountUid, error

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid  = accountsStore.selectedAccount?.accountUid;
        error = generateOfetchError(
          'GET', 
          `/api/starling/accounts/${accountUid}/spending-insights/spending-category?year=2025&month=FEBRUARY`,
          403,
          'Forbidden'
        )
        $fetch.mockRejectedValue(error)
        await store.fetchSpendingInsightsByCategory()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should not update the spending insights summary by cat', () => {
        expect(store.spendingInsightsSummaryByCategory).toBe(undefined)
      })
      test('should set the loading ref to false', () => {
        expect(store.isLoadingSpendingInsightsByCategory).toBe(false)
      })
    })

    describe('and when the request is successful', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = generateMockSpendingCategorySummary()
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        await store.fetchSpendingInsightsByCategory()
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should update the spending insights summary by category', () => {
        expect(store.spendingInsightsSummaryByCategory).toEqual(mockResult)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingSpendingInsightsByCategory).toBe(false)
      })
    })
  })
})