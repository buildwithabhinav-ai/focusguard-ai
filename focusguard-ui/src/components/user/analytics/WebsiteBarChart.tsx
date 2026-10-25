import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  useWebsiteAnalytics,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

const WebsiteBarChart = () => {
  const {
    data,
    isLoading,
  } = useWebsiteAnalytics();

  const websiteUsage = useTranslation(
    "Website Usage"
  );

  const noWebsiteActivity = useTranslation(
    "No website activity found."
  );

  const timeSpent = useTranslation(
    "Time Spent"
  );

  if (isLoading) {
    return (
      <div
        className="
          min-w-0
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
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="
          min-w-0
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
          {websiteUsage}
        </h2>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {noWebsiteActivity}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-w-0
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
      <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white sm:mb-6 sm:text-xl">
        {websiteUsage}
      </h2>

      <div className="h-[300px] w-full min-w-0 sm:h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 5,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.5}
            />

            <XAxis
              dataKey="website"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{
                fontSize: 11,
                fill: "#94a3b8",
              }}
              height={70}
              axisLine={{
                stroke: "#475569",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#94a3b8",
              }}
              axisLine={{
                stroke: "#475569",
              }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: 13,
              }}
              labelStyle={{
                color: "#f8fafc",
              }}
            />

            <Bar
              dataKey="duration_seconds"
              name={timeSpent}
              fill="#6366F1"
              radius={[
                8,
                8,
                0,
                0,
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WebsiteBarChart;