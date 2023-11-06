export interface IUserNotification {
  user_notification_id: number
  notification_text: string
  notified_user_id: number
  sent: boolean
  read: boolean
  created_at: Date
  updated_at: Date
  notification_id: number
  notification_type: number
}
