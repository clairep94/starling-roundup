import {ref} from 'vue'
import { defineStore } from 'pinia'
import type { userAccount, userAccountList } from '~/types/userAccount.type'

export const useUserStore = defineStore('user', () => {
  const token = ref<string|null>(null)
  const userAccountList = ref<userAccountList|null>()
  const isLoggingIn = ref(false)

  // get default accountUuid
  // get default defaultCategory

  async function login(token:string) {
    isLoggingIn.value = true

    try {
      const response = await $fetch<userAccountList>('/api/starling/accounts', {
        method: 'GET',
        headers: {
          'session-token': token,
        }
      })
      console.log(response)
      // userAccountList.value = response
    } catch (error) {
      console.error(error) // change to toast
    } finally {
      isLoggingIn.value = false
    }
  }
  return { token, userAccountList, isLoggingIn, login }
})