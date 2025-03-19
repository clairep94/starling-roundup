import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SavingsGoal, SavingsGoals } from '../types/savingsGoal.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'

type savingsGoalsResponse = {
  data: { savingsGoalList: SavingsGoal[] },
  request: any //debugging purposes only
}

/**
 * Savings Goals store
 */
export const useSavingsGoalsStore = defineStore('savingsGoals', () => {
  const savingsGoals = ref<SavingsGoal[]>([])
  const isLoadingSavingsGoals = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()

  /**
   * Fetch the savings goals for a selected account
   * @endpoint GET /api/starling/account/{accountUid}/savings-goals
   */
  async function fetchSavingsGoals(): Promise<void> {
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      notificationsStore.addError('Cannot fetch transactions without an account or token')
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
  
  return {
    isLoadingSavingsGoals,
    savingsGoals,
    fetchSavingsGoals
  }
})