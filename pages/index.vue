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
          <Roundup data-test="round-up" class="mb-4"
            :selectedItems="filteredRoundupTransactions"
            :isLoadingFeed="transactionFeedStore.isLoadingTransactionFeed"
            />
        </div>

        <div class="flex flex-col bg-amber-200 mx-auto gap-3">
          <div class="flex bg-red-200">
            test
          </div>
          <div data-test="filters-and-date-time-picker"
          class="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-x-4 gap-y-3 mx-auto">
            <div data-test="filters" 
              class="flex flex-row gap-2">
              <select 
                v-model="selectedSpendingCategory"
                class="bg-gray-50 border min-w-[140px] border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5"
              >
                <option
                  v-for="option in spendingCategories"
                  :key="option"
                  :value="option"
                >
                  {{ option[0].toUpperCase() + option.slice(1).toLowerCase() }}
                </option>
              </select>
  
              <select 
                v-model="selectedTransactionDirection"
                class="bg-gray-50 border min-w-[140px] border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5 " 
              >
                <option
                  v-for="option in transactionDirections"
                  :key="option"
                  :value="option"
                >
                  {{ option[0] + option.slice(1).toLowerCase() }}
                </option>
              </select>
            </div>
            
            <DateRangePicker data-test="date-range-picker"
              @date-range-selected="handleDateRangeSelected"
              :currentDate="currentDate"
              :startProp="dateRangeStore.selectedStart"
              :endProp="dateRangeStore.selectedEnd"
              :disabled="transactionFeedStore.isLoadingTransactionFeed"
            />
          </div>
        </div>

        <TransactionsList data-test="transactions-list"
          :is-loading="transactionFeedStore.isLoadingTransactionFeed"
          :items="filteredTransactions"
          :current-date="currentDate"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '../store/userIdentity'
import { useTransactionFeedStore } from '../store/transactionFeed'
import { useDateRangeStore } from '../store/dateRange'
import DateRangePicker from '../components/DateRangePicker.vue'
import Balance from '../components/Balance.vue'
import Roundup from '../components/Roundup.vue'

useHead({
  title: 'Transaction Feed'
})

const userIdStore = useUserIdentityStore()
const transactionFeedStore = useTransactionFeedStore()
const dateRangeStore = useDateRangeStore()


function handleDateRangeSelected(start:string, end:string) {
  dateRangeStore.setDateRange(start, end)
  transactionFeedStore.fetchTransactionFeed(dateRangeStore.selectedStart, dateRangeStore.selectedEnd)
}

const currentDate = new Date().toISOString()

const spendingCategories = computed(() => {
  let categories:string[] = ['ALL CATEGORIES']
  transactionFeedStore.transactionFeed.forEach((el) => {
    if(!categories.includes(el.spendingCategory)){
      categories.push(el.spendingCategory)
    }
  })
  return categories
})

const selectedSpendingCategory = ref(spendingCategories.value[0])

const transactionDirections = ['ALL TYPES', 'IN', 'OUT']

const selectedTransactionDirection = ref(transactionDirections[0])

const filteredTransactions = computed(() => {
  return transactionFeedStore.transactionFeed
    .filter(el => selectedSpendingCategory.value === 'ALL CATEGORIES' ? el : el.spendingCategory === selectedSpendingCategory.value)
    .filter(el => selectedTransactionDirection.value === 'ALL TYPES' ? el : el.direction === selectedTransactionDirection.value)
})

/**
 * Assumption that only outgoing transactions that are NOT "INTERNAL_TRANSFER" can be applied topups with -- I believe this is the behaviour on the app
 * So that users cannot apply topups on past topup transactions
 */
const filteredRoundupTransactions = computed(() => {
  return filteredTransactions.value
    .filter(el => el.direction === 'OUT')
    .filter(el => el.source !== "INTERNAL_TRANSFER")
})

onMounted(() => {
  transactionFeedStore.fetchTransactionFeed(dateRangeStore.selectedStart, dateRangeStore.selectedEnd)
})
</script>

<style scoped>

</style>