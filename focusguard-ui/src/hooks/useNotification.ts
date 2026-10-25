import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  getLatestNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notification.api";

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 30000,
  });

export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000,
  });

export const useLatestNotification = () =>
  useQuery({
    queryKey: ["latest-notification"],
    queryFn: getLatestNotification,
    refetchInterval: 30000,
  });


// -----------------------------------------------------
// Mark One Notification As Read
// -----------------------------------------------------

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onMutate: async (notificationId: number) => {
      // Stop an old request from overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      await queryClient.cancelQueries({
        queryKey: ["notifications-unread-count"],
      });

      // Save previous data in case the request fails
      const previousNotifications =
        queryClient.getQueryData<any[]>([
          "notifications",
        ]);

      const previousUnreadCount =
        queryClient.getQueryData<number>([
          "notifications-unread-count",
        ]);

      // Immediately mark notification as read in UI
      queryClient.setQueryData<any[]>(
        ["notifications"],
        (oldNotifications) => {
          if (!oldNotifications) {
            return oldNotifications;
          }

          return oldNotifications.map(
            (notification) =>
              notification.id === notificationId
                ? {
                    ...notification,
                    is_read: true,
                  }
                : notification
          );
        }
      );

      // Immediately decrease unread badge
      queryClient.setQueryData<number>(
        ["notifications-unread-count"],
        (oldCount) => {
          if (!oldCount || oldCount <= 0) {
            return 0;
          }

          return oldCount - 1;
        }
      );

      return {
        previousNotifications,
        previousUnreadCount,
      };
    },

    onError: (
      _error,
      _notificationId,
      context
    ) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }

      if (
        context?.previousUnreadCount !== undefined
      ) {
        queryClient.setQueryData(
          ["notifications-unread-count"],
          context.previousUnreadCount
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latest-notification"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latest-notification"],
      });
    },
  });
};


// -----------------------------------------------------
// Mark All Notifications As Read
// -----------------------------------------------------

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      await queryClient.cancelQueries({
        queryKey: ["notifications-unread-count"],
      });

      const previousNotifications =
        queryClient.getQueryData<any[]>([
          "notifications",
        ]);

      const previousUnreadCount =
        queryClient.getQueryData<number>([
          "notifications-unread-count",
        ]);

      // Immediately mark everything as read
      queryClient.setQueryData<any[]>(
        ["notifications"],
        (oldNotifications) => {
          if (!oldNotifications) {
            return oldNotifications;
          }

          return oldNotifications.map(
            (notification) => ({
              ...notification,
              is_read: true,
            })
          );
        }
      );

      // Immediately remove badge
      queryClient.setQueryData<number>(
        ["notifications-unread-count"],
        0
      );

      return {
        previousNotifications,
        previousUnreadCount,
      };
    },

    onError: (
      _error,
      _variables,
      context
    ) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }

      if (
        context?.previousUnreadCount !== undefined
      ) {
        queryClient.setQueryData(
          ["notifications-unread-count"],
          context.previousUnreadCount
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latest-notification"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });

      queryClient.invalidateQueries({
        queryKey: ["latest-notification"],
      });
    },
  });
};