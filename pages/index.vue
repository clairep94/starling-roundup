<template>
  <NuxtLayout name="authenticated">
  
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

  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserIdentityStore } from '@/store/userIdentity'
import { useAccountsStore } from '@/store/accounts'
import { useRouter } from 'vue-router'

const userIdStore = useUserIdentityStore()
const accountsStore = useAccountsStore()

useHead({
  title: 'Account Overview'
})

onMounted(() => {
  // console.log("fetch transactions list")
  // console.log("endpoint:", `feed/account/${accountsStore.defaultAccount.accountUid}/category/${accountsStore.defaultAccount.defaultCategory}`)
  // console.log("current date:", "todo!") //todo
})
</script>

<style scoped>

</style>