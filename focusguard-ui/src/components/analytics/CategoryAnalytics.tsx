import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Card from "../common/Card";

import {
  useCategoryAnalytics,
} from "../../hooks/useAnalytics";

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F97316",
  "#06B6D4",
  "#EF4444",
  "#8B5CF6",
];

const formatHours = (seconds: number) =>
  `${(seconds / 3600).toFixed(1)} h`;

const CategoryAnalytics = () => {
  const {
    data,
    isLoading,
  } = useCategoryAnalytics();

  if (isLoading) {
    return (
      <Card
        className="
          border
          border-slate-200
          bg-white

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="flex min-h-[250px] items-center justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading Categories...
          </p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card
        className="
          border
          border-slate-200
          bg-white

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="flex min-h-[250px] items-center justify-center text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No category data found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="
        min-w-0
        overflow-hidden
        border
        border-slate-200
        bg-white

        dark:border-slate-700
        dark:bg-slate-900
      "
    >

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
          Category Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Time spent by category
        </p>
      </div>

      <div className="w-full min-w-0">

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>

            <Pie
              data={data}
              dataKey="duration_seconds"
              nameKey="category"
              outerRadius="65%"
              innerRadius="35%"
              paddingAngle={3}
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
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #475569",
                backgroundColor: "#0f172a",
                color: "#f8fafc",
                fontSize: 13,
              }}
              formatter={(value) =>
                formatHours(Number(value))
              }
            />

            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#94a3b8",
              }}
            />

          </PieChart>
        </ResponsiveContainer>

      </div>

    </Card>
  );
};

export default CategoryAnalytics;