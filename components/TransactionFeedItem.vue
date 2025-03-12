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
    <div data-test="right-side" class="flex flex-row gap-2 justify-center items-center">
      <!-- TODO: icon if round up has already been applied -->
      <div v-if="userNote">
      roundupIcon
      </div>
      <div data-test="amount" class="text-sm font-semibold "
        :class="{
          'text-blue-700/70': direction === 'IN',
          'text-black/80': direction === 'OUT'
        }"
      >
        {{ direction === 'IN' ? '+' : '' }}{{ formattedCurrencyAmount }} 
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedItem } from "@/types/FeedItem";
import { formatCurrencyAmount, formatUpperSnakeCaseToTitleString, extractTime } from "~/utils/formatData";
import { uuidToHexColour } from '~/utils/uuidToHexColour'

const props = defineProps<{
  transactionFeedItem: FeedItem;
}>();

const { amount, direction, settlementTime, counterPartyName, spendingCategory, counterPartyUid, userNote } = props.transactionFeedItem;

const formattedCurrencyAmount = formatCurrencyAmount(amount);
const formattedSpendingCategory = formatUpperSnakeCaseToTitleString(spendingCategory);
const formattedSettlementTime = extractTime(settlementTime);
// const counterPartyNameInitialsColour = uuidToHexColour(counterPartyUid);
// const counterPartyNameInitialsColourStyle = `bg-${counterPartyNameInitialsColour}-500 text-white`;

</script>

<style scoped>

</style>