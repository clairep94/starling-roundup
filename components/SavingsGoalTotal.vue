<template>
  <div class="bg-white rounded-lg border border-input-border/70 p-6 flex flex-col items-center justify-center gap-1">
    <h4 data-test="savings-goal-total-title"
    class="text-sm text-black/70 font-medium">
      Total amount held in Spaces
    </h4>

    <!-- LOADING -->
    <div v-if="isLoadingSavingsGoals" data-test="loading-savings-goals"
    class="flex flex-col gap-1 items-center mt-2">
      <pie-spinner variant="secondary"/>
      <p class="text-lg text-black/70">
        Loading...
      </p>
    </div>

    <!-- SAVINGS GOAL TOTAL -->
    <h3 v-else data-test="savings-goals-total"
    class="text-2xl text-black/80 font-extrabold">
      {{ formatCurrencyAmount(totalSavedAmount) }}
    </h3>

    <!-- BUTTON TO NAV CREATE-NEW-SAVINGS-SPACE -->
    <button
      data-test="navigate-to-create-space-button"
      @click="navigateTo('/spaces/create')"
      class="rounded-full text-text-default text-sm md:text-md py-2 px-6 transition-all bg-button-teal hover:bg-button-teal-hover hover:cursor-pointer mt-6 line-clamp-1"
    >
      Create a new space
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { formatCurrencyAmount } from '../utils/formatData'
import type { SavingsGoal } from '../types/savingsGoal.type';
import { navigateTo } from 'nuxt/app'

const props = defineProps<{
  savingsGoals: SavingsGoal[],
  isLoadingSavingsGoals: boolean,
  currency: string,
}>();

const totalSavedAmount = computed(() => {
  if (!props.savingsGoals) {
    return { minorUnits: 0, currency: props.currency };
  }
  const total = props.savingsGoals.reduce(
    (acc, goal) => acc + goal.totalSaved.minorUnits, 
    0
  );
  return { minorUnits: total, currency: props.currency };
})

</script>

<style scoped>

</style>