<template>
  <div v-if="!userIdStore.token" data-test="redirecting-to-login" class="flex flex-col items-center justify-center h-screen">
    Redirecting to login page...
  </div>
  <NuxtLayout v-else name="authenticated"
    pageTitle="Spaces"
    :subPages="[
      { title: 'Transaction Feed', path: '/' },
      { title: 'Round Up', path: '/round-up' }
    ]">

    <!-- Round Up -->
    <div data-test="create-space-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll">
      <div>
        Transfer roundup
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '@/store/userIdentity'
const userIdStore = useUserIdentityStore()

useHead({
  title: 'Transfer Roundup'
})

</script>

<style scoped>

</style>