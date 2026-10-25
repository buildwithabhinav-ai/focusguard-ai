import api from "./axios";

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (): Promise<
  Notification[]
> => {
  const response = await api.get(
    "/notifications/"
  );

  return response.data;
};

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const response = await api.get(
      "/notifications/unread-count"
    );

    return response.data.unread_count;
  };

export const getLatestNotification =
  async (): Promise<Notification> => {
    const response = await api.get(
      "/notifications/latest"
    );

    return response.data;
  };

export const markNotificationAsRead =
  async (
    notificationId: number
  ) => {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  };

export const markAllNotificationsAsRead =
  async () => {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  };