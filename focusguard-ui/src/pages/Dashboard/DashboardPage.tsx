import AppLayout from "../../layouts/AppLayout";

import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import PlannerCard from "../../components/dashboard/PlannerCard";
import AIRecommendationCard from "../../components/dashboard/AIRecommendationCard";
import WebsiteCard from "../../components/dashboard/WebsiteCard";

import WeeklyActivityChart from "../../components/dashboard/charts/WeeklyActivityChart";
import MonthlyActivityChart from "../../components/dashboard/charts/MonthlyActivityChart";

const DashboardPage = () => {
  return (
    <AppLayout>
      <WelcomeCard />

      <StatsGrid />

      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <WeeklyActivityChart />
        <MonthlyActivityChart />
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <PlannerCard />
        <AIRecommendationCard />
      </div>

      <div className="mt-6">
        <WebsiteCard />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;