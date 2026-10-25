import { useState } from "react";

import {
  ArrowRightLeft,
  Repeat,
} from "lucide-react";

import {
  useTabSwitchAnalytics,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

const TabSwitchAnalyticsCard = () => {
  const [selectedDate, setSelectedDate] =
    useState("");

  const {
    data,
    isLoading,
  } = useTabSwitchAnalytics(
    selectedDate || undefined
  );

  const title = useTranslation(
    "Tab Switch Analytics"
  );

  const noData = useTranslation(
    "No tab switch data available."
  );

  const switches = useTranslation("switches");
  const filterByDate = useTranslation(
    "Filter by date:"
  );

  const clear = useTranslation("Clear");

  const noSelectedDateSwitches =
    useTranslation(
      "No tab switches found for the selected date."
    );

  const noRecentSwitches = useTranslation(
    "No recent tab switches."
  );

  if (isLoading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
        "
      >
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20

          sm:p-6
        "
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          {title}
        </h2>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {noData}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      {/* Header */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-slate-200
          p-5

          dark:border-slate-700

          sm:p-6
        "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex min-w-0 items-center gap-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            <ArrowRightLeft
              size={22}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

            <span>{title}</span>
          </h2>

          <div
            className="
              self-start
              rounded-xl
              bg-indigo-100
              px-4
              py-2

              dark:bg-indigo-950/40
            "
          >
            <span className="font-bold text-indigo-700 dark:text-indigo-400">
              {data.total_switches} {switches}
            </span>
          </div>
        </div>

        {/* Date Filter */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor="tab-switch-date"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {filterByDate}
          </label>

          <input
            id="tab-switch-date"
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-200
              dark:focus:border-indigo-400
              dark:focus:ring-indigo-950
            "
          />

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="
                rounded-xl
                px-3
                py-2
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-100

                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              {clear}
            </button>
          )}
        </div>
      </div>

      {/* Switches */}

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {data.recent_switches.length === 0 ? (
          <div className="p-5 text-sm text-slate-500 dark:text-slate-400 sm:p-6">
            {selectedDate
              ? noSelectedDateSwitches
              : noRecentSwitches}
          </div>
        ) : (
          data.recent_switches.map(
            (item, index) => (
              <div
                key={`${item.time}-${index}`}
                className="
                  flex
                  flex-col
                  gap-4
                  p-5
                  transition
                  hover:bg-slate-50

                  dark:hover:bg-slate-800/50

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:p-6
                "
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className="
                      shrink-0
                      rounded-xl
                      bg-indigo-100
                      p-3

                      dark:bg-indigo-950/40
                    "
                  >
                    <Repeat
                      size={18}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-all font-semibold text-slate-900 dark:text-slate-100">
                      {item.from}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                      → {item.to}
                    </p>
                  </div>
                </div>

                <span className="self-start whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 sm:self-auto sm:text-sm">
                  {new Date(
                    item.time
                  ).toLocaleTimeString()}
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default TabSwitchAnalyticsCard;