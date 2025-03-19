<template>
  <div class="flex flex-col lg:w-[250px] w-full items-center gap-1">
    <h3 data-test="balance-title" class="text-sm font-semibold text-black/70">
      Your Current Balance
    </h3>
    <!-- LOADING -->
    <div v-if="balanceStore.isLoadingBalance" data-test="loading-balance"
      class="flex flex-col gap-1 items-center mt-2"
    >
      <pie-spinner variant="secondary"/>
      <p class="text-lg text-black/70">
        Loading balance...
      </p>
    </div>

    <!-- NO BALANCE -->
    <p v-else-if="balanceStore.effectiveBalance === null" data-test="no-balance"
      class="text-xl text-black/80"
    > No balance found. 
    </p>

    <!-- BALANCE AMOUNT -->
    <h2 v-else data-test="balance-amount"
      class="text-2xl font-extrabold text-black/80">
      {{ formatCurrencyAmount(balanceStore.effectiveBalance) }}
    </h2>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBalanceStore } from '@/store/balance'
import { formatCurrencyAmount } from '~/utils/formatData'
import '@justeattakeaway/pie-webc/components/spinner.js'

const balanceStore = useBalanceStore()

onBeforeMount(() => {
  balanceStore.fetchBalance()
})
</script>

<style lang="scss" scoped>

</style>