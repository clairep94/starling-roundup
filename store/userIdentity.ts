import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserIdentity } from '../types/userIdentity.type'
import type { Token } from '../types/auth.type'
import type { OfetchError } from '../types/responseError.type'
import { useStorage } from '@vueuse/core'
import { useNotificationsStore } from './notifications'
import { useAccountsStore } from './accounts'

type userIdentityResponse = {
  data: UserIdentity
}

/**
 * User Identity store
 * Holds the user identity & token in browser local storage
 * Used to log in
 */
export const useUserIdentityStore = defineStore('userIdentity', () => {
  const userIdentity = useStorage<UserIdentity>('userIdentity', {})
  const token = useStorage<Token>('token', null)
  const isLoadingLogin = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const accountsStore = useAccountsStore()

  /**
   * Log in using the token
   * @param newToken token for the starling api sandbox user
   * @endpoint GET /api/starling/identity/individual
   */
  async function login(newToken: Token): Promise<boolean> {
    isLoadingLogin.value = true
    try {
      const response = await $fetch<userIdentityResponse>('/api/starling/identity/individual', {
        method: 'GET',
        headers: {
          'session-token': newToken,
        }
      })
      userIdentity.value = response.data
      token.value = newToken
      await accountsStore.fetchAccounts(newToken)
      return true
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
      return false
    } finally {
      isLoadingLogin.value = false
    }
  }

  /**
   * Removes the token and user identity from the store & calls the accounts store to clear accounts
   * For ease of manual testing, this function will not call the API to logout (api/v2/identity/logout), 
   * as this would require a new token every time we manually test the logout functionality
   */
  function logout() {
    userIdentity.value = {}
    token.value = null
    accountsStore.clearAccounts()
  }

  return {
    userIdentity,
    token,
    isLoadingLogin,
    login,
    logout,
  }
})