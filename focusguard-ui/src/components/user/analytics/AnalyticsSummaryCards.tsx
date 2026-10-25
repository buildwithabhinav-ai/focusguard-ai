import {
  Globe,
  Briefcase,
  TriangleAlert,
  ArrowRightLeft,
} from "lucide-react";

import {
  useAnalyticsSummary,
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

const AnalyticsSummaryCards = () => {
  const {
    data,
    isLoading,
  } = useAnalyticsSummary();

  const browserTime = useTranslation("Browser Time");
  const productiveTime = useTranslation("Productive Time");
  const nonProductive = useTranslation("Non Productive");
  const tabSwitches = useTranslation("Tab Switches");

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-36
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

  const cards = [
    {
      title: browserTime,
      value: formatTime(data.browser_time_seconds),
      icon: Globe,
      color:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: productiveTime,
      value: formatTime(data.productive_time_seconds),
      icon: Briefcase,
      color:
        "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: nonProductive,
      value: formatTime(data.non_productive_time_seconds),
      icon: TriangleAlert,
      color:
        "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    },
    {
      title: tabSwitches,
      value: data.tab_switches,
      icon: ArrowRightLeft,
      color:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md

              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/20

              sm:p-6
            "
          >
            <div
              className={`
                mb-4
                inline-flex
                rounded-2xl
                p-3.5

                sm:mb-5
                sm:p-4

                ${card.color}
              `}
            >
              <Icon
                size={23}
                className="sm:hidden"
              />

              <Icon
                size={26}
                className="hidden sm:block"
              />
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {card.title}
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsSummaryCards;