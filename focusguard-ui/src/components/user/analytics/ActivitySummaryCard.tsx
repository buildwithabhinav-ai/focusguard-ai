import {
  Timer,
  Moon,
  Target,
} from "lucide-react";

import {
  useActivitySummary,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const ActivitySummaryCard = () => {
  const {
    data,
    isLoading,
  } = useActivitySummary();

  const activitySummary = useTranslation("Activity Summary");
  const activeTime = useTranslation("Active Time");
  const idleTime = useTranslation("Idle Time");
  const focusScore = useTranslation("Focus Score");

  if (isLoading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
        "
      >
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-700 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          {activitySummary}
        </h2>
      </div>

      <div className="grid gap-4 p-5 sm:gap-6 sm:p-6 md:grid-cols-3">
        {/* Active */}
        <div
          className="
            rounded-2xl
            border
            border-green-100
            bg-green-50
            p-5

            dark:border-green-900/40
            dark:bg-green-950/30
          "
        >
          <div className="mb-3 flex items-center gap-2">
            <Timer
              size={20}
              className="shrink-0 text-green-600 dark:text-green-400"
            />

            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activeTime}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {formatTime(data.active_time_seconds)}
          </h3>
        </div>

        {/* Idle */}
        <div
          className="
            rounded-2xl
            border
            border-yellow-100
            bg-yellow-50
            p-5

            dark:border-yellow-900/40
            dark:bg-yellow-950/30
          "
        >
          <div className="mb-3 flex items-center gap-2">
            <Moon
              size={20}
              className="shrink-0 text-yellow-600 dark:text-yellow-400"
            />

            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {idleTime}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {formatTime(data.idle_time_seconds)}
          </h3>
        </div>

        {/* Focus */}
        <div
          className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-5

            dark:border-indigo-900/40
            dark:bg-indigo-950/30
          "
        >
          <div className="mb-3 flex items-center gap-2">
            <Target
              size={20}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {focusScore}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 sm:text-3xl">
            {data.focus_score}%
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummaryCard;