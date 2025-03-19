<template>
  <div class="flex flex-row w-full justify-between p-4 border-t border-b border-gray-200">
    <div data-test="left-side" class="flex flex-row gap-4 justify-center items-center">
      <div data-test="logo-container"
        class="bg-red-500/50 w-12 h-12 rounded-sm items-center justify-center flex text-white font-semibold"
      >
        {{ counterPartyName.split(' ').map((word) => word[0]).join('').toUpperCase() }}
      </div>
      <div data-test="transaction-details" class="flex flex-col">
        <div data-test="counter-party-name" class="text-sm font-semibold text-black/80">
          {{ counterPartyName }}
        </div>
        <div data-test="transaction-time-and-category" class="text-xs text-gray-500">
          {{ formattedSettlementTime }} | {{ formattedSpendingCategory }}
        </div>
      </div>
    </div>
    
    <!-- AMOUNT & TOGGLE -->
    <div data-test="right-side" class="flex flex-col gap-1 justify-center items-end">
      <div data-test="amount" class="text-sm font-semibold text-right"
        :class="{
          'text-blue-700/70': direction === 'IN',
          'text-black/80': direction === 'OUT'
        }"
      >
        {{ direction === 'IN' ? '+' : '' }}{{ formattedCurrencyAmount }}   
      </div>
      <div v-if="direction === 'OUT'" data-test="round-up-amount" class="flex flex-row gap-[2px] items-center text-gray-500">
        <icon-coins/>
        <p class="text-xs">
          {{ formattedRoundupAmount }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedItem } from "@/types/FeedItem";
import { formatCurrencyAmount, formatUpperSnakeCaseToTitleString, extractTime } from "~/utils/formatData";
import { findRoundUpAmount } from "~/utils/roundUpCalculate";
import "@justeattakeaway/pie-icons-webc/dist/IconCoins.js";
import "@justeattakeaway/pie-icons-webc/dist/IconCoinsFilled.js";
import { useAccountsStore } from '@/store/accounts'

const accountsStore = useAccountsStore()

const props = defineProps<{
  transactionFeedItem: FeedItem;
}>();

const { amount, direction, settlementTime, counterPartyName, spendingCategory, userNote } = props.transactionFeedItem;

const formattedCurrencyAmount = formatCurrencyAmount(amount);
const formattedSpendingCategory = formatUpperSnakeCaseToTitleString(spendingCategory);
const formattedSettlementTime = extractTime(settlementTime);
const formattedRoundupAmount = formatCurrencyAmount(
  {
    currency: accountsStore.selectedAccount ? accountsStore.selectedAccount.currency : 'GBP',
    minorUnits: findRoundUpAmount(amount)
  }
)

</script>

<style scoped>

</style>