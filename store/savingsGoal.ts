import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CurrencyAndAmount } from '../types/feedItem.type'
import type { SavingsGoal, SavingsGoals } from '../types/savingsGoal.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'

type savingsGoalResponse = {
  data: SavingsGoals,
  request: any //debugging purposes only
}

export const useSavingsGoalStore = defineStore('savingsGoal', () => {
  const savingsGoals = ref<SavingsGoal[] | null>(null)
  const isLoadingSavingsGoals = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()
  
})