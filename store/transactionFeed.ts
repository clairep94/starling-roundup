import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FeedItem, FeedItems } from '../types/feedItem.type'
import type { Token } from '../types/auth.type'
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
   * @endpoint GET /api/starling/feed/account/{accountUid}/category/{categoryUid}
   * @param changesSinceDateIsoString ISO string of the date to fetch changes since
   * @returns true for successful fetch, false for failed fetch
   */
  async function fetchTransactionFeed(changesSinceDateIsoString: string): Promise<boolean> {
    if (!accountsStore.selectedAccount || !userIdentityStore.token) {
      return false
    }
    isLoadingTransactionFeed.value = true
    let url = `/api/starling/feed/account/${accountsStore.selectedAccount.accountUid}/category/${accountsStore.selectedAccount.defaultCategory}`
    console.log(url)
    try {
      const response = await $fetch<transactionFeedResponse>(url, {
        method: 'GET',
        headers: {
          'session-token': userIdentityStore.token,
        },
        query:{
          "changesSince": changesSinceDateIsoString
        }
      })
      transactionFeed.value = response.data.feedItems
      return true
    } catch (error: OfetchError) {
      notificationsStore.addError(error)
      return false
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