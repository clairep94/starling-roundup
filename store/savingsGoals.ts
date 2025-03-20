import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SavingsGoal, SavingsGoals, SavingsGoalRequest, TopUpRequest } from '../types/savingsGoal.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import { v4 as uuidv4 } from 'uuid';

type savingsGoalsResponse = {
  data: { savingsGoalList: SavingsGoal[] },
  request: any //debugging purposes only
}

type savingsGoalCreateResponse = {
  data: {
    savingsGoalUid: string,
    success: boolean
  },
  request: any //debugging purposes only
}

type savingsGoalTransferResponse = {
  data:{
    transferUid: string,
    success: boolean
  },
  request: any //debugging purposes only
}

/**
 * Savings Goals store
 */
export const useSavingsGoalsStore = defineStore('savingsGoals', () => {
  const savingsGoals = ref<SavingsGoal[]>([])
  const isLoadingSavingsGoals = ref<boolean>(false) //fetchSavingsGoal
  const isLoadingCreateSavingsGoal = ref<boolean>(false) //createSavingsGoal
  const isLoadingTransferToSavingsGoal = ref<boolean>(false) //transferToSavingsGoal

  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()

  /**
   * Fetch the savings goals for a selected account
   * @endpoint GET /api/starling/account/{accountUid}/savings-goals
   */
  async function fetchSavingsGoals(): Promise<void> {
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      notificationsStore.addError('Cannot fetch savings goal without an account or token')
      return
    }
    isLoadingSavingsGoals.value = true

    const proxyBaseURL = '/api/starling'
    const endpoint = `/account/${accountsStore.selectedAccount.accountUid}/savings-goals`
    let url = proxyBaseURL + endpoint

    try {
      const response = await $fetch<savingsGoalsResponse>(url, {
        method: 'GET',
        headers: {
          'session-token': userIdentityStore.token
        }
      })
      savingsGoals.value = response.data.savingsGoalList
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
    } finally {
      isLoadingSavingsGoals.value = false
    }
  }

  /**
   * Create a new savings goals for a selected account
   * @endpoint PUT /api/starling/account/{accountUid}/savings-goals
   */
    async function createSavingsGoal(requestBody: SavingsGoalRequest): Promise<boolean> {
      if (!accountsStore.selectedAccount || !userIdentityStore.token) {
        notificationsStore.addError('Cannot create savings goal without an account or token')
        return false
      }

      isLoadingCreateSavingsGoal.value = true
  
      const proxyBaseURL = '/api/starling'
      const endpoint = `/account/${accountsStore.selectedAccount.accountUid}/savings-goals`
      let url = proxyBaseURL + endpoint
  
      try {
        const response = await $fetch<savingsGoalCreateResponse>(url, {
          method: 'PUT',
          headers: {
            'session-token': userIdentityStore.token
          },
          body: requestBody
        })
        return response.data.success // TODO: error handling if success if false

      } catch (error: OfetchError) {
        notificationsStore.addError(error)
        return false

      } finally {
        isLoadingCreateSavingsGoal.value = false
      }
    }

  /**
   * Transfer funds into a savings goal for a selected account
   * @endpoint PUT /api/starling/account/{accountUid}/savings-goals/{savingsGoalUid}/add-money/{transferUid}
   */
    async function transferToSavingsGoal(savingsGoalUid:string, requestBody: TopUpRequest): Promise<boolean>{
      if (!accountsStore.selectedAccount || !userIdentityStore.token) {
        notificationsStore.addError('Cannot top up savings goal without an account or token')
        return false
      }

      isLoadingTransferToSavingsGoal.value = true

      const transferUid = uuidv4()
      const proxyBaseURL = '/api/starling'
      let endpoint = `/account/${accountsStore.selectedAccount.accountUid}/savings-goals`
      endpoint += `/${savingsGoalUid}/add-money/${transferUid}`
      let url = proxyBaseURL + endpoint

      try {
        const response = await $fetch<savingsGoalTransferResponse>(url, {
          method: 'PUT',
          headers: {
            'session-token': userIdentityStore.token
          },
          body: requestBody
        })
        return response.data.success // TODO: error handling if success if false

      } catch (error: OfetchError) {
        notificationsStore.addError(error)
        return false

      } finally {
        isLoadingTransferToSavingsGoal.value = false
      }
    }
  
  return {
    isLoadingSavingsGoals,
    savingsGoals,
    fetchSavingsGoals,
    isLoadingCreateSavingsGoal,
    createSavingsGoal,
    isLoadingTransferToSavingsGoal,
    transferToSavingsGoal
  }
})