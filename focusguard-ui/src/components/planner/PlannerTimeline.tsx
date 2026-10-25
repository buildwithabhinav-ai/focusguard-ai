import {
  Clock3,
  Circle,
} from "lucide-react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import { usePlannerProgress } from "../../hooks/usePlanner";
import { useTranslation } from "../../hooks/useTranslation";

const formatTime = (time: string) => {
  if (!time) return "--";

  const [hour, minute] =
    time.split(":");

  const h = Number(hour);

  const suffix =
    h >= 12 ? "PM" : "AM";

  const formattedHour =
    h % 12 === 0 ? 12 : h % 12;

  return `${formattedHour}:${minute} ${suffix}`;
};

const getStatusColor = (
  status: string
) => {
  const styles: Record<
    string,
    string
  > = {
    Completed:
      "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",

    Behind:
      "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",

    "On Track":
      "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  };

  return (
    styles[status] ??
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  );
};

/* =========================================================
   Dynamic translated text
========================================================= */

const TranslatedText = ({
  text,
}: {
  text: string;
}) => {
  const translatedText =
    useTranslation(text);

  return <>{translatedText}</>;
};

const PlannerTimeline = () => {
  const {
    data,
    isLoading,
  } = usePlannerProgress();

  const noPlannerYetText =
    useTranslation("No Planner Yet");

  const createTodaysPlanText =
    useTranslation(
      "Create today's focus plan to start tracking your productivity and stay organized throughout the day."
    );

  const todaysScheduleText =
    useTranslation("Today's Schedule");

  const focusTimelineText =
    useTranslation("Your focus timeline");

  const plannedText =
    useTranslation("Planned");

  const actualText =
    useTranslation("Actual");

  const progressText =
    useTranslation("Progress");

  const minText =
    useTranslation("min");

  if (isLoading) {
    return (
      <Card>
        {[1, 2].map((item) => (
          <Skeleton
            key={item}
            className="mb-5 h-24 w-full rounded-2xl last:mb-0"
          />
        ))}
      </Card>
    );
  }

  if (
    !data ||
    data.planner.length === 0
  ) {
    return (
      <Card>
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <Clock3
            size={52}
            className="mb-5 text-slate-300 dark:text-slate-600"
          />

          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            {noPlannerYetText}
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            {createTodaysPlanText}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="min-w-0">
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
            {todaysScheduleText}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {focusTimelineText}
          </p>
        </div>
      </div>

      {/* Timeline */}

      <div className="space-y-5">
        {data.planner.map(
          (plan, index) => (
            <div
              key={index}
              className="
                relative
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4
                transition
                hover:border-indigo-200
                hover:bg-slate-50
                dark:border-slate-700
                dark:hover:border-indigo-800
                dark:hover:bg-slate-800/60
                sm:p-5
              "
            >
              {/* Timeline connector */}

              {index !==
                data.planner.length - 1 && (
                <div
                  className="
                    absolute
                    left-[23px]
                    top-[62px]
                    h-10
                    border-l-2
                    border-dashed
                    border-slate-300
                    dark:border-slate-600
                    sm:left-[28px]
                  "
                />
              )}

              <div className="flex min-w-0 gap-3 sm:gap-4">
                {/* Circle */}

                <div className="shrink-0 pt-1">
                  <Circle
                    size={14}
                    fill="#4F46E5"
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  {/* Title + Status */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                        <TranslatedText
                          text={plan.category}
                        />
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {formatTime(
                          plan.start_time
                        )}{" "}
                        -{" "}
                        {formatTime(
                          plan.end_time
                        )}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex
                        w-fit
                        shrink-0
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${getStatusColor(
                          plan.status
                        )}
                      `}
                    >
                      <TranslatedText
                        text={plan.status}
                      />
                    </span>
                  </div>

                  {/* Statistics */}

                  <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {plannedText}
                      </p>

                      <h4 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                        {plan.planned_minutes}{" "}
                        {minText}
                      </h4>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {actualText}
                      </p>

                      <h4 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                        {plan.actual_minutes}{" "}
                        {minText}
                      </h4>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {progressText}
                      </p>

                      <h4 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                        {
                          plan.completion_percentage
                        }
                        %
                      </h4>
                    </div>
                  </div>

                  {/* Progress */}

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            plan.completion_percentage,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
};

export default PlannerTimeline;