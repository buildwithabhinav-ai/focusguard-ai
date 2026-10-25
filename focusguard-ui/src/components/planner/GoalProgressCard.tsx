import {
  Target,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import Skeleton from "../common/Skeleton";
import Card from "../common/Card";

import { usePlannerProgress } from "../../hooks/usePlanner";
import { useTranslation } from "../../hooks/useTranslation";

const GoalProgressCard = () => {
  const {
    data,
    isLoading,
  } = usePlannerProgress();

  const todaysGoalText =
    useTranslation("Today's Goal");

  const dailyPlannerProgressText =
    useTranslation("Daily planner progress");

  const goalText =
    useTranslation("Goal");

  const completedText =
    useTranslation("Completed");

  const progressText =
    useTranslation("Progress");

  const focusScoreText =
    useTranslation("Focus Score");

  const minText =
    useTranslation("min");

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-24 w-full rounded-2xl" />

        <Skeleton className="mt-6 h-3 w-full rounded-full" />

        <Skeleton className="mt-6 h-5 w-32" />
      </Card>
    );
  }

  const completion = Math.min(
    Math.max(
      data?.goal_completion_percentage ?? 0,
      0
    ),
    100
  );

  return (
    <Card className="h-full min-w-0">
      {/* Header */}

      <div className="mb-6 flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
          <Target
            className="text-indigo-600 dark:text-indigo-400"
            size={22}
          />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {todaysGoalText}
          </h2>

          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {dailyPlannerProgressText}
          </p>
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {goalText}
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {data?.goal_minutes ?? 0}{" "}
            {minText}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-50 p-4 dark:bg-green-950/30">
          <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-400">
            {completedText}
          </p>

          <h3 className="mt-2 text-xl font-bold text-green-700 dark:text-green-400 sm:text-2xl">
            {data?.completed_minutes ?? 0}{" "}
            {minText}
          </h3>
        </div>
      </div>

      {/* Progress */}

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {progressText}
          </span>

          <span className="shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {completion.toFixed(1)}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>
      </div>

      {/* Focus Score */}

      <div className="mt-6 flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30">
        <div className="flex min-w-0 items-center gap-3">
          <TrendingUp
            className="shrink-0 text-violet-600 dark:text-violet-400"
            size={20}
          />

          <div className="min-w-0">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {focusScoreText}
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {data?.focus_score ?? 0}%
            </h3>
          </div>
        </div>

        <CheckCircle2
          size={28}
          className="shrink-0 text-violet-600 dark:text-violet-400"
        />
      </div>
    </Card>
  );
};

export default GoalProgressCard;