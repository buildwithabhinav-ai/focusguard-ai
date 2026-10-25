import {
  ArrowRight,
  Repeat,
} from "lucide-react";

import Card from "../common/Card";

import {
  useTabSwitchAnalytics,
} from "../../hooks/useAnalytics";

const formatTime = (time: string) => {
  return new Date(time).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

const truncate = (
  text: string,
  max = 40
) => {
  if (!text) return "-";

  return text.length > max
    ? text.slice(0, max) + "..."
    : text;
};

const TabSwitchCard = () => {
  const {
    data,
    isLoading,
  } = useTabSwitchAnalytics();

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
            Loading Tab Switch Analytics...
          </p>
        </div>
      </Card>
    );
  }

  if (!data) {
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
            No tab switching data found.
          </p>
        </div>
      </Card>
    );
  }

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
            Tab Switching
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recent context switches
          </p>
        </div>

        <div
          className="
            shrink-0
            rounded-xl
            bg-orange-100
            p-3

            dark:bg-orange-950/40
          "
        >
          <Repeat
            size={22}
            className="text-orange-600 dark:text-orange-400"
          />
        </div>

      </div>


      {/* Total */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-orange-100
          bg-orange-50
          p-4

          dark:border-orange-900/50
          dark:bg-orange-950/40

          sm:p-5
        "
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Total Tab Switches
        </p>

        <h2 className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400 sm:text-3xl">
          {data.total_switches}
        </h2>
      </div>


      {/* Recent switches */}

      <div className="space-y-4">

        {data.recent_switches
          .slice(0, 6)
          .map((item, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                transition
                hover:bg-slate-50

                dark:border-slate-700
                dark:bg-slate-800/60
                dark:hover:bg-slate-800
              "
            >

              <div className="flex min-w-0 items-start gap-3">

                <div
                  className="
                    shrink-0
                    rounded-full
                    bg-indigo-100
                    p-2

                    dark:bg-indigo-950/50
                  "
                >
                  <ArrowRight
                    size={16}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="break-words text-sm font-medium text-slate-900 dark:text-slate-100">
                    {truncate(item.from)}
                  </p>

                  <p className="my-1 text-xs text-slate-400 dark:text-slate-500">
                    ↓
                  </p>

                  <p className="break-words text-sm font-medium text-slate-900 dark:text-slate-100">
                    {truncate(item.to)}
                  </p>

                </div>

              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {formatTime(item.time)}
              </p>

            </div>

          ))}

        {data.recent_switches.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              p-8
              text-center

              dark:border-slate-700
              dark:bg-slate-800/50
            "
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No tab switching activity found.
            </p>
          </div>
        )}

      </div>

    </Card>
  );
};

export default TabSwitchCard;