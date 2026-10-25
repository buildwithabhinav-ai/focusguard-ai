import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Globe,
  FolderOpen,
} from "lucide-react";

import {
  useLiveStatus,
} from "../../../hooks/usePlanner";

import { useTranslation } from "../../../hooks/useTranslation";

const LiveStatusWidget = () => {
  const {
    data,
    isLoading,
  } = useLiveStatus();

  const loadingText = useTranslation(
    "Loading live status..."
  );

  const unavailableText = useTranslation(
    "Live status unavailable."
  );

  const title = useTranslation(
    "Live Focus Status"
  );

  const plannedCategory = useTranslation(
    "Planned Category"
  );

  const currentCategory = useTranslation(
    "Current Category"
  );

  const currentWebsite = useTranslation(
    "Current Website"
  );

  const statusText = useTranslation(
    data?.status
      ? data.status.replace("_", " ")
      : ""
  );

  const messageText = useTranslation(
    data?.message || ""
  );

  const translatedPlannedCategory =
    useTranslation(
      data?.planned_category || ""
    );

  const translatedCurrentCategory =
    useTranslation(
      data?.current_category || ""
    );

  if (isLoading) {
    return (
      <div
        className="
          min-w-0
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          text-sm
          text-slate-500

          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-400

          sm:p-6
        "
      >
        {loadingText}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="
          min-w-0
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          text-sm
          text-slate-500

          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-400

          sm:p-6
        "
      >
        {unavailableText}
      </div>
    );
  }

  const isOnTrack =
    data.status === "ON_TRACK";

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-700 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          <Activity
            size={22}
            className="shrink-0 text-indigo-600 dark:text-indigo-400"
          />

          {title}
        </h2>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div
          className={`flex items-start gap-3 rounded-2xl p-4 ${
            isOnTrack
              ? `
                bg-green-50
                dark:border
                dark:border-green-900/40
                dark:bg-green-950/40
              `
              : `
                bg-red-50
                dark:border
                dark:border-red-900/40
                dark:bg-red-950/40
              `
          }`}
        >
          {isOnTrack ? (
            <CheckCircle2
              size={24}
              className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
            />
          ) : (
            <AlertTriangle
              size={24}
              className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
            />
          )}

          <div className="min-w-0">
            <h3
              className={`font-semibold ${
                isOnTrack
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {statusText}
            </h3>

            <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
              {messageText}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FolderOpen
            size={20}
            className="mt-1 shrink-0 text-indigo-600 dark:text-indigo-400"
          />

          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {plannedCategory}
            </p>

            <h3 className="mt-1 break-words font-semibold text-slate-900 dark:text-slate-100">
              {translatedPlannedCategory || "-"}
            </h3>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FolderOpen
            size={20}
            className="mt-1 shrink-0 text-green-600 dark:text-green-400"
          />

          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentCategory}
            </p>

            <h3 className="mt-1 break-words font-semibold text-slate-900 dark:text-slate-100">
              {translatedCurrentCategory || "-"}
            </h3>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe
            size={20}
            className="mt-1 shrink-0 text-blue-600 dark:text-blue-400"
          />

          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentWebsite}
            </p>

            <h3 className="break-all font-semibold text-slate-900 dark:text-slate-100">
              {data.website || "-"}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusWidget;