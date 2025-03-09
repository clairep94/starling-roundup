import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '../types/account.type'
import type { Token } from '../types/auth.type'
import { useStorage } from '@vueuse/core'
import { useNotificationsStore } from './notifications'

type accountResponse = {
  data: { accounts: Account[] },
  request: any //debugging purposes only
}

/**
 * Accounts store
 * Holds the accounts in browser local storage
 */
export const useAccountsStore = defineStore('accounts', () => {
  const accounts = useStorage<Account[]>('accounts', [])
  const selectedAccountIndex = ref<number>(0)
  const isLoadingAccounts = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  
  /**
   * Get the currently selected account
   */
  const selectedAccount = computed<Account | null>(() => {
    return accounts.value.length ? 
      accounts.value[selectedAccountIndex.value] : null
  })

  /**
   * Set a new list of accounts in the store & local storage
   * @param newAccounts new list of accounts to set
   */
  function setAccounts(newAccounts: Account[]) {
    accounts.value = newAccounts
  } 

  /**
   * Fetch the accounts associated with the signed in user
   * @param token sandbox user token to attempt the request
   * @endpoint GET /api/starling/accounts
   */
  async function fetchAccounts(token: Token): Promise<void> {
    isLoadingAccounts.value = true

    try {
      const response = await $fetch<accountResponse>('/api/starling/accounts', {
        method: 'GET',
        headers: {
          'session-token': token,
        }
      })
      setAccounts(response.data.accounts) 
    } catch (error) {
      notificationsStore.addNotification({
        variant: "error",
        message: `Error fetching accounts: ${error}`
      })
    } finally {
      isLoadingAccounts.value = false
    }
  }

  /**
   * Reset the selected account to the first account in the list
   */
  function resetSelectedAccount() {
    selectedAccountIndex.value = 0
  }

  /**
   * Switch to a different account in the list
   * @param index index of the account to switch to
   */
  function switchAccount(index: number) {
    if (index < accounts.value.length) {
      selectedAccountIndex.value = index
    } else {
      resetSelectedAccount()
      throw new Error("Index out of bounds")
    }
  }

  /**
   * Clear the accounts from the store & local storage
   */
  function clearAccounts() {
    accounts.value = []
  }

  return { 
    accounts, 
    selectedAccount, 
    setAccounts, 
    resetSelectedAccount, 
    switchAccount, 
    clearAccounts, 
    fetchAccounts,
    isLoadingAccounts 
  }
})
