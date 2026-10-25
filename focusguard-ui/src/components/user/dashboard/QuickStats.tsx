import {
  Target,
  Globe,
  Laptop2,
  ArrowRightLeft,
} from "lucide-react";

import {
  useDashboardSummary,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

import { formatDuration } from "../../../utils/time";

const QuickStats = () => {
  const {
    data,
    isLoading,
  } = useDashboardSummary();

  const focusScore = useTranslation(
    "Focus Score"
  );

  const browserTime = useTranslation(
    "Browser Time"
  );

  const productiveTime = useTranslation(
    "Productive Time"
  );

  const tabSwitches = useTranslation(
    "Tab Switches"
  );

  if (isLoading) {
    return (
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-36
              w-full
              animate-pulse
              rounded-3xl
              bg-slate-200

              dark:bg-slate-800

              sm:h-40
            "
          />
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      title: focusScore,
      value: `${data.focus_score}%`,
      icon: Target,
      color:
        "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: browserTime,
      // The API sends seconds; show them as hours and minutes (e.g. 4h 30m).
      value: formatDuration(data.browser_time),
      icon: Globe,
      color:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: productiveTime,
      value: formatDuration(data.productive_time),
      icon: Laptop2,
      color:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
      title: tabSwitches,
      value: data.total_tab_switches,
      icon: ArrowRightLeft,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="
              min-w-0
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-indigo-200
              hover:shadow-md

              dark:border-slate-700
              dark:bg-slate-900
              dark:hover:border-indigo-800
              dark:hover:shadow-black/20

              sm:p-6
            "
          >
            <div
              className={`
                mb-4
                inline-flex
                rounded-2xl
                p-3

                sm:mb-5
                sm:p-4

                ${item.color}
              `}
            >
              <Icon
                size={24}
                className="sm:h-[26px] sm:w-[26px]"
              />
            </div>

            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {item.title}
            </p>

            <h2 className="mt-2 truncate text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;