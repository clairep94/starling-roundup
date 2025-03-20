<template>
  <div class="flex flex-col w-full">
    <!-- LOADING -->
    <div v-if="isLoadingSavingsGoals" 
      data-test="loading-savings-goals"
      class="flex flex-col gap-1 items-center justify-center min-h-[200px]"
    >
      <pie-spinner variant="secondary"/>
      <p class="text-lg text-black/70">
        Loading savings spaces...
      </p>
    </div>
  
    <!-- NO SAVINGS SPACES -->
    <div v-else-if="!savingsGoals.length"
      data-test="no-savings-goals"
      class="flex flex-col w-full items-center justify-center h-[200px]"
    >
      <p class="text-black/50">
        No savings goals yet. Click on the button above to create a new space.
      </p>
    </div>
  
    <!-- SAVINGS SPACES LIST -->
    <div v-else
      data-test="savings-goals"
      class="flex flex-col gap-3"
    >
      <SavingsGoalCard
        v-for="goal in savingsGoals"
        :goal="goal"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SavingsGoal } from '../types/savingsGoal.type';
import SavingsGoalCard from './SavingsGoalCard.vue';

const props = defineProps<{
  isLoadingSavingsGoals: boolean,
  savingsGoals: SavingsGoal[],
}>();
</script>

<style scoped>

</style>