<template>
  <div class="flex flex-col lg:w-[400px] w-full items-center gap-1">
    <!-- TITLE -->
    <p data-test="balance-title" class="text-sm font-semibold text-black/70">
      Your Potential Roundup
    </p>

    <!-- BALANCE AMOUNT -->
    <p data-test="balance-amount" class="text-2xl font-extrabold text-black/80">
      {{ formatCurrencyAmount(roundupTotalCurrencyAndAmount) }}
    </p>

    <!-- SHOW SPACES -->
    <button data-test="show-spaces-button"
      class="rounded-full text-text-default py-2 px-6 text-md transition-all cursor-pointer"
      :class="{
        'bg-button-teal hover:bg-button-teal-hover': !isSpacesSelectionOpen,
        'bg-gray-400 hover:bg-gray-500': isSpacesSelectionOpen
      }"
      @click="isSpacesSelectionOpen = !isSpacesSelectionOpen"
    >
    {{ isSpacesSelectionOpen ? 'Cancel transfer' : 'Perform transfer' }}
    </button>

    <!-- SPACES FOR TRANSFER -->
    <div v-if="isSpacesSelectionOpen"
      class="flex w-full flex-row overflow-scroll bg-gray-50 p-5 rounded-lg border border-input-border mt-4 gap-3"
    >
      <div v-for="goal in savingsGoalsStore.savingsGoals" class="w-full">
        <SavingsGoalCard :goal="goal" @click="handleTransfer(goal.savingsGoalUid)"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FeedItem } from '@/types/FeedItem';
import { findRoundUpAmount } from "~/utils/roundUpCalculate";
import { useAccountsStore } from '@/store/accounts';
import { useSavingsGoalsStore } from '../store/savingsGoals';

const props = defineProps<{
  selectedItems: FeedItem[];
}>();

const isSpacesSelectionOpen = ref(false);

const accountsStore = useAccountsStore()
const savingsGoalsStore = useSavingsGoalsStore()

const roundupTotalMinorUnits = computed(() => {
  return props.selectedItems.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
});

const roundupTotalCurrencyAndAmount = computed(() => {
  return {
    currency: accountsStore.selectedAccount.currency ?? 'GBP', //default to GBP
    minorUnits: roundupTotalMinorUnits.value
  } 
})

// TODO: This works but need to update UI to reflect
async function handleTransfer(savingsGoalUid:string) {
  console.log('uuid: ', savingsGoalUid),
  console.log('transferAmount: ', roundupTotalCurrencyAndAmount)
  savingsGoalsStore.transferToSavingsGoal(
    savingsGoalUid,
    { amount: roundupTotalCurrencyAndAmount.value }
  )
}

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})
</script>
