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
    <div data-test="all-spaces-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll">
      <div>
        Savings Spaces
      </div>
      show savings spaces here
      create new savings space
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '@/store/userIdentity'
const userIdStore = useUserIdentityStore()

useHead({
  title: 'Savings Spaces'
})

</script>

<style scoped>

</style>