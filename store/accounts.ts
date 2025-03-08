import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Account } from '../types/account.type'
import { useStorage } from '@vueuse/core'

/**
 * Accounts store
 * Holds the accounts in browser local storage
 */
export const useAccountsStore = defineStore('accounts', () => {
  /**
   * List of accounts associated with the signed in user
   */
  const accounts = useStorage<Account[]>('accounts', [])  
  const selectedAccountIndex = ref<number>(0)
  
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

  return { accounts, selectedAccount, setAccounts, resetSelectedAccount, switchAccount, clearAccounts }
})
