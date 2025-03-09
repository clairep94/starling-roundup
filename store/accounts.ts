import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account, Token } from '../types/account.type'
import { useStorage } from '@vueuse/core'

type accountResponse = {
  data: { accounts: Account[] },
  request: any //debugging purposes only
}

/**
 * Accounts store
 * Holds the accounts in browser local storage
 */
export const useAccountsStore = defineStore('accounts', () => {
  /**
   * List of accounts associated with the signed in user
   */
  const accounts = useStorage<Account[]>('accounts', [])
  /**
   * Index of the currently selected account in the list
   */ 
  const selectedAccountIndex = ref<number>(0)

  const isLoadingAccounts = ref<boolean>(false)
  
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
   * Successful fetch means that the token is valid
   * @param token sandbox user token to attempt the request
   * @returns 
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
      throw new Error("Invalid session token. Please get a valid token.")
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

  return { accounts, selectedAccount, setAccounts, resetSelectedAccount, switchAccount, clearAccounts, fetchAccounts }
})
