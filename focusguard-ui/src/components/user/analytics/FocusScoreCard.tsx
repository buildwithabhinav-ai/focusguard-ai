import {
  Target,
  TrendingUp,
} from "lucide-react";

import {
  useActivitySummary,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

const FocusScoreCard = () => {
  const {
    data,
    isLoading,
  } = useActivitySummary();

  const focusScoreTitle = useTranslation("Focus Score");
  const productivityFocus = useTranslation(
    "Your productivity focus"
  );
  const focus = useTranslation("focus");
  const overallProductivity = useTranslation(
    "Overall productivity"
  );
  const excellent = useTranslation("Excellent");
  const good = useTranslation("Good");
  const needsFocus = useTranslation("Needs Focus");
  const lowFocus = useTranslation("Low Focus");

  if (isLoading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20

          sm:p-6
        "
      >
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-5 h-10 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const focusScore = Math.min(
    Math.max(
      Number(data.focus_score ?? 0),
      0
    ),
    100
  );

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20

        sm:p-6
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-indigo-100

              dark:bg-indigo-950/40
            "
          >
            <Target
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              {focusScoreTitle}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {productivityFocus}
            </p>
          </div>
        </div>

        <TrendingUp
          size={20}
          className="shrink-0 text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Score */}

      <div className="mt-6 flex items-end gap-2">
        <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          {focusScore.toFixed(1)}%
        </h3>

        <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">
          {focus}
        </span>
      </div>

      {/* Progress */}

      <div className="mt-5">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
            style={{
              width: `${focusScore}%`,
            }}
          />
        </div>
      </div>

      {/* Status */}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          {overallProductivity}
        </span>

        <span
          className="
            w-fit
            rounded-full
            bg-indigo-50
            px-3
            py-1
            text-xs
            font-semibold
            text-indigo-700

            dark:bg-indigo-950/50
            dark:text-indigo-400
          "
        >
          {focusScore >= 80
            ? excellent
            : focusScore >= 60
            ? good
            : focusScore >= 40
            ? needsFocus
            : lowFocus}
        </span>
      </div>
    </div>
  );
};

export default FocusScoreCard;