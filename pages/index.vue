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
        <SpendingInsightsByCategory :useDateRange="true" />
      </div>

      <!-- TRANSACTIONS -->
      <div class="flex flex-col flex-grow gap-4 w-full">
        <div data-test="round-up" class="flex w-full items-center justify-center mb-4">
          <Roundup 
            :selectedTransactions="selectedTransactions"
            :allPotentialTransactions="filteredRoundupTransactions"
            :isLoadingFeed="isLoadingTransactionFeed"
            :isSelectingRoundupTransactions="isSelectingRoundupTransactions"
            @openSelectingRoundupTransactions="handleOpenSelectingRoundupTransactions"
            @closeSelectingRoundupTransactions="handleCloseSelectingRoundupTransactions"
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
            
            <DateRangePicker
              :currentDate="currentDate"
              :disabled="isLoadingTransactionFeed"
            />
          </div>
        </div>

        <TransactionsList
          :currentDate="currentDate"
          :isLoading="isLoadingTransactionFeed"
          :isSelectingRoundupTransactions="isSelectingRoundupTransactions"
          :items="filteredTransactions"
          :selectedTransactions="selectedTransactions"
          @update:selectedTransactions="handleUpdateSelectedTransactions"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
import type { FeedItem } from '../types/feedItem.type'
import { storeToRefs } from 'pinia'
import { isEligibleForRoundup } from '../utils/roundUpCalculate'

useHead({
  title: 'Transaction Feed'
})

const userIdStore = useUserIdentityStore()

const transactionFeedStore = useTransactionFeedStore()
const { isLoadingTransactionFeed, transactionFeed } = storeToRefs(transactionFeedStore)

const dateRangeStore = useDateRangeStore()
const { selectedStart, selectedEnd } = storeToRefs(dateRangeStore)
const currentDate = new Date().toISOString()


// ===== SEARCH & FILTER ====
const spendingCategories = computed(() => {
  let categories:string[] = ['ALL CATEGORIES']
  transactionFeed.value.forEach((el) => {
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
  return transactionFeed.value
    .filter(el => {
      if (searchInput.value.length === 0) return true;
      const searchTerm = searchInput.value.toLowerCase();
      return el.counterPartyName.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
    })
    .filter(el => selectedSpendingCategory.value === 'ALL CATEGORIES' ? el : el.spendingCategory === selectedSpendingCategory.value)
    .filter(el => selectedTransactionDirection.value === 'ALL TYPES' ? el : el.direction === selectedTransactionDirection.value)
})

// ===== ROUNDUPS =====
const filteredRoundupTransactions = computed(() => {
  return filteredTransactions.value
    .filter(el => isEligibleForRoundup(el))
})

const isSelectingRoundupTransactions = ref(false)

/**
 * Items selected for the roundup out of all eligible & pre-filtered items
 * Auto-select all items when the user starts configuring a roundup transaction
 */ 
const selectedTransactions = ref<FeedItem[]>([])

function handleOpenSelectingRoundupTransactions(){
  selectedTransactions.value = filteredRoundupTransactions.value
  isSelectingRoundupTransactions.value = true
}

function handleCloseSelectingRoundupTransactions(){
  isSelectingRoundupTransactions.value = false
}

function handleUpdateSelectedTransactions(updatedArray: FeedItem[]){
  selectedTransactions.value = updatedArray
}

watch([selectedStart, selectedEnd], async ([newStart, newEnd]) => {
  isSelectingRoundupTransactions.value = false
  await transactionFeedStore.fetchTransactionFeed(newStart, newEnd)
  handleOpenSelectingRoundupTransactions()
})

onMounted(async() => {
  await transactionFeedStore.fetchTransactionFeed(selectedStart.value, selectedEnd.value)
})

</script>

<style scoped>

</style>