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
import { generateMockSavingsGoal, generateMockSavingsGoalRequest, generateTopUpRequest } from '../types/savingsGoal.type'
import * as uuid from 'uuid';

vi.stubGlobal("$fetch", vi.fn())
vi.mock('uuid')

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
    resetStoreAndAuthentication()
  })

  const setupValidAuthentication = () => {
    accountsStore.accounts = [generateMockAccount()];
    userIdentityStore.token = generateMockToken();
  };

  const resetStoreAndAuthentication = () => {
    store.savingsGoals = []
    userIdentityStore.logout()
  }

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
      test('should set the loading ref to false', () => {
        expect(store.isLoadingSavingsGoals).toBe(false)
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
        await store.fetchSavingsGoals()
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should update the savings goals', () => {
        expect(store.savingsGoals).toEqual(mockResult.savingsGoalList)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingSavingsGoals).toBe(false)
      })
    })
  })

  describe('createSavingsGoal', () => {
    const savingsGoalRequest = generateMockSavingsGoalRequest({name: "fake savings goal"})
    const mockSavingsUuid = "some_savings_uuid"

    describe('and when selected account or token are missing', async () => {
      beforeEach(async () => {
        await store.createSavingsGoal(savingsGoalRequest)
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot create savings goal without an account or token'
        )
      })
    })

    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })

      test('should set isLoadingCreateSavingsGoal to true when creating savings goals', () => {
        store.createSavingsGoal(savingsGoalRequest)        
        expect(store.isLoadingCreateSavingsGoal).toBe(true)
      })
      test('should not set the other loading refs when creating savings goals', () => {
        store.createSavingsGoal(savingsGoalRequest)      
        expect(store.isLoadingSavingsGoals).toBe(false)
        expect(store.isLoadingTransferToSavingsGoal).toBe(false)
      })
      test('should call the correct endpoint and headers', () => {
        const { accountUid } = accountsStore.selectedAccount;
        const token = userIdentityStore.token;
  
        store.createSavingsGoal(savingsGoalRequest)
        expect($fetch).toHaveBeenCalledWith(
          `/api/starling/account/${accountUid}/savings-goals`,
          {
            "headers": {
              "session-token": token
            },
            "method": "PUT",
            "body": savingsGoalRequest
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
          'PUT', 
          `/api/starling/account/${accountUid}/savings-goals`,
          403,
          'Forbidden'
        )
        $fetch.mockRejectedValue(error)
        await store.createSavingsGoal()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should return false', () => {
        expect(store.createSavingsGoal).toHaveLastResolvedWith(false)
      })
      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })

    describe('and when the request is successful', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = {
          savingsGoalUid: mockSavingsUuid,
          success: true
        }
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        await store.createSavingsGoal(savingsGoalRequest)
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should return true', () => {
        expect(store.createSavingsGoal).toHaveLastResolvedWith(true)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })

    describe('and when the request is successful, but starling api returns a 200 response with success = false', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = {
          savingsGoalUid: mockSavingsUuid,
          success: false
        }
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        await store.createSavingsGoal(savingsGoalRequest)
      })


      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(`Unknown error for creating savings goal: ${mockSavingsUuid}`)
      })

      test('should return false', () => {
        expect(store.createSavingsGoal).toHaveLastResolvedWith(false)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })
  })

  describe('transferToSavingsGoal', () => {
    const transferRequestBody = generateTopUpRequest()
    const savingsGoalUuid = 'some_savings_goal_uuid'
    const mockTransferUid = 'mock-transfer-uuid';

    async function performTransfer(){
      await store.transferToSavingsGoal(savingsGoalUuid, transferRequestBody)
    }

    describe('and when selected account or token are missing', async () => {
      beforeEach(async () => {
        performTransfer()
      })
      test('should not fetch', () => {
        expect($fetch).not.toHaveBeenCalled()
      })
      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(
          'Cannot top up savings goal without an account or token'
        )
      })
    })

    describe('and while the request is in progress', () => {
      beforeEach(() => {
        setupValidAuthentication()
      })

      test('should set isLoadingTransferToSavingsGoal to true when transfering to a savings goal', () => {
        performTransfer()        
        expect(store.isLoadingTransferToSavingsGoal).toBe(true)
      })
      test('should not set the other loading refs when transfering to a savings goal', () => {
        performTransfer() 
        expect(store.isLoadingSavingsGoals).toBe(false)
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
      test('should call the correct endpoint and headers', () => {
        const { accountUid } = accountsStore.selectedAccount;
        const token = userIdentityStore.token;
        vi.spyOn(uuid, 'v4').mockReturnValue(mockTransferUid)
  
        performTransfer() 
        expect($fetch).toHaveBeenCalledWith(
          `/api/starling/account/${accountUid}/savings-goals/${savingsGoalUuid}/add-money/${mockTransferUid}`,
          {
            "headers": {
              "session-token": token
            },
            "method": "PUT",
            "body": transferRequestBody
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
          'PUT', 
          `/api/starling/account/${accountUid}/savings-goals/${savingsGoalUuid}/add-money/${mockTransferUid}`,
          403,
          'Forbidden'
        )
        $fetch.mockRejectedValue(error)
        await performTransfer()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(error)
      })
      test('should return false', () => {
        expect(store.transferToSavingsGoal).toHaveLastResolvedWith(false)
      })
      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })

    describe('and when the request is successful', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = {
          transferUid: mockTransferUid,
          success: true
        }
        $fetch.mockResolvedValue({
          status: 200,
          data: mockResult
        })
        await performTransfer()
      })

      test('should not add an error notification', () => {
        expect(notificationsStore.addError).not.toHaveBeenCalled()
      })

      test('should return true', () => {
        expect(store.transferToSavingsGoal).toHaveLastResolvedWith(true)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })

    describe('and when the request is successful, but starling api returns a 200 response with success = false', () => {
      let accountUid, mockResult

      beforeEach(async () => {
        setupValidAuthentication()
        accountUid = accountsStore.selectedAccount?.accountUid;
        mockResult = {
          transferUid: mockTransferUid,
          success: true
        }
        $fetch.mockResolvedValue({
          status: 200,
          data: {...mockResult, success: false}
        })
        await performTransfer()
      })

      test('should add an error notification', () => {
        expect(notificationsStore.addError).toHaveBeenCalledWith(`Unknown error for transfering savings goal: ${mockTransferUid}`)
      })

      test('should return false', () => {
        expect(store.transferToSavingsGoal).toHaveLastResolvedWith(false)
      })

      test('should set the loading ref to false', () => {
        expect(store.isLoadingCreateSavingsGoal).toBe(false)
      })
    })
  })
})