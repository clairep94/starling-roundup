<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    :pageTitle="`${userIdStore.userIdentity.firstName} ${userIdStore.userIdentity.lastName}`"
    :subPages="[
      { title: 'Transaction Feed', path: '/' },
      { title: 'Round Up', path: '/round-up' }
    ]">
    <!-- MAIN -->
    <div data-test="transaction-feed-main" class="flex flex-col flex-grow px-6 py-4 gap-6 lg:flex-row-reverse lg:px-8 lg:py-6 lg:gap-8">
      <Balance />


      <!-- TRANSACTIONS -->
      <div class="flex flex-col flex-grow gap-4 w-full">
        <DateRangePicker @date-range-selected="handleDateRangeSelected"
          :startProp="selectedStart"
          :endProp="selectedEnd"
          :currentDate="defaultEndDate.split('T')[0]"
        />

        <!-- LOADING -->
        <div data-test="loading-transactions" v-if="transactionFeedStore.isLoadingTransactionFeed"
        class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
        >
          Loading transactions...
        </div>
    
        <!-- NO DATA -->
        <div data-test="no-transactions-found-message" v-else-if="transactionFeedStore.transactionFeed.length == 0"
        class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
        >
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
import Balance from '@/components/Balance.vue'
import TransactionFeedItem from '@/components/TransactionFeedItem.vue'


const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
const transactionFeedStore = useTransactionFeedStore()

useHead({
  title: 'Account Overview'
})

const currentDate = new Date()
const defaultStartDate = new Date(currentDate.setDate(currentDate.getDate() - 7))
  .toISOString()// 7 days ago

const defaultEndDate = new Date().toISOString() // Today

const selectedStart = ref<string>(defaultStartDate.split('T')[0] + 'T00:00:00.000Z') //2025-03-05T02:11:13.920Z
const selectedEnd = ref<string>(defaultEndDate.split('T')[0] + 'T23:59:59.999Z') //2025-03-12T02:09:22.744Z

function handleDateRangeSelected(start:string, end:string) {
  selectedStart.value = start + 'T00:00:00.000Z'
  selectedEnd.value = end + 'T23:59:59.999Z'

  console.log('Selected Start Date:', selectedStart.value)
  console.log('Selected End Date:', selectedEnd.value)
  transactionFeedStore.fetchTransactionFeed(selectedStart.value, selectedEnd.value)
}

onMounted(() => {
  transactionFeedStore.fetchTransactionFeed(selectedStart.value, selectedEnd.value)
})
</script>

<style scoped>

</style>