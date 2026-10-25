import {
  Activity,
  Clock3,
  Globe,
  Timer,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";
import { formatDuration } from "../../utils/time";
import Skeleton from "../common/Skeleton";
import StatCard from "./StatCard";
import { useTranslation } from "../../hooks/useTranslation";

const StatsGrid = () => {
  const { data, isLoading } = useDashboard();

  const activeTimeText = useTranslation("Active Time");
  const activeDurationText = useTranslation("Today's active duration");
  const idleTimeText = useTranslation("Idle Time");
  const awayFromWorkText = useTranslation("Away from work");
  const browserTimeText = useTranslation("Browser Time");
  const timeSpentBrowsingText = useTranslation("Time spent browsing");
  const websitesText = useTranslation("Websites");
  const visitedTodayText = useTranslation("Visited today");

  if (isLoading) {
    return (
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-4 h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={activeTimeText}
        subtitle={activeDurationText}
        value={formatDuration(data?.active_time ?? 0)}
        icon={Activity}
        iconColor="text-green-600"
        iconBg="bg-green-100"
      />

      <StatCard
        title={idleTimeText}
        subtitle={awayFromWorkText}
        value={formatDuration(data?.idle_time ?? 0)}
        icon={Clock3}
        iconColor="text-orange-500"
        iconBg="bg-orange-100"
      />

      <StatCard
        title={browserTimeText}
        subtitle={timeSpentBrowsingText}
        value={formatDuration(data?.browser_time ?? 0)}
        icon={Timer}
        iconColor="text-indigo-600"
        iconBg="bg-indigo-100"
      />

      <StatCard
        title={websitesText}
        subtitle={visitedTodayText}
        value={data?.total_website_visited ?? 0}
        icon={Globe}
        iconColor="text-cyan-600"
        iconBg="bg-cyan-100"
      />
    </div>
  );
};

export default StatsGrid;
