import {ref} from 'vue'
import { defineStore } from 'pinia'
import type { Notification } from '../types/notification.type'

export const notificationTimeout = 5000

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Notification) {
    const id = Date.now() //number in unix time
    notifications.value.push({...notification, id: id})
    setTimeout(() => {
      removeNotification(id);
    }, notificationTimeout);
  } 
  function addError(ofetchError: string){
    addNotification({
      variant: "error",
      message: ofetchError
    })
  }
  function removeNotification(id: number) {
    notifications.value = [...notifications.value.filter(item => item.id !== id)];
  }
  function clearNotifications() {
    notifications.value = []
  }
  return { notifications, addNotification, removeNotification, clearNotifications, addError }
})