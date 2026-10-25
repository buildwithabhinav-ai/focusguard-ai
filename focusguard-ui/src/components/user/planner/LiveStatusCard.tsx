import {
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  useLiveStatus,
} from "../../../hooks/usePlanner";

import { useTranslation } from "../../../hooks/useTranslation";

const LiveStatusCard = () => {
  const {
    data,
    isLoading,
  } = useLiveStatus();

  const loadingText = useTranslation(
    "Loading live status..."
  );

  const title = useTranslation(
    "Live Status"
  );

  const noStatus = useTranslation(
    "No live status available."
  );

  const plannedCategory = useTranslation(
    "Planned Category"
  );

  const currentCategory = useTranslation(
    "Current Category"
  );

  const website = useTranslation(
    "Website"
  );

  const statusText = useTranslation(
    data?.status
      ? data.status.replace("_", " ")
      : ""
  );

  const translatedPlannedCategory =
    useTranslation(
      data?.planned_category || ""
    );

  const translatedCurrentCategory =
    useTranslation(
      data?.current_category || ""
    );

  const messageText = useTranslation(
    data?.message || ""
  );

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loadingText}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {noStatus}
        </p>
      </div>
    );
  }

  const onTrack =
    data.status === "ON_TRACK";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 dark:border-slate-700 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          <Activity
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />

          {title}
        </h2>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div
          className={`flex items-start gap-3 rounded-2xl p-4 ${
            onTrack
              ? "bg-green-100 dark:bg-green-950/40"
              : "bg-red-100 dark:bg-red-950/40"
          }`}
        >
          {onTrack ? (
            <CheckCircle2
              size={22}
              className="text-green-700 dark:text-green-400"
            />
          ) : (
            <AlertTriangle
              size={22}
              className="text-red-700 dark:text-red-400"
            />
          )}

          <span
            className={`font-semibold ${
              onTrack
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {statusText}
          </span>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {plannedCategory}
          </p>

          <h3 className="mt-1 break-words font-semibold text-slate-900 dark:text-white">
            {translatedPlannedCategory || "-"}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {currentCategory}
          </p>

          <h3 className="mt-1 break-words font-semibold text-slate-900 dark:text-white">
            {translatedCurrentCategory || "-"}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {website}
          </p>

          <h3 className="mt-1 break-all font-semibold text-slate-900 dark:text-white">
            {data.website || "-"}
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {messageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusCard;