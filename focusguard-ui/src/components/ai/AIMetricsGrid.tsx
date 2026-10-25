import {
  Activity,
  Clock3,
  Monitor,
  Target,
} from "lucide-react";

import { useAIRecommendation } from "../../hooks/useAIRecommendation";

import { useTranslation } from "../../hooks/useTranslation";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

const AIMetricsGrid = () => {
  const {
    data,
    isLoading,
    isError,
  } = useAIRecommendation();

  const unableToLoadMetricsText =
    useTranslation(
      "Unable to load AI metrics."
    );

  const focusScoreText =
    useTranslation("Focus Score");

  const activeTimeText =
    useTranslation("Active Time");

  const idleTimeText =
    useTranslation("Idle Time");

  const browserTimeText =
    useTranslation("Browser Time");

  const overallFocusText =
    useTranslation("Overall focus level");

  const activeWorkingText =
    useTranslation("Time actively working");

  const idleMarkedText =
    useTranslation("Time marked as idle");

  const browserActivityText =
    useTranslation(
      "Total browser activity"
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
          <Card
            key={item}
            className="
              min-w-0
              border
              border-slate-200
              bg-white
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-4 h-8 w-24" />

            <Skeleton className="mt-3 h-4 w-40" />
          </Card>
        ))}
      </div>
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
        <p
          className="
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {unableToLoadMetricsText}
        </p>
      </Card>
    );
  }

  const metrics = [
    {
      title: focusScoreText,
      value: `${data.focus_score.toFixed(1)}%`,
      subtitle: overallFocusText,
      icon: Target,
      iconColor:
        "text-indigo-600 dark:text-indigo-400",
      iconBg:
        "bg-indigo-100 dark:bg-indigo-950/50",
    },
    {
      title: activeTimeText,
      value: data.active_time,
      subtitle: activeWorkingText,
      icon: Activity,
      iconColor:
        "text-green-600 dark:text-green-400",
      iconBg:
        "bg-green-100 dark:bg-green-950/50",
    },
    {
      title: idleTimeText,
      value: data.idle_time,
      subtitle: idleMarkedText,
      icon: Clock3,
      iconColor:
        "text-orange-600 dark:text-orange-400",
      iconBg:
        "bg-orange-100 dark:bg-orange-950/50",
    },
    {
      title: browserTimeText,
      value: data.browser_time,
      subtitle: browserActivityText,
      icon: Monitor,
      iconColor:
        "text-violet-600 dark:text-violet-400",
      iconBg:
        "bg-violet-100 dark:bg-violet-950/50",
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
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card
            key={metric.title}
            className="
              min-w-0
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-md

              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/20
            "
          >
            <div
              className="
                flex
                min-w-0
                items-start
                justify-between
                gap-4
              "
            >
              <div className="min-w-0 flex-1">
                <p
                  className="
                    truncate
                    text-sm
                    font-medium
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {metric.title}
                </p>

                <h2
                  className="
                    mt-2
                    break-words
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                    sm:text-3xl
                  "
                >
                  {metric.value}
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  {metric.subtitle}
                </p>
              </div>

              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  sm:h-12
                  sm:w-12
                  ${metric.iconBg}
                `}
              >
                <Icon
                  size={22}
                  className={metric.iconColor}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AIMetricsGrid;