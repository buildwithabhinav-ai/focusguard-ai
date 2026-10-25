import AppLayout from "../../../layouts/AppLayout";

import WelcomeCard from "../../../components/dashboard/WelcomeCard";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import WeeklyActivityChart from "../../../components/dashboard/charts/WeeklyActivityChart";
import MonthlyActivityChart from "../../../components/dashboard/charts/MonthlyActivityChart";
import WebsiteCard from "../../../components/dashboard/WebsiteCard";
import RoleCategoryPieChart from "../../../components/analytics/RoleCategoryPieChart";
import RoleWebsiteBarChart from "../../../components/analytics/RoleWebsiteBarChart";

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="w-full min-w-0">
        <WelcomeCard />
      </div>

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <StatsGrid />
      </div>

      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <WeeklyActivityChart />
        </div>
        <div className="min-w-0">
          <MonthlyActivityChart />
        </div>
      </div>

      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <RoleCategoryPieChart />
        </div>
        <div className="min-w-0">
          <RoleWebsiteBarChart />
        </div>
      </div>

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <WebsiteCard />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
