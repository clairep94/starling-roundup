<template>
  <div class="flex flex-col lg:w-[400px] w-full items-center gap-1">
    <p data-test="balance-title" class="text-sm font-semibold text-black/70">
      Your Potential Roundup
    </p>

    <p data-test="balance-amount" class="text-2xl font-extrabold text-black/80">
      <!-- {{ formatCurrencyAmount(
        {
          currency: 'GBP',
          minorUnits: roundupTotalMinorUnits
        }) }} -->

      £{{ (roundupTotalMinorUnits / 100).toFixed(2) }}
    </p>
    <button
      data-test="show-spaces-button"
      class="rounded-full text-text-default py-2 px-6 text-md transition-all cursor-pointer"
      :class="{
        'bg-button-teal hover:bg-button-teal-hover': !isSpacesSelectionOpen,
        'bg-gray-400 hover:bg-gray-500': isSpacesSelectionOpen
      }"
      @click="isSpacesSelectionOpen = !isSpacesSelectionOpen"
    >
    {{ isSpacesSelectionOpen ? 'Cancel transfer' : 'Perform transfer' }}
    </button>

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
import { v4 as uuidv4 } from 'uuid';
import { useNotificationsStore } from '@/store/notifications';
import { useUserIdentityStore } from '@/store/userIdentity';
import { useAccountsStore } from '@/store/accounts';
import { useSavingsGoalsStore } from '../store/savingsGoals';

const props = defineProps<{
  selectedItems: FeedItem[];
}>();

const isTransferInProgress = ref(false);
const isSpacesSelectionOpen = ref(false);

const notificationsStore = useNotificationsStore()
const userIdentityStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
const savingsGoalsStore = useSavingsGoalsStore()

const roundupTotalMinorUnits = computed(() => {
  return props.selectedItems.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
});

async function handleTransfer(savingsGoalUid: string) {
  const uuid = uuidv4();
  console.log('Transfer initiated', roundupTotalMinorUnits.value, uuid);
  console.log('Transfer initiated', userIdentityStore.token);

  try {
    isTransferInProgress.value = true;
    const proxyBaseURL = '/api/starling'
    const endpoint = `/account/${accountsStore.selectedAccount.accountUid}/savings-goals/${savingsGoalUid}/add-money/${uuid}`
    const response = await $fetch(proxyBaseURL + endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userIdentityStore.token}`
      },
      body: JSON.stringify({
        amount: {
          currency: 'GBP',
          minorUnits: roundupTotalMinorUnits.value
        }
      })
    })
  } catch (error) {
    notificationsStore.addError(error)
  } finally {
    isTransferInProgress.value = false
  }
}

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})
</script>
