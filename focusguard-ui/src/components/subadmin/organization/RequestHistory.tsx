import {
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  useDeactivationRequests,
} from "../../../hooks/useOrganization";

import { useTranslation } from "../../../hooks/useTranslation";

const RequestHistory = () => {
  const {
    data,
    isLoading,
  } = useDeactivationRequests();

  const noRequestsText =
    useTranslation("No Requests");

  const noRequestsDescriptionText =
    useTranslation(
      "You haven't submitted any organization deactivation requests."
    );

  const requestHistoryText =
    useTranslation("Request History");

  const previousRequestsText =
    useTranslation(
      "Previous organization deactivation requests"
    );

  const requestedOnText =
    useTranslation("Requested on");

  const approvedText =
    useTranslation("Approved");

  const rejectedText =
    useTranslation("Rejected");

  const pendingText =
    useTranslation("Pending");

  /* =====================================================
      LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900

          sm:rounded-3xl
          sm:p-6
        "
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />

          <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  /* =====================================================
      EMPTY
  ===================================================== */

  if (!data || data.length === 0) {
    return (
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900

          sm:rounded-3xl
          sm:p-6
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-900
            dark:text-slate-100

            sm:text-2xl
          "
        >
          {noRequestsText}
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400

            sm:text-base
          "
        >
          {noRequestsDescriptionText}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-900

        sm:rounded-3xl
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          border-b
          border-slate-200
          p-5
          dark:border-slate-700

          sm:p-6
        "
      >
        <h2
          className="
            text-xl
            font-bold
            text-slate-900
            dark:text-slate-100

            sm:text-2xl
          "
        >
          {requestHistoryText}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {previousRequestsText}
        </p>
      </div>

      {/* =================================================
          REQUESTS
      ================================================= */}

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {data.map((request) => {
          const badge =
            request.status === "APPROVED"
              ? {
                  icon: CheckCircle2,
                  className:
                    "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300",
                  label: approvedText,
                }
              : request.status === "REJECTED"
              ? {
                  icon: XCircle,
                  className:
                    "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
                  label: rejectedText,
                }
              : {
                  icon: Clock3,
                  className:
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
                  label: pendingText,
                };

          const Icon = badge.icon;

          return (
            <div
              key={request.id}
              className="
                flex
                min-w-0
                flex-col
                gap-4
                p-5

                sm:p-6

                md:flex-row
                md:items-center
                md:justify-between
                md:gap-6
              "
            >
              {/* Request information */}

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    break-words
                    text-sm
                    font-semibold
                    leading-6
                    text-slate-900
                    dark:text-slate-100

                    sm:text-base
                  "
                >
                  {request.reason}
                </h3>

                <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {requestedOnText}{" "}
                  {new Date(
                    request.requested_at
                  ).toLocaleString()}
                </p>
              </div>

              {/* Status */}

              <span
                className={`
                  inline-flex
                  w-fit
                  shrink-0
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  py-2
                  text-xs
                  font-semibold

                  sm:px-4
                  sm:text-sm

                  ${badge.className}
                `}
              >
                <Icon size={16} />

                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestHistory;