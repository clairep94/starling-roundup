<template>
  <div data-test="savings-goal-card"
    class="bg-white hover:bg-gray-100 hover:cursor-pointer rounded-lg border border-input-border/70 p-3 md:p-5 flex flex-row justify-between gap-4 w-full"
  >
  <!-- LEFT -->
  <div data-test="left-side"
    class="flex flex-row gap-3">
    <!-- IMAGE -->
    <div data-test="savings-space-image-container"
    class="rounded-sm bg-gray-400 min-w-15 h-15 md:min-w-18 md:h-18 object-cover overflow-clip">
      <img data-test="savings-space-image"
      :src="`https://picsum.photos/seed/${goal.name}/100/100`" alt="Goal Image" class="w-full h-full"/>
    </div>

    <!-- NAME & TOTAL -->
    <div data-test="savings-space-name-and-total"
      class="flex flex-col">
      <h4 data-test="savings-goal-name" 
      class="font-bold text-black/70 line-clamp-2">
        {{ goal.name }}
      </h4>
      <p data-test="savings-goal-target"
      v-if="goal.target"
        class="font-semibold text-sm text-black/60">
        {{formatCurrencyAmount(goal.target)}}
      </p>
    </div>
  </div>
  
  <!-- RIGHT -->
  <div data-test="right-side"
  class="flex flex-col gap-1 items-end justify-between">

    <!-- TOTAL SAVED -->
    <h5 data-test="savings-goal-total-saved"
      class="font-bold text-black/80">
      {{ formatCurrencyAmount(goal.totalSaved) }}
    </h5>

    <!-- PERCENTAGE SAVED -->
    <div data-test="savings-goal-percentage-saved"
    v-if="goal.savedPercentage || (goal.savedPercentage === 0)"
      class="hidden sm:flex flex-row items-center gap-1">
      
      <!-- PERCENTAGE LABEL -->
      <p data-test="savings-goal-percentage-saved-label"
      class="text-xs text-black/60">{{goal.savedPercentage}}%</p>

      <!-- PERCENTAGE LOADING BAR -->
      <div data-test="savings-goal-percentage-saved-loading-bar-container" 
      class="w-[120px] bg-white border border-input-border h-[8px] rounded-full overflow-clip">
        <div data-test="savings-goal-percentage-saved-loading-bar-fill" 
          class="bg-input-border h-full"
          :style="{ width: goal.savedPercentage + '%' }"
        />
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import type { SavingsGoal } from "../types/savingsGoal.type";
import { formatCurrencyAmount } from "../utils/formatData";

const props = defineProps<{
  goal: SavingsGoal
}>();
</script>

<style scoped>

</style>