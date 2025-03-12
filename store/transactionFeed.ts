import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FeedItem, FeedItems } from '../types/feedItem.type'
import type { OfetchError } from '../types/responseError.type'
import { useNotificationsStore } from './notifications'
import { useUserIdentityStore } from './userIdentity'
import { useAccountsStore } from './accounts'

type transactionFeedResponse = {
  data: FeedItems,
  request: any //debugging purposes only
}

/**
 * Transaction Feed store
 * Holds the transaction feed
 */
export const useTransactionFeedStore = defineStore('transactionFeed', () => {
  const transactionFeed = ref<FeedItem[]>([])
  const isLoadingTransactionFeed = ref<boolean>(false)
  const notificationsStore = useNotificationsStore()
  const userIdentityStore = useUserIdentityStore()
  const accountsStore = useAccountsStore()

  /**
   * Fetch the transaction feed for the selected account
   * @endpoint GET /api/starling/feed/account/{accountUid}/category/{categoryUid}/transactions-between
   * @param minTransactionTimestamp ISO string of the date to fetch changes since
   * @param maxTransactionTimestamp ISO string of the date to fetch changes until
   */
  async function fetchTransactionFeed(minTransactionTimestamp: string, maxTransactionTimestamp:string): Promise<void> {
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      return 
    }
    isLoadingTransactionFeed.value = true

    const proxyBaseURL = '/api/starling'
    const endpoint = `/feed/account/${accountsStore.selectedAccount.accountUid}/category/${accountsStore.selectedAccount.defaultCategory}/transactions-between`
    let url = proxyBaseURL + endpoint
    url += '?minTransactionTimestamp=' + minTransactionTimestamp
    url += '&maxTransactionTimestamp=' + maxTransactionTimestamp
    
    try {
      const response = await $fetch<transactionFeedResponse>(url, {
        method: 'GET',
        headers: {
          'session-token': userIdentityStore.token,
        },
      })
      transactionFeed.value = response.data.feedItems
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
    } finally {
      isLoadingTransactionFeed.value = false
    }
  }
  return {
    transactionFeed,
    isLoadingTransactionFeed,
    fetchTransactionFeed
  }
})