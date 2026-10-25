import AppLayout from "../../../layouts/AppLayout";
import AnalyticsHeader from "../../../components/analytics/AnalyticsHeader";

/* USER ANALYTICS */
import AnalyticsStats from "../../../components/analytics/AnalyticsStats";
import WeeklyActivityChart from "../../../components/dashboard/charts/WeeklyActivityChart";
import WebsiteAnalytics from "../../../components/analytics/WebsiteAnalytics";
import CategoryAnalytics from "../../../components/analytics/CategoryAnalytics";
import ActivitySummary from "../../../components/analytics/ActivitySummary";
import TabSwitchAnalyticsCard from "../../../components/analytics/TabSwitchAnalyticsCard";

/* ORGANIZATION ANALYTICS */
import RoleWeeklyActivityChart from "../../../components/analytics/RoleWeeklyActivityChart";
import RoleMonthlyActivityChart from "../../../components/analytics/RoleMonthlyActivityChart";
import RoleWebsiteBarChart from "../../../components/analytics/RoleWebsiteBarChart";
import RoleCategoryPieChart from "../../../components/analytics/RoleCategoryPieChart";
import RoleTabSwitchCard from "../../../components/analytics/RoleTabSwitchCard";
import AnalyticsStatsRole from "../../../components/analytics/AnalyticsStatsRole";
import OrganizationActivitySummary from "../../../components/analytics/OrganizationActivitySummary";

import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";

const AnalyticsPage = () => {
  const { user, loading } = useAuth();

  const unableToDetermineRole = useTranslation(
    "Unable to determine your account role."
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="w-full min-w-0 space-y-6">
          <div className="h-36 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />

          <div className="h-32 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unableToDetermineRole}
          </p>
        </div>
      </AppLayout>
    );
  }

  const isOrganizationRole =
    user.role === "SUB_ADMIN" ||
    user.role === "SUPER_ADMIN";

  return (
    <AppLayout>
      <div className="w-full min-w-0">
        <AnalyticsHeader />

        {!isOrganizationRole && (
          <>
            <div className="mt-6">
              <AnalyticsStats />
            </div>

            <div className="mt-6 w-full min-w-0">
              <WeeklyActivityChart />
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0">
                <WebsiteAnalytics />
              </div>

              <div className="min-w-0">
                <CategoryAnalytics />
              </div>
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0">
                <ActivitySummary />
              </div>

              <div className="min-w-0">
                <TabSwitchAnalyticsCard />
              </div>
            </div>
          </>
        )}

        {isOrganizationRole && (
          <>
            <div className="mt-6">
              <AnalyticsStatsRole />
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0">
                <RoleWeeklyActivityChart />
              </div>

              <div className="min-w-0">
                <RoleMonthlyActivityChart />
              </div>
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0">
                <RoleWebsiteBarChart />
              </div>

              <div className="min-w-0">
                <RoleCategoryPieChart />
              </div>
            </div>

            <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="min-w-0">
                <OrganizationActivitySummary />
              </div>

              <div className="min-w-0">
                <RoleTabSwitchCard />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;