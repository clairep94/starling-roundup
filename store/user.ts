import {ref} from 'vue'
import { defineStore } from 'pinia'
import type { userAccountList } from '~/types/userAccount.type'
import type { userIdentity } from '~/types/userIdentity.type'
import { useAccountStore } from './account'
import { useNotificationsStore } from './notifications'
import { useStorage } from '@vueuse/core'

type userAccountResponse = {
  data: { accounts: userAccountList}
  request: any //debugging purposes only
}

type userIdentityResponse = {
  data: userIdentity
  request: any //debugging purposes only
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string|null>(null)
  const isLoggingIn = ref(false)
  const user = ref<userIdentity>()
  const notificationsStore = useNotificationsStore()

  const { setAccounts, clearAccounts } = useAccountStore()

  /**
   * Log in using the token
   * @param newToken token for the starling api sandbox user
   */
  async function login(newToken:string): Promise<boolean> {
    isLoggingIn.value = true

    try {
      const response = await $fetch<userAccountResponse>('/api/starling/accounts', {
        method: 'GET',
        headers: {
          'session-token': newToken,
        }
      })
      console.log(response)
      console.log("setting accounts")
      setAccounts(response.data.accounts)
      token.value = newToken
      return true // successfully logged in
    } catch (error) {
      notificationsStore.addNotification({
        variant: "error",
        message: "Invalid session token. Please get a valid token."
      })
      clearAccounts()
      token.value = null
      return false // failed to log in
    } finally {
      isLoggingIn.value = false
    }
  }

  /**
   * removes the token and accounts from the store
   */
  function logout() {
    clearAccounts()
    token.value = null
  }

  async function fetchUserDetails() {
    if (!token.value) return
    try {
      const response = await $fetch<userIdentityResponse>('/api/starling/identity/individual', {
        method: 'GET',
        headers: {
          'session-token': token.value,
        }
      })
      console.log("response",response)

      user.value = response.data
      console.log("user", user.value)
    } catch (error) {
      console.error(error)
      clearAccounts()
      token.value = null
    }
  }

  return { token, user, isLoggingIn, login, fetchUserDetails }
})