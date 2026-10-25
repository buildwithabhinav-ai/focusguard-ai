import {
  MousePointerClick,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import {
  useRoleTabSwitchAnalytics,
} from "../../hooks/useRoleTabSwitch";

import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";

const RoleTabSwitchCard = () => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  const {
    data,
    isLoading,
    isFetching,
  } = useRoleTabSwitchAnalytics(
    selectedDate
  );

  const { language } = useLanguage();

  const title =
    useTranslation(
      "Organization Tab Switching"
    );

  const description =
    useTranslation(
      "Recent user tab activity"
    );

  const totalSwitchesLabel =
    useTranslation("Total Switches");

  const checkDateLabel =
    useTranslation(
      "Check tab switches for date"
    );

  const showingDateLabel =
    useTranslation(
      "Showing tab switches for"
    );

  const updatingLabel =
    useTranslation("Updating...");

  const recentSwitchesLabel =
    useTranslation(
      "Recent Tab Switches"
    );

  const noSwitchesLabel =
    useTranslation(
      "No tab switches recorded for this date."
    );

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-5 w-40" />

        <Skeleton className="mt-6 h-10 w-20" />

        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              className="h-12 w-full"
            />
          ))}
        </div>
      </Card>
    );
  }

  const languageLocaleMap: Record<
    string,
    string
  > = {
    en: "en-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    ml: "ml-IN",
    bn: "bn-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    te: "te-IN",
    ur: "ur-IN",
    od: "or-IN",
    as: "as-IN",
  };

  const locale =
    languageLocaleMap[language] ??
    "en-IN";

  const formattedSelectedDate =
    new Date(
      `${selectedDate}T00:00:00`
    ).toLocaleDateString(
      locale,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <Card className="min-w-0 overflow-hidden">
      {/* Header */}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl bg-orange-100 p-3 dark:bg-orange-950/50">
              <MousePointerClick
                size={22}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                {title}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>

          {/* Total */}

          <div className="w-fit rounded-2xl bg-orange-50 px-4 py-3 dark:bg-orange-950/40 sm:text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {totalSwitchesLabel}
            </p>

            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data?.total_switches ?? 0}
            </p>
          </div>
        </div>

        {/* Date Filter */}

        <div className="flex w-full flex-col gap-2 sm:w-fit">
          <label
            htmlFor="organization-tab-switch-date"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
          >
            <CalendarDays
              size={17}
              className="text-orange-600 dark:text-orange-400"
            />

            {checkDateLabel}
          </label>

          <input
            id="organization-tab-switch-date"
            type="date"
            value={selectedDate}
            max={today}
            onChange={(event) =>
              setSelectedDate(
                event.target.value
              )
            }
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              outline-none
              transition

              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-200
              dark:focus:border-orange-500
              dark:focus:ring-orange-950

              sm:w-64
            "
          />
        </div>
      </div>

      {/* Selected Date */}

      <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {showingDateLabel}{" "}

          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formattedSelectedDate}
          </span>
        </p>

        {isFetching && (
          <p className="mt-1 text-xs font-medium text-orange-600 dark:text-orange-400">
            {updatingLabel}
          </p>
        )}
      </div>

      {/* Recent Switches */}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {recentSwitchesLabel}
        </p>

        <div className="space-y-3">
          {data?.recent_switches
            ?.slice(0, 5)
            .map((item, index) => (
              <div
                key={`${item.time}-${index}`}
                className="
                  flex
                  flex-col
                  gap-2
                  rounded-xl
                  border
                  border-slate-100
                  bg-slate-50
                  p-3
                  transition

                  dark:border-slate-700
                  dark:bg-slate-800

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="max-w-[120px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:max-w-[180px]">
                    {item.from}
                  </span>

                  <ArrowRight
                    size={15}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />

                  <span className="max-w-[120px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:max-w-[180px]">
                    {item.to}
                  </span>
                </div>

                <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                  {new Date(
                    item.time
                  ).toLocaleTimeString(
                    locale,
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </span>
              </div>
            ))}

          {(!data ||
            data.recent_switches.length ===
              0) && (
            <div className="rounded-xl bg-slate-50 py-8 text-center dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {noSwitchesLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RoleTabSwitchCard;