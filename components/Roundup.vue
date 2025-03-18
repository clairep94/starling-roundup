<template>
  <div class="flex flex-col lg:w-[250px] w-full items-center gap-1">
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
      data-test="show-login-form-button"
      type="submit"
      class="rounded-full text-text-default py-2 px-6 text-lg transition-all cursor-pointer bg-button-teal hover:bg-button-teal-hover"
      @click="handleTransfer"
    >
      Perform transfer {{ isTransferInProgress ? '...' : '' }}
    </button>
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

const props = defineProps<{
  selectedItems: FeedItem[];
}>();

const isTransferInProgress = ref(false);

const notificationsStore = useNotificationsStore()
const userIdentityStore = useUserIdentityStore()
const accountsStore = useAccountsStore()

const roundupTotalMinorUnits = computed(() => {
  return props.selectedItems.reduce((acc, item) => acc + findRoundUpAmount(item.amount), 0);
});

const savingsGoalUid = 'f3800d53-db0e-4908-a3c7-605349e89818' // anna wintour hardcoded

async function handleTransfer() {

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
</script>
