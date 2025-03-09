<template>
  <Notifications />
  <div class="w-full min-h-screen bg-home-peach">
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