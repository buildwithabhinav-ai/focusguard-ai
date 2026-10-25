import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Activity, TrendingUp } from "lucide-react";

import Card from "../../common/Card";
import Skeleton from "../../common/Skeleton";
import { useMonthlyReport } from "../../../hooks/useReports";
import {
  useChartLabelTranslator,
  useTranslation,
} from "../../../hooks/useTranslation";

const formatHours = (seconds: number) => {
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  }

  return `${Math.round(seconds / 3600)}h`;
};

const MonthlyActivityChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const { data, isLoading } = useMonthlyReport();

  const monthlyActivityText = useTranslation("Monthly Activity");
  const last30DaysText = useTranslation("Last 30 Days");
  const focusText = useTranslation("Focus");
  const activeText = useTranslation("Active");
  const idleText = useTranslation("Idle");
  const activeTimeText = useTranslation("Active Time");
  const idleTimeText = useTranslation("Idle Time");
  const activityLast30DaysText = useTranslation("Your activity for the last 30 days");

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-8 h-52 w-full rounded-2xl sm:h-56" />
      </Card>
    );
  }

  return (
    <Card className="min-w-0">
      <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/50 sm:h-12 sm:w-12">
            <Activity size={21} className="text-indigo-600 dark:text-indigo-400 sm:h-[22px] sm:w-[22px]" />
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold leading-tight text-slate-900 dark:text-white sm:text-lg">
              {monthlyActivityText}
            </h2>
            <p className="mt-1 break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
              {last30DaysText}
            </p>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-2xl bg-indigo-50 px-4 py-3 text-center dark:bg-indigo-950/40 sm:w-auto sm:min-w-[100px]">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
            {focusText}
          </p>
          <h3 className="mt-1 text-xl font-bold text-indigo-700 dark:text-indigo-400 sm:text-2xl">
            {(data?.focus_score ?? 0).toFixed(1)}%
          </h3>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 shrink-0 rounded-full bg-indigo-500" />
          <span>{activeText}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 shrink-0 rounded-full bg-red-400" />
          <span>{idleText}</span>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <AreaChart
            data={data?.weekly_breakdown ?? []}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid stroke="#64748B" strokeOpacity={0.25} vertical={false} />
            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="week"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatHours}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              width={38}
            />
            <Tooltip
              labelFormatter={translateChartLabel}
              cursor={{ fill: "#94A3B8", fillOpacity: 0.12 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #CBD5E1",
                backgroundColor: "#FFFFFF",
                color: "#0F172A",
                fontSize: 13,
                maxWidth: "calc(100vw - 32px)",
              }}
              formatter={(value, name) => {
                const seconds = typeof value === "number" ? value : 0;
                let translatedName = name;

                if (name === "Active Time") {
                  translatedName = activeTimeText;
                } else if (name === "Idle Time") {
                  translatedName = idleTimeText;
                }

                return [formatHours(seconds), translatedName];
              }}
            />

            <defs>
              <linearGradient id="personalActiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="personalIdleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="active_time_seconds"
              name={activeTimeText}
              stroke="#4F46E5"
              strokeWidth={3}
              fill="url(#personalActiveGradient)"
            />
            <Area
              type="monotone"
              dataKey="idle_time_seconds"
              name={idleTimeText}
              stroke="#EF4444"
              strokeWidth={3}
              fill="url(#personalIdleGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex min-w-0 items-start gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:text-sm">
        <TrendingUp size={16} className="mt-0.5 shrink-0" />
        <span className="break-words leading-5">{activityLast30DaysText}</span>
      </div>
    </Card>
  );
};

export default MonthlyActivityChart;
