import {
  Activity,
  Clock3,
  Globe,
  Timer,
} from "lucide-react";

import {
  useRoleActivitySummary,
  useRoleWebsiteAnalytics,
} from "../../../hooks/useAnalytics";

import {
  formatDuration,
} from "../../../utils/time";

import Skeleton from "../../common/Skeleton";
import StatCard from "../../dashboard/StatCard";

import {
  useTranslation,
} from "../../../hooks/useTranslation";

const SuperAdminStatsGrid = () => {
  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useRoleActivitySummary();

  const {
    data: websiteData,
    isLoading: websiteLoading,
    isError: websiteError,
  } = useRoleWebsiteAnalytics();

  const activeTime =
    useTranslation("Active Time");

  const idleTime =
    useTranslation("Idle Time");

  const browserTime =
    useTranslation("Browser Time");

  const websites =
    useTranslation("Websites");

  const allOrganizationUsers =
    useTranslation("All organization users");

  const usedByOrganizationUsers =
    useTranslation("Used by organization users");

  const unableToLoadOrganizationAnalytics =
    useTranslation(
      "Unable to load organization analytics."
    );

  if (
    activityLoading ||
    websiteLoading
  ) {
    return (
      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-4

          sm:grid-cols-2
          lg:gap-5
          xl:grid-cols-4
        "
      >
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm

                dark:border-slate-700
                dark:bg-slate-900
                dark:shadow-black/20

                sm:p-5
              "
            >
              <Skeleton
                className="h-4 w-28"
              />

              <Skeleton
                className="
                  mt-3
                  h-8
                  w-20
                "
              />

              <Skeleton
                className="
                  mt-4
                  h-3
                  w-32
                "
              />
            </div>
          )
        )}
      </div>
    );
  }

  if (
    activityError ||
    websiteError
  ) {
    return (
      <div
        className="
          w-full
          min-w-0
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-4
          text-sm
          text-red-600

          dark:border-red-900/50
          dark:bg-red-950/30
          dark:text-red-400

          sm:p-5
        "
      >
        {unableToLoadOrganizationAnalytics}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        w-full
        min-w-0
        grid-cols-1
        gap-4

        sm:grid-cols-2
        lg:gap-5
        xl:grid-cols-4
      "
    >
      <div className="min-w-0">
        <StatCard
          title={activeTime}
          subtitle={allOrganizationUsers}
          value={formatDuration(
            activityData?.active_time_seconds ?? 0
          )}
          icon={Activity}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </div>

      <div className="min-w-0">
        <StatCard
          title={idleTime}
          subtitle={allOrganizationUsers}
          value={formatDuration(
            activityData?.idle_time_seconds ?? 0
          )}
          icon={Clock3}
          iconColor="text-orange-500"
          iconBg="bg-orange-100"
        />
      </div>

      <div className="min-w-0">
        <StatCard
          title={browserTime}
          subtitle={allOrganizationUsers}
          value={formatDuration(
            activityData?.browser_time_seconds ?? 0
          )}
          icon={Timer}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
        />
      </div>

      <div className="min-w-0">
        <StatCard
          title={websites}
          subtitle={usedByOrganizationUsers}
          value={websiteData?.length ?? 0}
          icon={Globe}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
      </div>
    </div>
  );
};

export default SuperAdminStatsGrid;