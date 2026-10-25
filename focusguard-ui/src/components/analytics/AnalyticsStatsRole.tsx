import {
  Activity,
  Globe,
  Clock3,
  Moon,
} from "lucide-react";

import Card from "../common/Card";

import {
  useRoleActivitySummary,
} from "../../hooks/useAnalytics";

import { formatDuration } from "../../utils/time";

import { useTranslation } from "../../hooks/useTranslation";

const AnalyticsStatsRole = () => {
  const {
    data,
    isLoading,
    isError,
  } = useRoleActivitySummary();

  const browserTimeLabel =
    useTranslation("Browser Time");

  const focusScoreLabel =
    useTranslation("Focus Score");

  const activeTimeLabel =
    useTranslation("Active Time");

  const idleTimeLabel =
    useTranslation("Idle Time");

  const errorMessage =
    useTranslation(
      "Unable to load organization analytics."
    );

  if (isLoading) {
    return (
      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-32
              animate-pulse
              rounded-3xl
              bg-slate-200

              dark:bg-slate-800
            "
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <div className="flex min-h-[120px] items-center justify-center text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {errorMessage}
          </p>
        </div>
      </Card>
    );
  }

  const stats = [
    {
      title: browserTimeLabel,
      value: formatDuration(
        data.browser_time_seconds ?? 0
      ),
      icon: Globe,
      iconColor:
        "text-indigo-600 dark:text-indigo-400",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: focusScoreLabel,
      value: `${(
        data.focus_score ?? 0
      ).toFixed(2)}%`,
      icon: Activity,
      iconColor:
        "text-green-600 dark:text-green-400",
      iconBg:
        "bg-green-50 dark:bg-green-950/40",
    },
    {
      title: activeTimeLabel,
      value: formatDuration(
        data.active_time_seconds ?? 0
      ),
      icon: Clock3,
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: idleTimeLabel,
      value: formatDuration(
        data.idle_time_seconds ?? 0
      ),
      icon: Moon,
      iconColor:
        "text-orange-600 dark:text-orange-400",
      iconBg:
        "bg-orange-50 dark:bg-orange-950/40",
    },
  ];

  return (
    <div
      className="
        grid
        w-full
        min-w-0
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="
              min-w-0
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg

              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/20
            "
          >
            <div className="flex min-w-0 items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`
                  shrink-0
                  rounded-2xl
                  p-3
                  sm:p-4
                  ${stat.iconBg}
                `}
              >
                <Icon
                  size={22}
                  className={stat.iconColor}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsStatsRole;