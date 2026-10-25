import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Activity,
  TrendingUp,
} from "lucide-react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import {
  useRoleMonthlyReport,
} from "../../hooks/useReports";

import {
  useChartLabelTranslator,
  useTranslation,
} from "../../hooks/useTranslation";

const formatMinutes = (seconds: number) => {
  const mins = Math.round(seconds / 60);

  return `${mins}m`;
};

const RoleMonthlyActivityChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const {
    data,
    isLoading,
    isError,
  } = useRoleMonthlyReport();

  const errorMessage =
    useTranslation(
      "Unable to load organization monthly activity."
    );

  const title =
    useTranslation(
      "Monthly Organization Activity"
    );

  const subtitle =
    useTranslation(
      "Last 30 Days · Organization Users"
    );

  const focusLabel =
    useTranslation("Focus");

  const activeLabel =
    useTranslation("Active");

  const idleLabel =
    useTranslation("Idle");

  const activeTimeLabel =
    useTranslation("Active Time");

  const idleTimeLabel =
    useTranslation("Idle Time");

  const footerText =
    useTranslation(
      "Organization users' monthly activity"
    );

  if (isLoading) {
    return (
      <Card className="min-w-0">
        <Skeleton className="mt-2 h-4 w-32" />

        <Skeleton className="mt-8 h-56 w-full rounded-2xl" />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {errorMessage}
        </p>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 overflow-hidden">
      {/* Header */}

      <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/60">
            <Activity
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-indigo-50 px-4 py-3 text-center dark:bg-indigo-950/40 sm:w-auto">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            {focusLabel}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {data.focus_score.toFixed(1)}%
          </h3>
        </div>
      </div>

      {/* Legend */}

      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500" />

          <span className="text-slate-700 dark:text-slate-300">
            {activeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />

          <span className="text-slate-700 dark:text-slate-300">
            {idleLabel}
          </span>
        </div>
      </div>

      {/* Chart */}

      <div className="w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <AreaChart
            data={data.weekly_breakdown}
            margin={{
              top: 5,
              right: 5,
              left: -15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#334155"
              vertical={false}
            />

            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="week"
              tick={{
                fontSize: 11,
                fill: "#94A3B8",
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={formatMinutes}
              tick={{
                fontSize: 11,
                fill: "#94A3B8",
              }}
              tickLine={false}
              axisLine={false}
              width={45}
            />

            <Tooltip
              labelFormatter={translateChartLabel}
              cursor={{
                fill: "#1E293B",
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #334155",
                backgroundColor: "#0F172A",
                color: "#F8FAFC",
                fontSize: 13,
              }}
              formatter={(value, name) => {
                const seconds =
                  typeof value === "number"
                    ? value
                    : 0;

                let translatedName = name;

                if (name === "Active Time") {
                  translatedName =
                    activeTimeLabel;
                }

                if (name === "Idle Time") {
                  translatedName =
                    idleTimeLabel;
                }

                return [
                  formatMinutes(seconds),
                  translatedName,
                ];
              }}
            />

            <defs>
              <linearGradient
                id="roleActiveGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#6366F1"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#6366F1"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="roleIdleGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#F87171"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#F87171"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="active_time_seconds"
              name="Active Time"
              stroke="#4F46E5"
              strokeWidth={3}
              fill="url(#roleActiveGradient)"
            />

            <Area
              type="monotone"
              dataKey="idle_time_seconds"
              name="Idle Time"
              stroke="#EF4444"
              strokeWidth={3}
              fill="url(#roleIdleGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}

      <div className="mt-5 flex items-start gap-2 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <TrendingUp
          size={16}
          className="mt-0.5 shrink-0"
        />

        <span>
          {footerText}
        </span>
      </div>
    </Card>
  );
};

export default RoleMonthlyActivityChart;