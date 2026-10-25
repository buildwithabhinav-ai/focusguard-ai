import AppLayout from "../../../layouts/AppLayout";

import AnalyticsHeader from "../../../components/analytics/AnalyticsHeader";
import AnalyticsStats from "../../../components/analytics/AnalyticsStats";

import RoleWeeklyActivityChart from "../../../components/analytics/RoleWeeklyActivityChart";
import RoleMonthlyActivityChart from "../../../components/analytics/RoleMonthlyActivityChart";

import RoleCategoryPieChart from "../../../components/analytics/RoleCategoryPieChart";
import RoleWebsiteBarChart from "../../../components/analytics/RoleWebsiteBarChart";

import RoleTabSwitchCard from "../../../components/analytics/RoleTabSwitchCard";

import ActivitySummary from "../../../components/analytics/ActivitySummary";

const AnalyticsPage = () => {
  return (
    <AppLayout>

      {/* Header */}

      <div className="w-full min-w-0">
        <AnalyticsHeader />
      </div>


      {/* Organization Analytics Stats */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <AnalyticsStats />
      </div>


      {/* Organization Weekly + Monthly Activity */}

      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">

        <div className="min-w-0">
          <RoleWeeklyActivityChart />
        </div>

        <div className="min-w-0">
          <RoleMonthlyActivityChart />
        </div>

      </div>


      {/* Organization Category + Website Analytics */}

      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">

        <div className="min-w-0">
          <RoleCategoryPieChart />
        </div>

        <div className="min-w-0">
          <RoleWebsiteBarChart />
        </div>

      </div>


      {/* Organization Tab Switching */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <RoleTabSwitchCard />
      </div>


      {/* Organization Activity Summary */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <ActivitySummary />
      </div>

    </AppLayout>
  );
};

export default AnalyticsPage;