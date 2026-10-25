import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", score: 42 },
  { day: "Tue", score: 58 },
  { day: "Wed", score: 64 },
  { day: "Thu", score: 76 },
  { day: "Fri", score: 81 },
  { day: "Sat", score: 73 },
  { day: "Sun", score: 92 },
];

const FocusChart = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Weekly Focus Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="focusGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#6366f1"
                stopOpacity={0.7}
              />

              <stop
                offset="100%"
                stopColor="#6366f1"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Area
            dataKey="score"
            stroke="#6366f1"
            fill="url(#focusGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FocusChart;