<template>
  <div v-if="!userIdStore.token">
    Not logged in...
  </div>
  <NuxtLayout v-else name="authenticated">
    default account:
    <pre>
      {{ accountsStore.selectedAccount }}
    </pre>

    User:
    <pre>
    {{userIdStore.userIdentity}}
    </pre>
    Token:
    <pre>
    {{ userIdStore.token }}
    </pre>

    {{ `feed/account/${accountsStore.selectedAccount.accountUid}/category/${accountsStore.selectedAccount.defaultCategory}` }}

    <pre>
    {{ transactionFeedStore.feed }}
    </pre>
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

onMounted(() => {
  console.log('test')
  transactionFeedStore.fetchTransactionFeed('2025-03-03T12%3A34%3A56.000Z')
})
</script>

<style scoped>

</style>