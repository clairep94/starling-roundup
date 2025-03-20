<template>
  <div data-test="spaces-for-transfer"
  class="flex w-full flex-row overflow-scroll bg-gray-50 p-5 rounded-lg border border-input-border gap-3 relative"
  >
  <!-- LOADING OVERLAY -->
  <div data-test="loading-overlay"
    v-if="savingsGoalsStore.isLoadingSavingsGoals || savingsGoalsStore.isLoadingTransferToSavingsGoal"
    class="flex w-full h-full bg-white/80 -m-5 absolute p-5 items-center justify-center "
  >
    <pie-spinner variant="secondary"/>
  </div>

    <!-- NO SAVINGS GOALS -->
    <div data-test="no-savings-goals"
      v-if="savingsGoalsStore.savingsGoals.length === 0" class="w-full h-full flex justify-center items-center p-6">
      <p class="text-black/50">Create a savings spaces to see them here</p>
    </div>

    <!-- SAVINGS GOALS -->
    <div data-test="savings-goal" 
      v-else v-for="goal in savingsGoalsStore.savingsGoals" class="min-w-[400px]">
      <SavingsGoalCard :goal="goal" @click="handleTransfer(goal.savingsGoalUid)" class="hover:cursor-pointer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSavingsGoalsStore } from '../store/savingsGoals';
import type { CurrencyAndAmount } from '../types/currencyAndAmount.type';

const props = defineProps<{
  transferAmount: CurrencyAndAmount
}>();

const savingsGoalsStore = useSavingsGoalsStore()

// TODO: This works but need to update UI to reflect
async function handleTransfer(savingsGoalUid:string) {
  savingsGoalsStore.fetchSavingsGoals()
  // savingsGoalsStore.transferToSavingsGoal(
  //   savingsGoalUid,
  //   { amount: props.transferAmount }
  // )
}

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})

</script>

<style scoped>

</style>