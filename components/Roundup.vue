<template>
  <div class="flex flex-col lg:w-[400px] w-full items-center gap-1">
    <!-- TITLE -->
    <h4 data-test="roundup-title" class="text-sm font-semibold text-black/70">
      {{ titleMessage }}
    </h4>

    <!-- LOADING -->
    <div data-test="loading-transactions" v-if="isLoadingFeed">
      <pie-spinner variant="secondary"/>
    </div>

    <!-- ROUNDUP AMOUNT -->
    <h3 v-else data-test="roundup-amount" 
      class="text-2xl font-extrabold text-black/80">
      {{ formatCurrencyAmount(roundupTotalCurrencyAndAmount) }}
    </h3>

    <!-- SHOW SPACES FOR TRANSFER BUTTON -->
    <button data-test="show-spaces-for-transfer-button"
      class="rounded-full text-text-default py-2 px-6 text-md transition-all cursor-pointer"
      :class="{
        'bg-button-teal hover:bg-button-teal-hover': !isSelectingRoundupTransactions,
        'bg-gray-400 hover:bg-gray-500': isSelectingRoundupTransactions
      }"
      @click="emit(isSelectingRoundupTransactions ? 'closeSelectingRoundupTransactions' : 'openSelectingRoundupTransactions')"
    >
    {{ isSelectingRoundupTransactions ? 'Cancel' : 'Perform transfer' }}
    </button>

    <!-- SPACES FOR TRANSFER -->
    <SavingsGoalsForTransferList data-test="spaces-for-transfer" v-if="isSelectingRoundupTransactions" 
      class="mt-2"
      :transferAmount="roundupTotalCurrencyAndAmount"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FeedItem } from '../types/feedItem.type';
import { findRoundUpAmount } from "../utils/roundUpCalculate";
import { useAccountsStore } from '../store/accounts';
import { formatCurrencyAmount } from '../utils/formatData';
import SavingsGoalsForTransferList from './SavingsGoalsForTransferList.vue';

const props = defineProps<{
  selectedTransactions: FeedItem[];
  allPotentialTransactions: FeedItem[];
  isLoadingFeed: boolean;
  isSelectingRoundupTransactions: boolean;
}>();

const emit = defineEmits(['openSelectingRoundupTransactions', 'closeSelectingRoundupTransactions']);

const accountsStore = useAccountsStore()

const titleMessage = computed(() => {
  return props.isSelectingRoundupTransactions ? 'Your Selected Roundup Total' : 'Your Potential Roundup'
})

const roundupTotalMinorUnits = computed(() => {
  // if not selecting roundup transactions -- show the potential roundup amount of all eligible & filtered items
  // if selecting roundup transactions -- show the actual roundup amount of all selected items in eligible & filtered items
  const applicableItemsList = props.isSelectingRoundupTransactions ? 
    props.selectedTransactions : props.allPotentialTransactions

  if(applicableItemsList.length === 0){
    return 0
  } else {
    return applicableItemsList.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
  }
});

const roundupTotalCurrencyAndAmount = computed(() => {
  return {
    currency: accountsStore.selectedAccount?.currency ?? 'GBP', //default to GBP
    minorUnits: roundupTotalMinorUnits.value
  } 
})
</script>
