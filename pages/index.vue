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
      <div class="flex flex-col gap-6 w-full lg:w-1/3 items-center">
        <Balance />
      </div>

      <!-- TRANSACTIONS -->
      <div class="flex flex-col flex-grow gap-4 w-full">
        <div class="flex w-full items-center justify-center">
          <!-- TODO: replace props drilling below with date range store -->
          <Roundup data-test="round-up" class="mb-4"
            :selectedItems="filteredTransactions"
            :isLoadingFeed="transactionFeedStore.isLoadingTransactionFeed"
            :selectedStart="selectedStart" 
            :selectedEnd="selectedEnd"
            />
        </div>
        <DateRangePicker data-test="date-range-picker"
          @date-range-selected="handleDateRangeSelected"
          :startProp="selectedStart"
          :endProp="selectedEnd"
          :currentDate="defaultEndDate"
          :disabled="transactionFeedStore.isLoadingTransactionFeed"
        />

        <TransactionsList data-test="transactions-list"
          :is-loading="transactionFeedStore.isLoadingTransactionFeed"
          :items="transactionFeedStore.transactionFeed"
          :current-date="defaultEndDate"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '../store/userIdentity'
import { useTransactionFeedStore } from '../store/transactionFeed'
import DateRangePicker from '../components/DateRangePicker.vue'
import Balance from '../components/Balance.vue'
import Roundup from '../components/Roundup.vue'

useHead({
  title: 'Transaction Feed'
})

const userIdStore = useUserIdentityStore()
const transactionFeedStore = useTransactionFeedStore()

const currentDate = new Date()
const defaultStartDate = new Date(currentDate.setDate(currentDate.getDate() - 7))
  .toISOString()// 7 days ago

const defaultEndDate = new Date().toISOString() // Today

/**
 * Update time from the date time string to be the start of the day
 */
function appendStartTime(str:string):string{
  return str.split('T')[0] + 'T00:00:00.000Z'
}
/**
 * Update time from the date time string to be the end of the day
 */
function appendEndTime(str:string):string{
  return str.split('T')[0] + 'T23:59:59.999Z'
}

const selectedStart = ref<string>(defaultStartDate.split('T')[0] + 'T00:00:00.000Z')
const selectedEnd = ref<string>(defaultEndDate.split('T')[0] + 'T23:59:59.999Z')

/**
 * Normalises the start and end emitted from the DateRangePicker, then calls fetchTransactionFeed
 */
function handleDateRangeSelected(start:string, end:string) {
  selectedStart.value = appendStartTime(start)
  selectedEnd.value = appendEndTime(end)
  transactionFeedStore.fetchTransactionFeed(selectedStart.value, selectedEnd.value)
}

/**
 * Assumption that only outgoing transactions that are NOT "INTERNAL_TRANSFER" can be applied topups with -- I believe this is the behaviour on the app
 * So that users cannot apply topups and past topup transactions
 */
const filteredTransactions = computed(() => {
  return transactionFeedStore.transactionFeed
    .filter(el => el.direction === 'OUT')
    .filter(el => el.source !== "INTERNAL_TRANSFER")
})

onMounted(() => {
  transactionFeedStore.fetchTransactionFeed(selectedStart.value, selectedEnd.value)
})
</script>

<style scoped>

</style>