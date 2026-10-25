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

import Card from "../../common/Card";
import Skeleton from "../../common/Skeleton";
import { useWeeklyReport } from "../../../hooks/useReports";
import {
  useChartLabelTranslator,
  useTranslation,
} from "../../../hooks/useTranslation";

const formatMinutes = (seconds: number) => {
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
};

const WeeklyActivityChart = () => {
  const translateChartLabel =
    useChartLabelTranslator();

  const { data, isLoading } = useWeeklyReport();

  const weeklyActivityText = useTranslation("Weekly Activity");
  const last7DaysText = useTranslation("Last 7 Days");
  const focusText = useTranslation("Focus");
  const activeText = useTranslation("Active");
  const idleText = useTranslation("Idle");
  const activeTimeText = useTranslation("Active Time");
  const idleTimeText = useTranslation("Idle Time");
  const activityLast7DaysText = useTranslation("Your activity for the last 7 days");

  if (isLoading) {
    return (
      <Card>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-8 h-52 w-full rounded-2xl sm:h-56" />
      </Card>
    );
  }

  return (
    <Card className="min-w-0">
      <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950/50 sm:h-12 sm:w-12">
            <BarChart3 size={21} className="text-green-600 dark:text-green-400 sm:h-[22px] sm:w-[22px]" />
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold leading-tight text-slate-900 dark:text-white sm:text-lg">
              {weeklyActivityText}
            </h2>
            <p className="mt-1 break-words text-sm leading-5 text-slate-500 dark:text-slate-400">
              {last7DaysText}
            </p>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-2xl bg-green-50 px-4 py-3 text-center dark:bg-green-950/40 sm:w-auto sm:min-w-[100px]">
          <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
            {focusText}
          </p>
          <h3 className="mt-1 text-xl font-bold text-green-700 dark:text-green-400 sm:text-2xl">
            {(data?.focus_score ?? 0).toFixed(1)}%
          </h3>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-300 sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
          <span>{activeText}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 shrink-0 rounded-full bg-orange-500" />
          <span>{idleText}</span>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={220} minWidth={0}>
          <BarChart
            data={data?.daily_breakdown ?? []}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid stroke="#64748B" strokeOpacity={0.25} vertical={false} />
            <XAxis
              tickFormatter={translateChartLabel}
              dataKey="day"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatMinutes}
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

                return [formatMinutes(seconds), translatedName];
              }}
            />
            <Bar
              dataKey="active_time_seconds"
              name={activeTimeText}
              fill="#22C55E"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="idle_time_seconds"
              name={idleTimeText}
              fill="#F97316"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex min-w-0 items-start gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:text-sm">
        <TrendingUp size={16} className="mt-0.5 shrink-0" />
        <span className="break-words leading-5">{activityLast7DaysText}</span>
      </div>
    </Card>
  );
};

export default WeeklyActivityChart;
