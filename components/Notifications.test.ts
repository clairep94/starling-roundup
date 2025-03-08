import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useNotificationsStore } from '../store/notifications'
import Notifications from '../components/Notifications.vue'

const PieToastStub = {
  template: `<div class="pie-toast" :data-test="$attrs['data-test']" @click="$emit('pie-toast-close', id)">
    <slot />
  </div>`,
  props: ['id', 'variant', 'message', 'isMultiline', 'isDismissible', 'duration'],
}

function notificationsFactory(): VueWrapper<any> {
  return shallowMount(Notifications, {
    global: {
      plugins: [createTestingPinia({stubActions: false})]
    },
    stubs: {
      'pie-toast': PieToastStub,
    },
  })
}

describe('Notifications component', () => {
  let wrapper: VueWrapper<any>
  let notificationsStore: ReturnType<typeof useNotificationsStore>

  describe('and when there are no notifications', () => {
    beforeEach(async() => {
      wrapper = notificationsFactory()
      notificationsStore = useNotificationsStore()
      notificationsStore.notifications = []
      await wrapper.vm.$nextTick()
    })
    it('should not render the notifications component', () => {
      const notificationsComponent = wrapper.find('[data-test="notifications"]')
      expect(notificationsComponent.exists()).toBeFalsy()
    })
  })

  describe('and when there are notifications', () => {
    let notif1
    let notif2

    beforeEach(async() => {
      wrapper = notificationsFactory()
      notificationsStore = useNotificationsStore()
      notificationsStore.notifications = [
        { id: 1, heading: 'Test 1', message: 'Message 1', variant: 'success' },
        { id: 2, heading: 'Test 2', message: 'Message 2', variant: 'error' },
      ]
      await wrapper.vm.$nextTick()
      notif1 = wrapper.find('[data-test="notification-1"]')
      notif2 = wrapper.find('[data-test="notification-2"]')
    })
    it('should render the notifications', () => {
      expect(notif1.exists()).toBe(true)
      expect(notif2.exists()).toBe(true)
    })

    it('should remove a notification when deleteNotification is called', async () => {
      await wrapper.vm.deleteNotification({ id: 1, heading: 'Test 1', message: 'Message 1', variant: 'success' })
      expect(notificationsStore.notifications.length).toBe(1)
    })
  })
})
