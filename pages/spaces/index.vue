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

    <!-- SAVINGS SPACES -- opting for feeding-in-props pattern because they call the same GET endpoint -->
    <div data-test="all-spaces-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-5 overflow-scroll bg-gray-50 min-h-full gap-3">
      <!-- TOTAL SAVED -->
      <SavingsGoalTotal
        :savingsGoals="savingsGoalsStore.savingsGoals"
        :isLoadingSavingsGoals="savingsGoalsStore.isLoadingSavingsGoals"
        :currency="accountCurrency"
      />

      <!-- LOADING -->
      <div v-if="savingsGoalsStore.isLoadingSavingsGoals" 
        data-test="loading-savings-goals"
        class="flex flex-col gap-1 items-center justify-center min-h-[200px]"
      >
        <pie-spinner variant="secondary"/>
        <p class="text-lg text-black/70">
          Loading savings spaces...
        </p>
      </div>

      <!-- NO SAVINGS SPACES -->
      <div v-else-if="!savingsGoalsStore.savingsGoals.length"
        data-test="no-savings-goals"
        class="flex flex-col w-full items-center justify-center h-[200px]"
      >
        <p class="text-lg text-black/70">
          No savings goals yet. Click on the button above to create a new space.
        </p>
      </div>

      <!-- SAVINGS SPACES LIST -->
      <div v-else
        data-test="savings-goals"
        class="flex flex-col gap-3"
      >
        <SavingsGoalCard
          v-for="goal in savingsGoalsStore.savingsGoals"
          :goal="goal"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSavingsGoalsStore } from '../../store/savingsGoals'
import { useUserIdentityStore } from '../../store/userIdentity'
import { useAccountsStore } from '../../store/accounts'
import SavingsGoalCard from '../../components/SavingsGoalCard.vue'
import SavingsGoalTotal from '../../components/SavingsGoalTotal.vue'
import '@justeattakeaway/pie-webc/components/spinner.js'

const savingsGoalsStore = useSavingsGoalsStore()
const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()

const accountCurrency = accountsStore.selectedAccount?.currency ?? 'GBP' // default to GBP

useHead({
  title: 'Savings Spaces'
})

onMounted(() => {
  savingsGoalsStore.fetchSavingsGoals()
})
</script>

<style scoped>

</style>