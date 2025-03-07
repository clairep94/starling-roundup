<template>
  <div
    v-if="notifications.length > 0"
    data-test="notifications"
    class="fixed flex flex-col-reverse items-start bg-transparent
    left-7 bottom-7 z-[500] 
    "
  >
  <div class="flex flex-col-reverse items-end h-full overflow-y-auto">
    <pie-toast
      v-for="notification in notifications"
      :key="notification.id"
      :data-test="`notification-${notification.id}`"
      :variant="notification.variant"
      :message="notification.message"
      :isMultiline="true"
      class="mt-1 min-w-full shadow-card"
      :isDismissible="true"
      :duration="notificationTimeout"
      @pie-toast-close="notificationsStore.removeNotification(notification.id)"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import '@justeattakeaway/pie-webc/components/toast.js';
import { useNotificationsStore, notificationTimeout } from '~/store/notifications'
import type { Notification } from '~/types/Notification.type'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)
</script>

<style scoped>
</style>