import { CheckCheck } from "lucide-react";

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../../hooks/useNotification";

import { useTranslation } from "../../hooks/useTranslation";

import TranslatedText from "./TranslatedText";

interface Props {
  onClose: () => void;
}

const NotificationDropdown = ({
  onClose,
}: Props) => {
  const {
    data,
    isLoading,
    isError,
  } = useNotifications();

  const markRead =
    useMarkNotificationAsRead();

  const markAll =
    useMarkAllNotificationsAsRead();

  const unreadText = useTranslation("unread");

  const notificationsText = useTranslation(
    "Notifications"
  );

  const updatingText = useTranslation(
    "Updating..."
  );

  const markAllText = useTranslation(
    "Mark all"
  );

  const loadingText = useTranslation(
    "Loading notifications..."
  );

  const unableToLoadText = useTranslation(
    "Unable to load notifications."
  );

  const noNotificationsText = useTranslation(
    "No notifications."
  );

  const unreadCount =
    data?.filter(
      (notification) =>
        !notification.is_read
    ).length ?? 0;

  const handleNotificationClick = (
    notificationId: number
  ) => {
    markRead.mutate(notificationId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleMarkAll = () => {
    if (unreadCount === 0) {
      return;
    }

    markAll.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div
      className="
        absolute right-0 top-full z-[100] mt-3
        w-[min(380px,calc(100vw-2rem))]
        overflow-hidden rounded-2xl
        border border-slate-200 bg-white
        text-slate-900 shadow-xl
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-100
      "
    >
      {/* --------------------------------------------- */}
      {/* Header */}
      {/* --------------------------------------------- */}

      <div
        className="
          flex items-center justify-between gap-3
          border-b border-slate-200 p-4
          dark:border-slate-700
          sm:p-5
        "
      >
        <div>
          <h2
            className="
              text-lg font-bold
              text-slate-900
              dark:text-white
            "
          >
            {notificationsText}
          </h2>

          {unreadCount > 0 && (
            <p
              className="
                mt-1 text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {unreadCount} {unreadText}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          disabled={
            markAll.isPending ||
            unreadCount === 0
          }
          className="
            flex shrink-0 items-center gap-2
            rounded-lg px-2 py-1 text-sm
            font-medium text-indigo-600
            transition
            hover:bg-indigo-50
            hover:text-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:text-indigo-400
            dark:hover:bg-indigo-950/50
            dark:hover:text-indigo-300
          "
        >
          <CheckCheck size={17} />

          {markAll.isPending
            ? updatingText
            : markAllText}
        </button>
      </div>

      {/* --------------------------------------------- */}
      {/* Notification List */}
      {/* --------------------------------------------- */}

      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div
            className="
              p-6 text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {loadingText}
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="
              p-6 text-center text-sm
              text-red-500
              dark:text-red-400
            "
          >
            {unableToLoadText}
          </div>
        )}

        {!isLoading &&
          !isError &&
          data?.length === 0 && (
            <div
              className="
                p-8 text-center text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {noNotificationsText}
            </div>
          )}

        {!isLoading &&
          !isError &&
          data?.map((notification) => (
            <button
              type="button"
              key={notification.id}
              onClick={() =>
                handleNotificationClick(
                  notification.id
                )
              }
              disabled={
                markRead.isPending &&
                markRead.variables ===
                  notification.id
              }
              className={`
                block w-full
                border-b border-slate-100
                p-4 text-left transition
                hover:bg-slate-50
                dark:border-slate-800
                dark:hover:bg-slate-800

                ${
                  notification.is_read
                    ? "bg-white dark:bg-slate-900"
                    : "bg-indigo-50 dark:bg-indigo-950/40"
                }
              `}
            >
              <div className="flex items-start gap-3">
                {!notification.is_read && (
                  <span
                    className="
                      mt-1.5 h-2 w-2 shrink-0
                      rounded-full bg-indigo-600
                      dark:bg-indigo-400
                    "
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-slate-100
                    "
                  >
                    <TranslatedText text={notification.title} />
                  </h3>

                  <p
                    className="
                      mt-2 text-sm leading-5
                      text-slate-600
                      dark:text-slate-300
                    "
                  >
                    <TranslatedText text={notification.message} />
                  </p>

                  <p
                    className="
                      mt-3 text-xs
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;