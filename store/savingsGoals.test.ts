import { describe, beforeEach, test, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSavingsGoalsStore } from './savingsGoals'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { generateMockAccount } from '../types/account.type'
import { createTestingPinia } from '@pinia/testing'
import { generateMockToken } from '../types/auth.type'
import { generateOfetchError } from '../types/responseError.type'
import { faker } from '@faker-js/faker'
import { generateMockSavingsGoal } from '../types/savingsGoal.type'

vi.stubGlobal("$fetch", vi.fn())

describe('Savings Goal Store', () => {
  let store: ReturnType<typeof useSavingsGoalsStore>
  let notificationsStore: ReturnType<typeof useNotificationsStore> 
  let userIdentityStore: ReturnType<typeof useUserIdentityStore>
  let accountsStore: ReturnType<typeof useAccountsStore>

  beforeEach(() => {
    setActivePinia(createTestingPinia({stubActions: false}))
    vi.resetAllMocks()

    store = useSavingsGoalsStore()
    notificationsStore = useNotificationsStore();
    userIdentityStore = useUserIdentityStore();
    accountsStore = useAccountsStore();
  })

  describe('initialisation', () => {
    test('should initialise with an empty savings goals array', () => {
      expect(store.savingsGoals).toEqual([])
    })
    test('should initialise with isLoadingSavingsGoals to false', () => {
      expect(store.isLoadingSavingsGoals).toEqual(false)
    })
    test('should initialise with isLoadingCreateSavingsGoal to false', () => {
      expect(store.isLoadingCreateSavingsGoal).toEqual(false)
    })
    test('should initialise with isLoadingTransferToSavingsGoal to false', () => {
      expect(store.isLoadingTransferToSavingsGoal).toEqual(false)
    })
  })

  const setupValidAuthentication = () => {
    accountsStore.accounts = [generateMockAccount()];
    userIdentityStore.token = generateMockToken();
  };

  describe('fetchSavingsGoals', () => {
    describe('and when selected account or token are missing', async () => {
      beforeEach(async () => {
        await store.fetchSavingsGoals()
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot fetch savings goal without an account or token'
        )
      })
    })

    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })

      test('should set isLoadingSavingsGoals to true when fetching savings goals', () => {
        store.fetchSavingsGoals()        
        expect(store.isLoadingSavingsGoals).toBe(true)
      })
      test('should not set the other loading refs when fetching savings goals', () => {
        store.fetchSavingsGoals()        
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
        expect(store.isLoadingTransferToSavingsGoal).toBe(false)
      })
      test('should call the correct endpoint and headers', () => {
        const { accountUid } = accountsStore.selectedAccount;
        const token = userIdentityStore.token;
  
        store.fetchSavingsGoals()
        expect($fetch).toHaveBeenCalledWith(
          `/api/starling/account/${accountUid}/savings-goals`,
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
          `/api/starling/account/${accountUid}/savings-goals`,
          403,
          'Forbidden'
        )
        $fetch.mockRejectedValue(error)
        await store.fetchSavingsGoals()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should not update the savings goals', () => {
        expect(store.savingsGoals).toEqual([])
      })
    })

    describe('and when the request is successful', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = {
          savingsGoalList: [
          generateMockSavingsGoal({ name: 'first space' }),
          generateMockSavingsGoal({ name: 'second space' }),
          generateMockSavingsGoal({ name: 'third space' }),
        ]}
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        const result = await store.fetchSavingsGoals()
        console.log(result)
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should update the savings goals', () => {
        expect(store.savingsGoals).toEqual(mockResult.savingsGoalList)
      })
    })
  })
})