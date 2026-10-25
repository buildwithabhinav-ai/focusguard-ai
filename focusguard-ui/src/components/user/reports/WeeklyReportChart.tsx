import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  useWeeklyReport,
} from "../../../hooks/useReports";

import {
  useChartLabelTranslator,
  useTranslation,
} from "../../../hooks/useTranslation";

const WeeklyReportChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const {
    data,
    isLoading,
  } = useWeeklyReport();

  const loadingText = useTranslation(
    "Loading weekly report..."
  );

  const noDataText = useTranslation(
    "No weekly data available."
  );

  const titleText = useTranslation(
    "Weekly Activity"
  );

  const activeText = useTranslation("Active");
  const idleText = useTranslation("Idle");

  if (isLoading) {
    return (
      <div
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
          sm:p-6
        "
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loadingText}
        </p>
      </div>
    );
  }

  if (
    !data ||
    data.daily_breakdown.length === 0
  ) {
    return (
      <div
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          p-5
          dark:border-slate-700
          dark:bg-slate-900
          sm:p-6
        "
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {noDataText}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-3xl
        border border-slate-200
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
        {titleText}
      </h2>

      <div className="h-[280px] w-full min-w-0 sm:h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data.daily_breakdown}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="day"
              tick={{
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
              tickLine={false}
              axisLine={false}
              width={40}
            />

            <Tooltip labelFormatter={translateChartLabel} />

            <Legend
              formatter={(value) => {
                if (value === "Active") {
                  return activeText;
                }

                if (value === "Idle") {
                  return idleText;
                }

                return value;
              }}
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey="active_time_seconds"
              name="Active"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{
                r: 3,
              }}
            />

            <Line
              type="monotone"
              dataKey="idle_time_seconds"
              name="Idle"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{
                r: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyReportChart;