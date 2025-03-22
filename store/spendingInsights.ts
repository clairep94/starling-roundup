import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SpendingCategorySummary, SpendingCategoryBreakdown } from '../types/spendingInsights.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'
import type { OfetchError } from '../types/responseError.type'

type spendingInsightResponse = {
  data: SpendingCategorySummary,
  request: any //debugging purposes only
}

/**
 * Spending Insight store
 * Holds spending insights
 */
export const useSpendingInsightsStore = defineStore('spendingInsights', () => {
  const spendingInsightsSummaryByCategory = ref<SpendingCategorySummary>()
  const isLoadingSpendingInsightsByCategory = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()

  /**
   * Fetch the spending insights for the selected account
   * @endpoint GET /api/starling/accounts/{accountUid}/spending-insights/spending-category
   * @param summaryStartPeriodInclusive optional: ISO string of the date-time to fetch spending insights since
   * @param summaryEndPeriodExclusive optional: ISO string of the date-time to fetch spending insights till (exclusive)
   */
  async function fetchSpendingInsightsByCategory(dateTimeRange?:{ summaryStartPeriodInclusive:string, summaryEndPeriodExclusive:string }){
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      notificationsStore.addError('Cannot fetch spending insights without an account or token')
      return
    }
    isLoadingSpendingInsightsByCategory.value = true

    const proxyBaseURL = '/api/starling'
    const endpoint = `/accounts/${accountsStore.selectedAccount.accountUid}/spending-insights/spending-category`
    let url = proxyBaseURL + endpoint

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    
    url += `?year=${year}`
    url += `&month=${month}`

    if(dateTimeRange){
      url += `&summaryStartPeriodInclusive=${dateTimeRange.summaryStartPeriodInclusive}`
      url += `&summaryEndPeriodExclusive=${dateTimeRange.summaryEndPeriodExclusive}`
    }

    try {
      const response = await $fetch<spendingInsightResponse>(url, {
        method: 'GET',
        headers: {
          'session-token': userIdentityStore.token,
        }
      })
      spendingInsightsSummaryByCategory.value = response.data
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
    } finally {
      isLoadingSpendingInsightsByCategory.value = false
    }
  }

  return {
    spendingInsightsSummaryByCategory,
    isLoadingSpendingInsightsByCategory,
    fetchSpendingInsightsByCategory
  }
})