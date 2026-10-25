import {
  ArrowRightLeft,
  Repeat,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";

import {
  useTabSwitchAnalytics,
} from "../../hooks/useAnalytics";

const TabSwitchAnalyticsCard = () => {
  /*
    Default to today's date
  */
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  /*
    Fetch tab switches for selected date
  */
  const {
    data,
    isLoading,
    isFetching,
  } = useTabSwitchAnalytics(
    selectedDate
  );

  return (
    <div
      className="
        w-full
        min-w-0
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

      {/* ========================================= */}
      {/* Header */}
      {/* ========================================= */}

      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-slate-200
          p-5

          dark:border-slate-700

          sm:p-6
        "
      >

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <h2
            className="
              flex
              min-w-0
              items-center
              gap-2
              text-lg
              font-bold
              text-slate-900

              dark:text-white

              sm:text-xl
            "
          >
            <ArrowRightLeft
              size={22}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

            <span className="break-words">
              Tab Switch Analytics
            </span>
          </h2>

          {!isLoading && data && (
            <div
              className="
                w-fit
                shrink-0
                rounded-xl
                bg-indigo-100
                px-4
                py-2

                dark:bg-indigo-950/60
              "
            >
              <span
                className="
                  text-sm
                  font-semibold
                  text-indigo-600

                  dark:text-indigo-300
                "
              >
                Total Switches
              </span>

              <span
                className="
                  ml-2
                  font-bold
                  text-indigo-700

                  dark:text-indigo-300
                "
              >
                {data.total_switches}
              </span>
            </div>
          )}

        </div>


        {/* ========================================= */}
        {/* Date Filter */}
        {/* ========================================= */}

        <div className="flex w-full flex-col gap-2 sm:w-fit">

          <label
            htmlFor="tab-switch-date"
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600

              dark:text-slate-300
            "
          >
            <CalendarDays
              size={17}
              className="text-indigo-600 dark:text-indigo-400"
            />

            Check tab switches for date
          </label>

          <div className="relative w-full sm:w-64">

            <input
              id="tab-switch-date"
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

                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-100

                dark:border-slate-600
                dark:bg-slate-800
                dark:text-slate-100
                dark:color-scheme-dark
                dark:focus:border-indigo-500
                dark:focus:ring-indigo-950
              "
            />

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* Loading */}
      {/* ========================================= */}

      {isLoading && (

        <div className="p-5 sm:p-6">

          <div
            className="
              h-6
              w-48
              animate-pulse
              rounded
              bg-slate-200

              dark:bg-slate-700
            "
          />

          <div className="mt-6 space-y-3">

            <div
              className="
                h-16
                animate-pulse
                rounded-2xl
                bg-slate-100

                dark:bg-slate-800
              "
            />

            <div
              className="
                h-16
                animate-pulse
                rounded-2xl
                bg-slate-100

                dark:bg-slate-800
              "
            />

            <div
              className="
                h-16
                animate-pulse
                rounded-2xl
                bg-slate-100

                dark:bg-slate-800
              "
            />

          </div>

        </div>

      )}


      {/* ========================================= */}
      {/* Data */}
      {/* ========================================= */}

      {!isLoading && data && (

        <div className="relative">

          {/* Refreshing indicator */}

          {isFetching && (

            <div
              className="
                absolute
                right-5
                top-4
                z-10
                rounded-full
                bg-indigo-50
                px-3
                py-1
                text-xs
                font-medium
                text-indigo-600

                dark:bg-indigo-950/70
                dark:text-indigo-300
              "
            >
              Updating...
            </div>

          )}


          {/* ===================================== */}
          {/* Selected Date */}
          {/* ===================================== */}

          <div
            className="
              border-b
              border-slate-100
              bg-slate-50
              px-5
              py-3

              dark:border-slate-700
              dark:bg-slate-800/60

              sm:px-6
            "
          >

            <p
              className="
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >

              Showing tab switches for{" "}

              <span
                className="
                  font-semibold
                  text-slate-700

                  dark:text-slate-200
                "
              >
                {new Date(
                  `${selectedDate}T00:00:00`
                ).toLocaleDateString(
                  undefined,
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </span>

            </p>

          </div>


          {/* ===================================== */}
          {/* Switches */}
          {/* ===================================== */}

          <div
            className="
              divide-y
              divide-slate-100

              dark:divide-slate-700
            "
          >

            {data.recent_switches.length ===
              0 ? (

              <div className="p-8 text-center sm:p-10">

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100

                    dark:bg-slate-800
                  "
                >

                  <ArrowRightLeft
                    size={24}
                    className="
                      text-slate-400
                      dark:text-slate-500
                    "
                  />

                </div>

                <h3
                  className="
                    mt-4
                    text-base
                    font-semibold
                    text-slate-700

                    dark:text-slate-200
                  "
                >
                  No tab switches
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  No tab switch activity was recorded
                  for this date.
                </p>

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

                    {/* From → To */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                      "
                    >

                      <div
                        className="
                          shrink-0
                          rounded-xl
                          bg-indigo-100
                          p-3

                          dark:bg-indigo-950/60
                        "
                      >

                        <Repeat
                          size={18}
                          className="
                            text-indigo-600
                            dark:text-indigo-400
                          "
                        />

                      </div>


                      <div className="min-w-0">

                        <p
                          className="
                            break-all
                            text-sm
                            font-semibold
                            text-slate-900

                            dark:text-white

                            sm:text-base
                          "
                        >
                          {item.from}
                        </p>

                        <p
                          className="
                            mt-1
                            break-all
                            text-sm
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          → {item.to}
                        </p>

                      </div>

                    </div>


                    {/* Time */}

                    <span
                      className="
                        shrink-0
                        whitespace-nowrap
                        text-xs
                        text-slate-500

                        dark:text-slate-400

                        sm:text-sm
                      "
                    >
                      {new Date(
                        item.time
                      ).toLocaleTimeString(
                        undefined,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default TabSwitchAnalyticsCard;