export type Notification = {
  id?: number,
  variant: 'success' | 'error' | 'neutral',
  isDismissible?: boolean,
  message: string
}