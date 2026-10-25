import {
  Activity,
  Clock3,
  Moon,
  Monitor,
} from "lucide-react";

import Card from "../common/Card";

import {
  useActivitySummary,
} from "../../hooks/useAnalytics";

import { formatDuration } from "../../utils/time";

import { useTranslation } from "../../hooks/useTranslation";

const ProgressBar = ({
  value,
  color,
}: {
  value: number;
  color: string;
}) => (
  <div
    className="
      mt-2
      h-2
      w-full
      overflow-hidden
      rounded-full
      bg-slate-100

      dark:bg-slate-800
    "
  >
    <div
      className={`h-full rounded-full transition-all duration-500 ${color}`}
      style={{
        width: `${Math.min(
          Math.max(value, 0),
          100
        )}%`,
      }}
    />
  </div>
);

const ActivitySummary = () => {
  const {
    data,
    isLoading,
    isError,
  } = useActivitySummary();

  const loadingText = useTranslation("Loading Activity...");
  const errorText = useTranslation("Unable to load activity data.");
  const title = useTranslation("Activity Summary");
  const description = useTranslation(
    "Overview of your productivity and activity"
  );
  const browserTimeText = useTranslation("Browser Time");
  const activeTimeText = useTranslation("Active Time");
  const idleTimeText = useTranslation("Idle Time");
  const focusScoreText = useTranslation("Focus Score");
  const activePercentText = useTranslation("Active %");
  const idlePercentText = useTranslation("Idle %");

  if (isLoading) {
    return (
      <Card
        className="
          border
          border-slate-200
          bg-white

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loadingText}
          </p>
        </div>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card
        className="
          border
          border-slate-200
          bg-white

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="flex min-h-[180px] items-center justify-center text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {errorText}
          </p>
        </div>
      </Card>
    );
  }

  const browserTime =
    data.browser_time_seconds || 0;

  const activeTime =
    data.active_time_seconds || 0;

  const idleTime =
    data.idle_time_seconds || 0;

  const activePercent =
    browserTime > 0
      ? (activeTime / browserTime) * 100
      : 0;

  const idlePercent =
    browserTime > 0
      ? (idleTime / browserTime) * 100
      : 0;

  const focusScore = Math.min(
    Math.max(data.focus_score || 0, 0),
    100
  );

  return (
    <Card
      className="
        min-w-0
        border
        border-slate-200
        bg-white

        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Browser */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <Monitor
                size={18}
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <span className="font-medium text-slate-700 dark:text-slate-300">
                {browserTimeText}
              </span>
            </div>

            <span className="font-semibold text-slate-900 dark:text-white">
              {formatDuration(browserTime)}
            </span>
          </div>
        </div>

        {/* Active */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <Activity
                size={18}
                className="shrink-0 text-green-600 dark:text-green-400"
              />

              <span className="font-medium text-slate-700 dark:text-slate-300">
                {activeTimeText}
              </span>
            </div>

            <span className="font-semibold text-slate-900 dark:text-white">
              {formatDuration(activeTime)}
            </span>
          </div>

          <ProgressBar
            value={activePercent}
            color="bg-green-500"
          />
        </div>

        {/* Idle */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <Moon
                size={18}
                className="shrink-0 text-orange-500 dark:text-orange-400"
              />

              <span className="font-medium text-slate-700 dark:text-slate-300">
                {idleTimeText}
              </span>
            </div>

            <span className="font-semibold text-slate-900 dark:text-white">
              {formatDuration(idleTime)}
            </span>
          </div>

          <ProgressBar
            value={idlePercent}
            color="bg-orange-500"
          />
        </div>

        {/* Focus */}
        <div
          className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-4

            dark:border-indigo-900/50
            dark:bg-indigo-950/40

            sm:p-5
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {focusScoreText}
            </span>

            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 sm:text-3xl">
              {focusScore.toFixed(2)}%
            </span>
          </div>

          <ProgressBar
            value={focusScore}
            color="bg-indigo-600 dark:bg-indigo-500"
          />
        </div>

        {/* Percentages */}
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              p-4
              text-center

              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            <Clock3
              className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400"
              size={20}
            />

            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {activePercentText}
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {activePercent.toFixed(1)}%
            </h3>
          </div>

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-100
              p-4
              text-center

              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            <Clock3
              className="mx-auto mb-2 text-orange-500 dark:text-orange-400"
              size={20}
            />

            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {idlePercentText}
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {idlePercent.toFixed(1)}%
            </h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivitySummary;
