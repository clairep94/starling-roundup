<template>
  <Notifications />
  <div class="w-full min-h-screen h-screen bg-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { useUserIdentityStore } from './store/userIdentity'
import Notifications from './components/Notifications.vue'
import { storeToRefs } from 'pinia'
import { navigateTo } from 'nuxt/app'

const userIdStore = useUserIdentityStore()
const { token } = storeToRefs(userIdStore)

onBeforeMount(() => {
  if (!token.value) {
    navigateTo('/login')
  }
})

watch(token, (newToken) => {
  if (!newToken) {
    navigateTo('/login')
  }
})
</script>