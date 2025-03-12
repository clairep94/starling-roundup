<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    :pageTitle="`${userIdStore.userIdentity.firstName} ${userIdStore.userIdentity.lastName}`"
    :subPages="[
      { title: 'Transaction Feed', path: '/' },
    ]">
    <!-- MAIN -->
    <div data-test="transaction-feed-main" class="flex flex-col flex-grow px-6 py-4 gap-6 lg:flex-row-reverse lg:px-8 lg:py-6 lg:gap-8">
      <BalanceDisplay />

      <!-- TRANSACTIONS -->
      <div class="flex flex-col flex-grow gap-4 w-full">
        <DateRangePicker />

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
      </div>


    </div>
    
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '@/store/userIdentity'
import { useAccountsStore } from '@/store/accounts'
import { useTransactionFeedStore } from '@/store/transactionFeed'
import { useBalanceStore } from '@/store/balance'
import { useRouter } from 'vue-router'
import { formatCurrencyAmount } from '~/utils/formatData'
import DateRangePicker from '@/components/DateRangePicker.vue'
import BalanceDisplay from '@/components/BalanceDisplay.vue'
import TransactionFeedItem from '@/components/TransactionFeedItem.vue'

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