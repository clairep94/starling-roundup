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
        <SpendingInsightsByCategory
          :dateRange="{
            summaryStartPeriodInclusive: dateRangeStore.selectedStart,
            summaryEndPeriodExclusive: dateRangeStore.selectedEnd
          }"
        />
      </div>

      <!-- TRANSACTIONS -->
      <div class="flex flex-col flex-grow gap-4 w-full">
        <div class="flex w-full items-center justify-center">
          <Roundup data-test="round-up" class="mb-4"
            :selectedItems="filteredRoundupTransactions"
            :isLoadingFeed="transactionFeedStore.isLoadingTransactionFeed"
            />
        </div>

        <div class="flex flex-col mx-auto gap-3 mt-3">
          <div class="relative flex flex-col items-end">
            <div class="absolute -translate-y-7">
              <NewFeatureChip/>
            </div>

            <!-- SEARCHBAR -->
            <SearchBar
              v-model="searchInput"
            />
          </div>

          <!-- FILTERS & DATE-RANGE PICKER -->
          <div data-test="filters-and-date-time-picker"
          class="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-x-4 gap-y-3 mx-auto">
            <div data-test="filters" 
              class="flex flex-row gap-2">

              <SelectDropdown
                v-model="selectedSpendingCategory"
                :options="spendingCategories"
              />
              <SelectDropdown
                v-model="selectedTransactionDirection"
                :options="transactionDirections"
              />
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
import SpendingInsightsByCategory from '../components/SpendingInsightsByCategory.vue'
import NewFeatureChip from '../components/NewFeatureChip.vue'
import SearchBar from '../components/SearchBar.vue'
import SelectDropdown from '../components/SelectDropdown.vue'

useHead({
  title: 'Transaction Feed'
})

const userIdStore = useUserIdentityStore()
const transactionFeedStore = useTransactionFeedStore()
const dateRangeStore = useDateRangeStore()

// ==== DATE RANGE PICKER ====
function handleDateRangeSelected(start:string, end:string) {
  dateRangeStore.setDateRange(start, end)
  transactionFeedStore.fetchTransactionFeed(dateRangeStore.selectedStart, dateRangeStore.selectedEnd)
}
const currentDate = new Date().toISOString()

// ===== SEARCH & FILTER ====
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

const searchInput = ref('')

// TODO: add test cases for this for search/filter:
// Faster Payment, Mickey Mouse, Trip to Paris
const filteredTransactions = computed(() => {
  return transactionFeedStore.transactionFeed
    .filter(el => {
      if (searchInput.value.length === 0) return true;
      const searchTerm = searchInput.value.toLowerCase();
      return el.counterPartyName.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
    })
    .filter(el => selectedSpendingCategory.value === 'ALL CATEGORIES' ? el : el.spendingCategory === selectedSpendingCategory.value)
    .filter(el => selectedTransactionDirection.value === 'ALL TYPES' ? el : el.direction === selectedTransactionDirection.value)
})

// ===== ROUNDUPS =====
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