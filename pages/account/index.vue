<template>
  <NuxtLayout name="authenticated">
  
  default account:
  <pre>
    {{ accountStore.defaultAccount }}
  </pre>

  User:
  <pre>
  {{userStore.user}}
  </pre>
  Token:
  <pre>
  {{ userStore.token }}
  </pre>

  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useAccountStore } from '@/store/account'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const accountStore = useAccountStore()

useHead({
  title: 'Account Overview'
})

onMounted(() => {
  userStore.fetchUserDetails()
})

</script>

<style scoped>

</style>