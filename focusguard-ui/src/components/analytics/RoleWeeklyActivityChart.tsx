import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  BarChart3,
  TrendingUp,
} from "lucide-react";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

import {
  useRoleWeeklyReport,
} from "../../hooks/useReports";

import {
  useChartLabelTranslator,
  useTranslation,
} from "../../hooks/useTranslation";

const formatMinutes = (seconds: number) => {
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
};

const RoleWeeklyActivityChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const {
    data,
    isLoading,
    isError,
  } = useRoleWeeklyReport();

  const errorMessage =
    useTranslation(
      "Unable to load organization weekly activity."
    );

  const title =
    useTranslation(
      "Weekly Organization Activity"
    );

  const subtitle =
    useTranslation(
      "Last 7 Days · Organization Users"
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
      "Organization users' weekly activity"
    );

  if (isLoading) {
    return (
      <Card className="min-w-0">
        <Skeleton className="mt-2 h-4 w-28" />

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

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-green-100 p-3 dark:bg-green-950/50">
            <BarChart3
              size={22}
              className="text-green-600 dark:text-green-400"
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

        <div className="w-full rounded-2xl bg-green-50 px-4 py-3 text-center dark:bg-green-950/40 sm:w-auto">
          <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
            {focusLabel}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-green-700 dark:text-green-400">
            {data.focus_score.toFixed(1)}%
          </h3>
        </div>
      </div>

      {/* Legend */}

      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-slate-700 dark:text-slate-300 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />

          {activeLabel}
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500" />

          {idleLabel}
        </div>
      </div>

      {/* Chart */}

      <div className="w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <BarChart
            data={data.daily_breakdown}
            margin={{
              top: 5,
              right: 5,
              left: -15,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke="#475569"
              strokeOpacity={0.25}
              vertical={false}
            />

            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="day"
              tick={{
                fontSize: 11,
                fill: "currentColor",
              }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
            />

            <YAxis
              tickFormatter={formatMinutes}
              tick={{
                fontSize: 11,
                fill: "currentColor",
              }}
              tickLine={false}
              axisLine={false}
              stroke="#94A3B8"
              width={45}
            />

            <Tooltip
              labelFormatter={translateChartLabel}
              cursor={{
                fill: "#64748B",
                fillOpacity: 0.08,
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #475569",
                backgroundColor: "#ffffff",
                color: "#0f172a",
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

            <Bar
              dataKey="active_time_seconds"
              name="Active Time"
              fill="#22C55E"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="idle_time_seconds"
              name="Idle Time"
              fill="#F97316"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
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

export default RoleWeeklyActivityChart;