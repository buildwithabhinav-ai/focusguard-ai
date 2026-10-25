import AppLayout from "../../../layouts/AppLayout";

import AnalyticsHeader from "../../../components/user/analytics/AnalyticsHeader";
import AnalyticsSummaryCards from "../../../components/user/analytics/AnalyticsSummaryCards";
import FocusScoreCard from "../../../components/user/analytics/FocusScoreCard";
import ActivitySummaryCard from "../../../components/user/analytics/ActivitySummaryCard";
import WebsiteAnalyticsCard from "../../../components/user/analytics/WebsiteAnalyticsCard";
import CategoryAnalyticsCard from "../../../components/user/analytics/CategoryAnalyticsCard";
import TabSwitchAnalyticsCard from "../../../components/user/analytics/TabSwitchAnalyticsCard";

import AnalyticsCharts from "../../../components/user/analytics/AnalyticsCharts";

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <div className="min-w-0">

        {/* Header */}

        <AnalyticsHeader />


        {/* Focus Score */}

        <div className="mt-5 min-w-0 sm:mt-6">
          <FocusScoreCard />
        </div>


        {/* Summary Cards */}

        <div className="mt-5 min-w-0 sm:mt-6">
          <AnalyticsSummaryCards />
        </div>


        {/* Activity Summary */}

        <div className="mt-5 min-w-0 sm:mt-6">
          <ActivitySummaryCard />
        </div>


        {/* Website + Category */}

        <div className="mt-5 grid min-w-0 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">
          <WebsiteAnalyticsCard />

          <CategoryAnalyticsCard />
        </div>


        {/* Charts */}

        <div className="mt-5 min-w-0 sm:mt-6">
          <AnalyticsCharts />
        </div>


        {/* Tab Switches */}

        <div className="mt-5 min-w-0 sm:mt-6">
          <TabSwitchAnalyticsCard />
        </div>

      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;