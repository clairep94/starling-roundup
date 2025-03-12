<template>
  <div class="flex flex-col lg:w-[250px] w-full items-center gap-1">
    <p data-test="balance-title" class="text-sm font-semibold text-black/70">
      Your Current Balance
    </p>
    
    <!-- LOADING -->
    <p v-if="balanceStore.isLoadingBalance" data-test="loading-balance"
      class="text-xl text-black/80"
    > Loading...</p>

    <!-- NO BALANCE -->
    <p v-else-if="balanceStore.effectiveBalance === null" data-test="no-balance"
      class="text-xl text-black/80"
    > No balance found. 
    </p>

    <!-- BALANCE AMOUNT -->
    <p v-else data-test="balance-amount"
      class="text-2xl font-extrabold text-black/80">
      {{ formatCurrencyAmount(balanceStore.effectiveBalance) }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBalanceStore } from '@/store/balance'
import { formatCurrencyAmount } from '~/utils/formatData'

const balanceStore = useBalanceStore()

onBeforeMount(() => {
  balanceStore.fetchBalance()
})
</script>

<style lang="scss" scoped>

</style>