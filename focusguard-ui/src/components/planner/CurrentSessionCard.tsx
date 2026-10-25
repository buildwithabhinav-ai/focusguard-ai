import {
  Clock3,
  Timer,
} from "lucide-react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import { useCurrentSession } from "../../hooks/usePlanner";
import { useTranslation } from "../../hooks/useTranslation";

const formatTime = (time: string) => {
  if (!time) return "--";

  const [hour, minute] = time.split(":");

  const h = Number(hour);

  const suffix = h >= 12 ? "PM" : "AM";

  const formattedHour =
    h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour}:${minute} ${suffix}`;
};

/* =========================================================
   Dynamic translated category
========================================================= */

const TranslatedCategory = ({
  category,
}: {
  category: string;
}) => {
  const translatedCategory =
    useTranslation(category);

  return <>{translatedCategory}</>;
};

const CurrentSessionCard = () => {
  const {
    data,
    isLoading,
  } = useCurrentSession();

  const currentSessionText =
    useTranslation("Current Session");

  const activePlannerSessionText =
    useTranslation("Active planner session");

  const noActiveSessionText =
    useTranslation("No active session");

  const categoryText =
    useTranslation("Category");

  const sessionTimeText =
    useTranslation("Session Time");

  const remainingText =
    useTranslation("Remaining");

  const minText =
    useTranslation("min");

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-20 w-full rounded-2xl" />

        <Skeleton className="mt-6 h-5 w-32" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="flex h-full min-h-[250px] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {noActiveSessionText}
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full min-w-0">
      {/* Header */}

      <div className="mb-6 flex min-w-0 items-center gap-3">
        <div className="shrink-0 rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/50">
          <Clock3
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {currentSessionText}
          </h2>

          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {activePlannerSessionText}
          </p>
        </div>
      </div>

      {/* Category */}

      <div className="min-w-0 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {categoryText}
        </p>

        <h3 className="mt-2 break-words text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          <TranslatedCategory
            category={data.category}
          />
        </h3>
      </div>

      {/* Time */}

      <div className="mt-5 flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {sessionTimeText}
          </p>

          <h4 className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
            {formatTime(data.start_time)} -{" "}
            {formatTime(data.end_time)}
          </h4>
        </div>

        <Clock3
          size={24}
          className="shrink-0 text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Remaining */}

      <div className="mt-5 flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {remainingText}
          </p>

          <h4 className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400 sm:text-xl">
            {Math.round(
              data.remaining_minutes
            )}{" "}
            {minText}
          </h4>
        </div>

        <Timer
          size={24}
          className="shrink-0 text-amber-600 dark:text-amber-400"
        />
      </div>
    </Card>
  );
};

export default CurrentSessionCard;