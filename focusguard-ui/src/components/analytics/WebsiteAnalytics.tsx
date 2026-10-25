import { Globe } from "lucide-react";

import Card from "../common/Card";

import {
  useWebsiteAnalytics,
} from "../../hooks/useAnalytics";

import {
  formatDuration,
} from "../../utils/time";

const WebsiteAnalytics = () => {
  const {
    data,
    isLoading,
  } = useWebsiteAnalytics();

  if (isLoading) {
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
        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading Website Analytics...
          </p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
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
        <div className="flex min-h-[250px] items-center justify-center text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No website activity found.
          </p>
        </div>
      </Card>
    );
  }

  const totalTime = data.reduce(
    (sum, item) =>
      sum + item.duration_seconds,
    0
  );

  return (
    <Card
      className="
        min-w-0
        overflow-hidden
        border
        border-slate-200
        bg-white

        dark:border-slate-700
        dark:bg-slate-900
      "
    >

      {/* Header */}

      <div className="mb-6 flex items-start justify-between gap-4">

        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
            Top Websites
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Time spent across websites
          </p>
        </div>

        <div
          className="
            shrink-0
            rounded-xl
            bg-indigo-100
            p-3

            dark:bg-indigo-950/40
          "
        >
          <Globe
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

      </div>


      {/* Websites */}

      <div className="space-y-5">

        {data.slice(0, 8).map((site) => {

          const percentage =
            totalTime === 0
              ? 0
              : Number(
                  (
                    (site.duration_seconds /
                      totalTime) *
                    100
                  ).toFixed(1)
                );

          return (
            <div
              key={site.website}
              className="min-w-0"
            >

              <div
                className="
                  mb-2
                  flex
                  flex-col
                  gap-1

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div className="min-w-0">

                  <h3
                    className="
                      break-words
                      font-medium
                      text-slate-800

                      dark:text-slate-200
                    "
                  >
                    {site.website}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {percentage}%
                  </p>

                </div>

                <span
                  className="
                    shrink-0
                    text-sm
                    font-semibold
                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  {formatDuration(
                    site.duration_seconds
                  )}
                </span>

              </div>


              {/* Progress */}

              <div
                className="
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-slate-200

                  dark:bg-slate-700
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-indigo-600
                    transition-all
                    duration-700

                    dark:bg-indigo-500
                  "
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

            </div>
          );
        })}

      </div>

    </Card>
  );
};

export default WebsiteAnalytics;