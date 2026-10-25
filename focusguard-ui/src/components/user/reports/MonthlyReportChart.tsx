import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  useMonthlyReport,
} from "../../../hooks/useReports";

import {
  useChartLabelTranslator,
  useTranslation,
} from "../../../hooks/useTranslation";

const MonthlyReportChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const {
    data,
    isLoading,
  } = useMonthlyReport();

  const loadingText = useTranslation(
    "Loading monthly report..."
  );

  const noDataText = useTranslation(
    "No monthly data available."
  );

  const titleText = useTranslation(
    "Monthly Activity"
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
    data.weekly_breakdown.length === 0
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
          <BarChart
            data={data.weekly_breakdown}
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
              dataKey="week"
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

            <Bar
              dataKey="active_time_seconds"
              name="Active"
              fill="#6366F1"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="idle_time_seconds"
              name="Idle"
              fill="#EF4444"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyReportChart;