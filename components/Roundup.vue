<template>
  <div class="flex flex-col lg:w-[400px] w-full items-center gap-1">
    <!-- TITLE -->
    <h4 data-test="roundup-title" class="text-sm font-semibold text-black/70">
      Your Potential Roundup
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
        'bg-button-teal hover:bg-button-teal-hover': !isSpacesSelectionOpen,
        'bg-gray-400 hover:bg-gray-500': isSpacesSelectionOpen
      }"
      @click="isSpacesSelectionOpen = !isSpacesSelectionOpen"
    >
    {{ isSpacesSelectionOpen ? 'Cancel' : 'Perform transfer' }}
    </button>

    <!-- SPACES FOR TRANSFER -->
    <SavingsGoalsForTransferList data-test="spaces-for-transfer" v-if="isSpacesSelectionOpen" class="mt-2"
      :transferAmount="roundupTotalCurrencyAndAmount"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { FeedItem } from '../types/feedItem.type';
import { findRoundUpAmount } from "../utils/roundUpCalculate";
import { useAccountsStore } from '../store/accounts';
import { formatCurrencyAmount } from '../utils/formatData';
import SavingsGoalsForTransferList from './SavingsGoalsForTransferList.vue';

const props = defineProps<{
  selectedItems: FeedItem[];
  isLoadingFeed: boolean
}>();

const isSpacesSelectionOpen = ref(false);

const accountsStore = useAccountsStore()

const roundupTotalMinorUnits = computed(() => {
  if(props.selectedItems.length === 0){
    return 0
  } else {
    return props.selectedItems.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
  }
});

const roundupTotalCurrencyAndAmount = computed(() => {
  return {
    currency: accountsStore.selectedAccount?.currency ?? 'GBP', //default to GBP
    minorUnits: roundupTotalMinorUnits.value
  } 
})
</script>
