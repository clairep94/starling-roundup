<template>
  <NuxtLayout name="authenticated">
    <div>
      Account Overview
      <p>
        Accounts:
      </p> 
      <pre>
        {{ accountStore.accounts }}
      </pre>
  
      default account:
      <pre>
        {{ accountStore.defaultAccount }}
      </pre>
      {{userStore.user}}
      {{ userStore.token }}
    </div>
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