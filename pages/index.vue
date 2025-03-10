<template>
  <div v-if="!userIdStore.token">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated">
    <!-- PAGE TITLE SECTION -->
    <div data-test="page-title-section" class="flex flex-col px-6 py-4 pb-0 md:px-8 md:py-6 md:pb-0 border-b border-b-gray-100">

      <!-- USER FULL NAME -->
      <div data-test="user-full-name" class="text-2xl font-bold text-black/80">
        {{ userIdStore.userIdentity.firstName }} {{ userIdStore.userIdentity.lastName }}
      </div>

      <!-- TABS -->
      <div data-test="home-page-tabs" class="flex flex-row gap-4">
        <div data-test="account-overview-tab" 
        class="text-sm font-semibold text-black/80 hover:cursor-pointer py-4 border-b-2 border-b-teal">
          Transaction Feed
        </div>
      </div>
    </div>


    <!-- LOADING -->
    <div data-test="loading-transactions" v-if="transactionFeedStore.isLoadingTransactionFeed">
      Loading transactions...
    </div>

    <!-- NO DATA -->
    <div data-test="no-transactions-found-message" v-else-if="transactionFeedStore.transactionFeed.length == 0">
      No transactions found.
    </div>

    <!-- TRANSACTIONS LIST -->
    <div data-test="transaction-feed-list" v-else
    class="flex flex-col gap-2">
      <TransactionFeedItem v-for="transaction in transactionFeedStore.transactionFeed" :transactionFeedItem="transaction" :key="transaction.id" />
    </div>
    
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '@/store/userIdentity'
import { useAccountsStore } from '@/store/accounts'
import { useTransactionFeedStore } from '@/store/transactionFeed'
import { useRouter } from 'vue-router'

const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
const transactionFeedStore = useTransactionFeedStore()

useHead({
  title: 'Account Overview'
})

const isoString = "2025-01-10T12:34:56.000Z"

onMounted(() => {
  transactionFeedStore.fetchTransactionFeed(isoString)
})
</script>

<style scoped>

</style>