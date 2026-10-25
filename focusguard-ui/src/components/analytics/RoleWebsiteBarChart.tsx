import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useRoleWebsiteAnalytics } from "../../hooks/useAnalytics";
import { useTranslation } from "../../hooks/useTranslation";

const RoleWebsiteBarChart = () => {
  const { data, isLoading, isError } = useRoleWebsiteAnalytics();

  const unableToLoadWebsiteAnalytics = useTranslation("Unable to load website analytics.");
  const organizationWebsites = useTranslation("Organization Websites");
  const noOrganizationWebsiteActivityYet = useTranslation("No organization website activity yet.");
  const organizationWebsiteUsage = useTranslation("Organization Website Usage");
  const mostVisitedWebsites = useTranslation("Most visited websites across your organization");
  const timeSpent = useTranslation("Time Spent");

  if (isLoading) {
    return (
      <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-6 h-[260px] w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 sm:h-[320px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {unableToLoadWebsiteAnalytics}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          {organizationWebsites}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {noOrganizationWebsiteActivityYet}
        </p>
      </div>
    );
  }

  const chartData = data.slice(0, 8);

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {organizationWebsiteUsage}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {mostVisitedWebsites}
      </p>

      <div className="mt-4 w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -10, bottom: 65 }}
          >
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              dataKey="website"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              height={70}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              width={40}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "#1E293B" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #334155",
                backgroundColor: "#0F172A",
                color: "#F8FAFC",
                fontSize: 13,
              }}
              formatter={(value) => [value, timeSpent]}
            />
            <Bar
              dataKey="duration_seconds"
              name={timeSpent}
              fill="#6366F1"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleWebsiteBarChart;
