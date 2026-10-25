import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Globe,
} from "lucide-react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import { useLiveStatus } from "../../hooks/usePlanner";
import { useTranslation } from "../../hooks/useTranslation";

/* =========================================================
   Dynamic translated text
========================================================= */

const TranslatedText = ({
  text,
}: {
  text: string;
}) => {
  const translatedText = useTranslation(text);

  return <>{translatedText}</>;
};

const LiveStatusCard = () => {
  const {
    data,
    isLoading,
  } = useLiveStatus();

  const liveFocusText =
    useTranslation("Live Focus");

  const realTimeFocusTrackingText =
    useTranslation("Real-time focus tracking");

  const liveStatusUnavailableText =
    useTranslation("Live status unavailable");

  const statusText =
    useTranslation("Status");

  const plannedText =
    useTranslation("Planned");

  const currentText =
    useTranslation("Current");

  const websiteText =
    useTranslation("Website");

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-28 w-full rounded-2xl" />

        <Skeleton className="mt-6 h-5 w-48" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="flex h-full min-h-[250px] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {liveStatusUnavailableText}
        </p>
      </Card>
    );
  }

  const isOnTrack =
    data.status === "ON_TRACK";

  const statusSource =
    data.status.replace("_", " ");

  return (
    <Card className="h-full min-w-0">
      {/* Header */}

      <div className="mb-6 flex min-w-0 items-center gap-3">
        <div
          className={`shrink-0 rounded-xl p-3 ${
            isOnTrack
              ? "bg-green-100 dark:bg-green-950/40"
              : "bg-red-100 dark:bg-red-950/40"
          }`}
        >
          <Activity
            size={22}
            className={
              isOnTrack
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {liveFocusText}
          </h2>

          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {realTimeFocusTrackingText}
          </p>
        </div>
      </div>

      {/* Status */}

      <div
        className={`rounded-2xl p-4 ${
          isOnTrack
            ? "bg-green-50 dark:bg-green-950/30"
            : "bg-red-50 dark:bg-red-950/30"
        }`}
      >
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {statusText}
        </p>

        <div className="mt-2 flex min-w-0 items-center gap-2">
          {isOnTrack ? (
            <CheckCircle2
              className="shrink-0 text-green-600 dark:text-green-400"
              size={22}
            />
          ) : (
            <AlertTriangle
              className="shrink-0 text-red-600 dark:text-red-400"
              size={22}
            />
          )}

          <span
            className={`break-words text-lg font-bold sm:text-xl ${
              isOnTrack
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            <TranslatedText
              text={statusSource}
            />
          </span>
        </div>
      </div>

      {/* Categories */}

      <div className="mt-5 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
        <div className="min-w-0 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {plannedText}
          </p>

          <h3 className="mt-2 break-words font-semibold text-slate-900 dark:text-white">
            <TranslatedText
              text={data.planned_category}
            />
          </h3>
        </div>

        <div className="min-w-0 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {currentText}
          </p>

          <h3 className="mt-2 break-words font-semibold text-slate-900 dark:text-white">
            <TranslatedText
              text={data.current_category}
            />
          </h3>
        </div>
      </div>

      {/* Website */}

      <div className="mt-5 flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {websiteText}
          </p>

          <h3 className="mt-1 break-all font-semibold text-slate-900 dark:text-white">
            {data.website}
          </h3>
        </div>

        <Globe
          size={22}
          className="shrink-0 text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* AI Message */}

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
        <p className="break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
          <TranslatedText
            text={data.message}
          />
        </p>
      </div>
    </Card>
  );
};

export default LiveStatusCard;