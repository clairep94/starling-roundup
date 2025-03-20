<template>
  <div data-test="savings-goal-card"
    class="bg-white rounded-lg border border-input-border/70 p-3 md:p-5 flex flex-row justify-between gap-4 w-full"
  >
  <!-- LEFT -->
  <div class="flex flex-row gap-3">
    <!-- IMAGE -->
    <div class="rounded-sm bg-gray-400 w-15 h-15 md:w-18 md:h-18 object-cover overflow-clip">
      <img :src="`https://picsum.photos/seed/${goal.savingsGoalUid}/100/100`" alt="Goal Image" class="w-full h-full"/>
    </div>

    <!-- NAME & TOTAL -->
    <div class="flex flex-col">
      <h4 class="font-bold text-black/70">
        {{ goal.name }}
      </h4>
      <p v-if="goal.target"
        class="font-semibold text-sm text-black/60">
        {{formatCurrencyAmount(goal.target)}}
      </p>
    </div>
  </div>
  
  <!-- RIGHT -->
  <div class="flex flex-col gap-1 items-end justify-between">
    <h5 class="font-bold text-black/80">
      {{ formatCurrencyAmount(goal.totalSaved) }}
    </h5>
    <div v-if="goal.savedPercentage || (goal.savedPercentage === 0)"
      class="flex flex-row items-center gap-1">
      <p class="text-xs text-black/60">{{goal.savedPercentage}}%</p>
      <div class="w-[120px] bg-white border border-input-border h-[8px] rounded-full overflow-clip">
        <div 
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