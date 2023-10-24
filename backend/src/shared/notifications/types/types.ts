export interface INotification {
  notification_id: number;
  agent_user_id: number;
  action: string;
  table: string;
  old_data: string;
  new_data: string;
  object_user_id: string;
  notification_type: number;
  created_at: Date;
  updated_at: Date;
}

//reescreva a ICreateNotification abaixo com padrão camelcase

export interface ICreateNotification
  extends Omit<INotificationData, 'agent_name'> {
  notificationText: string;
  sent: boolean;
  read: boolean;
  notifiedUserIds: number[];
}

export interface INotificationData {
  agentUserId: number;
  agent_name: string;
  notificationType: number;
  action: string;
  table: string | null;
  oldData: object | null;
  newData: object | null;
  objectUserId: number | null;
}

export interface IUpdateCourse {
  course_id: number;
  course_area: string;
  institution: string;
  begin_date: Date;
  conclusion_date: Date | null;
  person_id: number;
  course_approved: boolean | null;
}
