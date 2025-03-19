<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    pageTitle="Spaces"
    :subPages="[
      { title: 'Spaces', path: '/spaces' },
      { title: 'Create a new space', path: '/spaces/create' }
    ]">

    <!-- SAVINGS SPACES -->
    <div data-test="all-spaces-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll bg-gray-50 min-h-full gap-3">
      
      <!-- CARD -->
      <div v-for="goal in savingsGoalsStore.savingsGoals"
        class="bg-white rounded-lg border border-input-border/70 p-3 flex flex-col sm:flex-row justify-between gap-4"
      >
        <!-- LEFT -->
        <div class="flex flex-row gap-3">
          <!-- IMAGE -->
          <div class="rounded-sm bg-gray-400 w-15 h-15 object-cover overflow-clip">
            <img :src="`https://picsum.photos/seed/${goal.savingsGoalUid}/100/100`" alt="Goal Image"/>
          </div>

          <!-- NAME & TOTAL -->
          <div class="flex flex-col">
            <h4 class="font-bold text-black/70">
              {{ goal.name }}
            </h4>
            <p class="font-semibold text-sm text-black/60">
              {{formatCurrencyAmount(goal.target)}}
            </p>
          </div>
        </div>
        
        <!-- RIGHT -->
        <div class="flex flex-col gap-1 items-end justify-between">
          <h5 class="font-bold text-black/80">
            {{ formatCurrencyAmount(goal.totalSaved) }}
          </h5>
          <div class="flex flex-row items-center gap-1">
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

      <!-- TOTAL SAVED -->
      <div class="bg-white rounded-lg border border-input-border/70 p-6 flex flex-col items-center justify-center gap-1">
        <h4 class="text-sm text-black/70 font-medium">
          Total amount held in Spaces
        </h4>
        <h3 class="text-2xl text-black/80 font-extrabold">
          {{ formatCurrencyAmount(totalSavedAmount) }}
        </h3>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSavingsGoalsStore } from '../../store/savingsGoals'
import { useUserIdentityStore } from '../../store/userIdentity'
import {formatCurrencyAmount} from '../../utils/formatData'

const savingsGoalsStore = useSavingsGoalsStore()
const userIdStore = useUserIdentityStore()

useHead({
  title: 'Savings Spaces'
})

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})

import { computed } from 'vue';

// Computed property to calculate total saved amount with currency
const totalSavedAmount = computed(() => {
  if (!savingsGoalsStore.savingsGoals.length) {
    return { minorUnits: 0, currency: 'GBP' };
  }
  const total = savingsGoalsStore.savingsGoals.reduce(
    (acc, goal) => acc + goal.totalSaved.minorUnits, 
    0
  );
  return { minorUnits: total, currency: 'GBP' };
});
</script>

<style scoped>

</style>