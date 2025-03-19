import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SavingsGoal, SavingsGoals } from '../types/savingsGoal.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import type { CurrencyAndAmount } from '../types/currencyAndAmount.type'

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

/**
 * Savings Goals store
 */
export const useSavingsGoalsStore = defineStore('savingsGoals', () => {
  const savingsGoals = ref<SavingsGoal[]>([])
  const isLoadingSavingsGoals = ref<boolean>(false)
  const isLoadingCreateSavingsGoals = ref<boolean>(false)
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
    async function createSavingsGoal(requestBody:{
      name: string,
      currency: string,
      target: CurrencyAndAmount,
      base64EncodedPhoto: string
    }): Promise<boolean> {
      if (!accountsStore.selectedAccount || !userIdentityStore.token) {
        notificationsStore.addError('Cannot create savings goal without an account or token')
        return false
      }

      isLoadingCreateSavingsGoals.value = true
  
      const proxyBaseURL = '/api/starling'
      const endpoint = `/account/${accountsStore.selectedAccount.accountUid}/savings-goals`
      let url = proxyBaseURL + endpoint
  
      try {
        console.log('store receieved request body:', requestBody)
        const response = await $fetch<savingsGoalCreateResponse>(url, {
          method: 'PUT',
          headers: {
            'session-token': userIdentityStore.token
          },
          body: requestBody
        })
        isLoadingSavingsGoals.value = false
        return response.data.success

      } catch (error: OfetchError) {
        notificationsStore.addError(error)
        isLoadingSavingsGoals.value = false
        return false

      } finally {
        isLoadingSavingsGoals.value = false
      }
    }
  
  return {
    isLoadingSavingsGoals,
    savingsGoals,
    fetchSavingsGoals,
    isLoadingCreateSavingsGoals,
    createSavingsGoal
  }
})