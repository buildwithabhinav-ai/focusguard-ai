import {
  Clock3,
  PlayCircle,
} from "lucide-react";

import {
  useCurrentSession,
} from "../../../hooks/usePlanner";

import { useTranslation } from "../../../hooks/useTranslation";

const CurrentSessionCard = () => {
  const {
    data,
    isLoading,
  } = useCurrentSession();

  const loadingText = useTranslation(
    "Loading current session..."
  );

  const title = useTranslation(
    "Current Session"
  );

  const noSession = useTranslation(
    "No active session."
  );

  const currentCategory = useTranslation(
    "Current Category"
  );

  const remainingTime = useTranslation(
    "Remaining Time"
  );

  const minText = useTranslation("min");

  const translatedCategory =
    useTranslation(data?.category || "");

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
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {noSession}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 dark:border-slate-700 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          <PlayCircle
            size={22}
            className="text-green-600 dark:text-green-400"
          />

          {title}
        </h2>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {currentCategory}
          </p>

          <h3 className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-white">
            {translatedCategory}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Clock3 size={18} />

          <span>{data.start_time}</span>

          <span>→</span>

          <span>{data.end_time}</span>
        </div>

        <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {remainingTime}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-indigo-700 dark:text-indigo-400">
            {data.remaining_minutes} {minText}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CurrentSessionCard;