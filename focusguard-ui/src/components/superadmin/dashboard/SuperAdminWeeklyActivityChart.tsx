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

import { useTheme } from "next-themes";

import {
  useTranslation,
} from "../../../hooks/useTranslation";

import Card from "../../common/Card";
import Skeleton from "../../common/Skeleton";

import {
  useRoleWeeklyReport,
} from "../../../hooks/useReports";

import { useChartLabelTranslator } from "../../../hooks/useTranslation";

const formatMinutes = (
  seconds: number
) => {
  const mins =
    Math.round(seconds / 60);

  return `${mins}m`;
};

const SuperAdminWeeklyActivityChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const {
    data,
    isLoading,
    isError,
  } = useRoleWeeklyReport();

  const {
    resolvedTheme,
  } = useTheme();

  const unableToLoadOverallWeeklyActivity =
    useTranslation(
      "Unable to load overall weekly activity."
    );

  const overallWeeklyActivity =
    useTranslation(
      "Overall Weekly Activity"
    );

  const last7DaysAllOrganizationUsers =
    useTranslation(
      "Last 7 days - all organization users"
    );

  const focus =
    useTranslation("Focus");

  const active =
    useTranslation("Active");

  const idle =
    useTranslation("Idle");

  const activeTime =
    useTranslation("Active Time");

  const idleTime =
    useTranslation("Idle Time");

  const overallActivityLast7Days =
    useTranslation(
      "Overall activity for the last 7 days"
    );

  const isDark =
    resolvedTheme === "dark";

  const chartColors = {
    grid: isDark
      ? "#475569"
      : "#E2E8F0",

    axis: isDark
      ? "#94A3B8"
      : "#64748B",

    cursor: isDark
      ? "#334155"
      : "#E2E8F0",

    tooltipBg: isDark
      ? "#0F172A"
      : "#FFFFFF",

    tooltipBorder: isDark
      ? "#475569"
      : "#CBD5E1",

    tooltipText: isDark
      ? "#F8FAFC"
      : "#0F172A",

    tooltipItem: isDark
      ? "#E2E8F0"
      : "#334155",
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-5 w-40" />

        <Skeleton
          className="
            mt-8
            h-56
            w-full
            rounded-2xl
          "
        />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <p
          className="
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {unableToLoadOverallWeeklyActivity}
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="
        min-w-0
        overflow-hidden
      "
    >
      <div
        className="
          mb-5
          flex
          min-w-0
          flex-col
          gap-4

          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
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
              bg-green-100
              p-3
              dark:bg-green-950/50
            "
          >
            <BarChart3
              size={22}
              className="
                text-green-600
                dark:text-green-400
              "
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-lg
                font-semibold
                leading-tight
                text-slate-900
                dark:text-white

                sm:text-xl
              "
            >
              {overallWeeklyActivity}
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {last7DaysAllOrganizationUsers}
            </p>
          </div>
        </div>

        <div
          className="
            w-fit
            shrink-0
            rounded-2xl
            bg-green-50
            px-4
            py-3
            text-left
            dark:bg-green-950/40

            sm:text-center
          "
        >
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-green-700
              dark:text-green-400
            "
          >
            {focus}
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-green-700
              dark:text-green-400
            "
          >
            {data.focus_score.toFixed(1)}%
          </h3>
        </div>
      </div>

      <div
        className="
          mb-5
          flex
          flex-wrap
          items-center
          gap-x-6
          gap-y-2
          text-sm
          text-slate-700
          dark:text-slate-300
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              h-3
              w-3
              shrink-0
              rounded-full
              bg-green-500
            "
          />

          {active}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="
              h-3
              w-3
              shrink-0
              rounded-full
              bg-orange-500
            "
          />

          {idle}
        </div>
      </div>

      <div
        className="
          h-[220px]
          w-full
          min-w-0

          sm:h-[240px]
        "
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data.daily_breakdown}
            margin={{
              top: 5,
              right: 5,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke={chartColors.grid}
              strokeOpacity={
                isDark ? 0.35 : 0.8
              }
              vertical={false}
            />

            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="day"
              tick={{
                fontSize: 12,
                fill: chartColors.axis,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={formatMinutes}
              tick={{
                fontSize: 12,
                fill: chartColors.axis,
              }}
              tickLine={false}
              axisLine={false}
              width={42}
            />

            <Tooltip
              labelFormatter={translateChartLabel}
              cursor={{
                fill: chartColors.cursor,
                fillOpacity:
                  isDark ? 0.25 : 0.35,
              }}
              contentStyle={{
                borderRadius: 12,
                border:
                  `1px solid ${chartColors.tooltipBorder}`,
                backgroundColor:
                  chartColors.tooltipBg,
                color:
                  chartColors.tooltipText,
                fontSize: 13,
              }}
              labelStyle={{
                color:
                  chartColors.tooltipText,
                fontWeight: 600,
              }}
              itemStyle={{
                color:
                  chartColors.tooltipItem,
              }}
              formatter={(value, name) => {
                const seconds =
                  typeof value === "number"
                    ? value
                    : 0;

                return [
                  formatMinutes(seconds),
                  name,
                ];
              }}
            />

            <Bar
              dataKey="active_time_seconds"
              name={activeTime}
              fill="#22C55E"
              radius={[
                8,
                8,
                0,
                0,
              ]}
            />

            <Bar
              dataKey="idle_time_seconds"
              name={idleTime}
              fill="#F97316"
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

      <div
        className="
          mt-5
          flex
          items-start
          gap-2
          border-t
          border-slate-200
          pt-4
          text-sm
          leading-5
          text-slate-500

          dark:border-slate-700
          dark:text-slate-400
        "
      >
        <TrendingUp
          size={16}
          className="
            mt-0.5
            shrink-0
          "
        />

        <span>
          {overallActivityLast7Days}
        </span>
      </div>
    </Card>
  );
};

export default SuperAdminWeeklyActivityChart;