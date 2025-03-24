<template>
  <h4 class="text-black/60 mt-3 text-sm">
    Select transactions eligible transactions below. <NewFeatureChip/><br>
    Then select a savings space to transfer your roundup.
  </h4>
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
    <div v-else v-for="goal in savingsGoalsStore.savingsGoals" class="min-w-[350px]">
      <SavingsGoalCard data-test="savings-goal"
      :goal="goal" @click="handleTransfer(goal.savingsGoalUid)" class="hover:cursor-pointer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSavingsGoalsStore } from '../store/savingsGoals';
import { useNotificationsStore } from '../store/notifications';
import { useBalanceStore } from '../store/balance';
import { useTransactionFeedStore } from '../store/transactionFeed';
import type { CurrencyAndAmount } from '../types/currencyAndAmount.type';
import { useDateRangeStore } from '../store/dateRange';

const props = defineProps<{
  transferAmount: CurrencyAndAmount;
}>();

const savingsGoalsStore = useSavingsGoalsStore()
const notificationsStore = useNotificationsStore()
const balanceStore = useBalanceStore()
const transactionFeedStore = useTransactionFeedStore()
const dateRangeStore = useDateRangeStore()

/*
 * Makes savigns goal transfer. If successful, adds a success notification and triggers balance, savings goals and transaction feed to re-fetch
 */
async function handleTransfer(savingsGoalUid:string) {
  const result = await savingsGoalsStore.transferToSavingsGoal( savingsGoalUid, { amount: props.transferAmount })
  if (result === true){
    notificationsStore.addNotification({
      variant: 'success',
      message: `Successfully transferred roundup to savings goal: ${savingsGoalUid}`
    })
    savingsGoalsStore.fetchSavingsGoals()
    balanceStore.fetchBalance()
    transactionFeedStore.fetchTransactionFeed(dateRangeStore.selectedStart, dateRangeStore.selectedEnd)
  }
}

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})

</script>

<style scoped>

</style>