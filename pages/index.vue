<template>
  <div v-if="!userIdStore.token">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated">
    Transaction feed:
    <pre>
    {{ transactionFeedStore.transactionFeed }}
    </pre>
    Loading transactions:
    {{ transactionFeedStore.isLoadingTransactionFeed }}
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '@/store/userIdentity'
import { useAccountsStore } from '@/store/accounts'
import { useTransactionFeedStore } from '@/store/transactionFeed'
import { useRouter } from 'vue-router'

const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()
const transactionFeedStore = useTransactionFeedStore()

useHead({
  title: 'Account Overview'
})

const isoString = "2025-01-10T12:34:56.000Z"

onMounted(() => {
  transactionFeedStore.fetchTransactionFeed(isoString)
})
</script>

<style scoped>

</style>