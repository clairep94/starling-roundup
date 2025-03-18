import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Balance } from '../types/balance.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'

type balanceResponse = {
  data: Balance,
  request: any //debugging purposes only
}

/**
 * Balance store
 * Holds the balance of the selected account
 */
export const useBalanceStore = defineStore('balance', () => {
  const balance = ref<Balance | null>(null)
  const isLoadingBalance = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()

  /**
   * Fetch the balance of the selected account
   * @endpoint GET /api/starling/account/{accountUid}/balance
   */
  async function fetchBalance(): Promise<void> {
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      notificationsStore.addError('Cannot fetch balance without an account or token')
      return
    }
    isLoadingBalance.value = true

    const proxyBaseURL = '/api/starling'
    const endpoint = `/accounts/${accountsStore.selectedAccount.accountUid}/balance`
    let url = proxyBaseURL + endpoint
    
    try {
      const response = await $fetch<balanceResponse>(url, {
        method: 'GET',
        headers: {
          'session-token': userIdentityStore.token,
        },
      })
      balance.value = response.data
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
    } finally {
      isLoadingBalance.value = false
    }
  }

  const effectiveBalance = computed(() => {
    if (!balance.value) {
      return null
    }
    return balance.value.effectiveBalance
  })

  return {
    balance,
    isLoadingBalance,
    effectiveBalance,
    fetchBalance
  }
})