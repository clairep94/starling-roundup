import { describe, beforeEach, it, expect, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationsStore, notificationTimeout } from './notifications';

describe('Notification Store', () => {
  let notificationsStore: any;
  const notificationSuccess = { message: 'Success notification', variant: 'success' };
  const notificationError = { message: 'Error notification', variant: 'error' };

  beforeEach(() => {
    setActivePinia(createPinia());
    notificationsStore = useNotificationsStore();
    vi.useFakeTimers();

    vi.setSystemTime(123456789000);  
  });

  it('addNotification should add a notification to the store with a mocked uuid', () => {
    notificationsStore.addNotification(notificationSuccess);

    vi.advanceTimersByTime(1);
    notificationsStore.addNotification(notificationError);

    expect(notificationsStore.notifications).toHaveLength(2);
    expect(notificationsStore.notifications[0]).toEqual({
      ...notificationSuccess,
      id: 123456789000,
    });
    expect(notificationsStore.notifications[1]).toEqual({
      ...notificationError,
      id: 123456789001,
    });  
  });

  it('should auto remove a notification after the timeout', () => {
    notificationsStore.addNotification(notificationSuccess);
    expect(notificationsStore.notifications).toHaveLength(1);

    vi.advanceTimersByTime(notificationTimeout);

    expect(notificationsStore.notifications).toHaveLength(0);
  });

  it('removeNotification should remove a notification from the store', () => {
    notificationsStore.addNotification(notificationSuccess); // notification id will be 123456789000
    notificationsStore.removeNotification(123456789000);

    expect(notificationsStore.notifications).toHaveLength(0);
  });

  it('clearNotifications should remove all notifications from the store', () => {
    notificationsStore.addNotification(notificationSuccess);
    vi.advanceTimersByTime(1);
    notificationsStore.addNotification(notificationError);

    notificationsStore.clearNotifications();
    expect(notificationsStore.notifications).toHaveLength(0);
  });

  it('addError should add an error notification to the store', () => {
    notificationsStore.addError('Error message');
    expect(notificationsStore.notifications).toHaveLength(1);
    expect(notificationsStore.notifications[0]).toEqual({
      variant: 'error',
      message: 'Error message',
      id: 123456789000,
    });
  })
});