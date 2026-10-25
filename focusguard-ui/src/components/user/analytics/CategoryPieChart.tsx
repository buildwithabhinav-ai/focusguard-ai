import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  useCategoryAnalytics,
} from "../../../hooks/useAnalytics";

import { useTranslation } from "../../../hooks/useTranslation";

import TranslatedText from "../../../components/common/TranslatedText";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
];

const CategoryPieChart = () => {
  const {
    data,
    isLoading,
  } = useCategoryAnalytics();

  const categoryDistribution = useTranslation(
    "Category Distribution"
  );

  const noCategoryData = useTranslation(
    "No category data available."
  );

  if (isLoading) {
    return (
      <div
        className="
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
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="
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
          {categoryDistribution}
        </h2>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {noCategoryData}
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
        {categoryDistribution}
      </h2>

      <div className="h-[300px] w-full min-w-0 sm:h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="duration_seconds"
              nameKey="category"
              cx="50%"
              cy="45%"
              outerRadius="65%"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [value, <TranslatedText key="name" text={String(name)} />]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: 13,
              }}
            />

            <Legend
              formatter={(value) => <TranslatedText text={String(value)} />}
              wrapperStyle={{
                fontSize: 12,
                color: "#94a3b8",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPieChart;