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

    <!-- CREATE A SAVINGS SPACE MAIN -->
    <div data-test="create-space-main" class="flex flex-col flex-grow px-6 py-4 md:px-8 md:py-6 overflow-scroll bg-gray-50 min-h-full gap-3">
      <!-- CREATE A SAVINGS SPACE FORM -->
      <CreateSavingsGoalForm data-test="create-space-form"/>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useUserIdentityStore } from '../../store/userIdentity'
import CreateSavingsGoalForm from '../../components/CreateSavingsGoalForm.vue'

const userIdStore = useUserIdentityStore()

useHead({
  title: 'Create Savings Space'
})
</script>

<style scoped>

</style>