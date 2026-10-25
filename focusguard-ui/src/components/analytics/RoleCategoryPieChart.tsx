import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useRoleCategoryAnalytics } from "../../hooks/useAnalytics";
import { useTranslation } from "../../hooks/useTranslation";

import TranslatedText from "../../components/common/TranslatedText";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
];

const RoleCategoryPieChart = () => {
  const { data, isLoading, isError } = useRoleCategoryAnalytics();

  const unableToLoadText = useTranslation("Unable to load category analytics.");
  const organizationCategoriesText = useTranslation("Organization Categories");
  const noOrganizationActivityText = useTranslation("No organization activity available yet.");
  const organizationCategoryUsageText = useTranslation("Organization Category Usage");
  const activityDistributionText = useTranslation("Activity distribution across your organization");

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
          {unableToLoadText}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
          {organizationCategoriesText}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {noOrganizationActivityText}
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        {organizationCategoryUsageText}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {activityDistributionText}
      </p>

      <div className="mt-4 w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="duration_seconds"
              nameKey="category"
              cx="50%"
              cy="42%"
              outerRadius="58%"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [value, <TranslatedText key="name" text={String(name)} />]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #334155",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: 13,
              }}
            />

            <Legend
              formatter={(value) => <TranslatedText text={String(value)} />}
              wrapperStyle={{
                fontSize: 12,
                color: "#94A3B8",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleCategoryPieChart;
