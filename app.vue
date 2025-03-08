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
import { useUserStore } from './store/user'
import Notifications from './components/Notifications.vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { token } = storeToRefs(userStore)

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