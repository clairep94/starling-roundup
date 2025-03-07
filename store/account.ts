import {ref, computed} from 'vue'
import { defineStore } from 'pinia'
import type { userAccount, userAccountList } from '~/types/userAccount.type'
import { useStorage } from '@vueuse/core'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<userAccountList>([])

  const defaultAccount = computed(() => {
    return accounts.value.length? accounts.value[0] : null
  })

  function setAccounts(newAccounts: userAccountList) {
    accounts.value = newAccounts
  } 
  function clearAccounts() {
    accounts.value = []
  }
  return { accounts, defaultAccount, setAccounts, clearAccounts }
})