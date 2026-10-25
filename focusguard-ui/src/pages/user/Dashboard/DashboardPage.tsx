import AppLayout from "../../../layouts/AppLayout";

import WelcomeCard from "../../../components/user/dashboard/WelcomeCard";
import QuickStats from "../../../components/user/dashboard/QuickStats";
import PlannerPreview from "../../../components/user/dashboard/PlannerPreview";
import CurrentSessionPreview from "../../../components/user/dashboard/CurrentSessionPreview";
import LiveStatusWidget from "../../../components/user/dashboard/LiveStatusWidget";
import AIRecommendationCard from "../../../components/user/dashboard/AIRecommendationCard";

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="w-full min-w-0 overflow-x-hidden">

        {/* ================================
            Welcome
        ================================ */}

        <div className="w-full min-w-0">
          <WelcomeCard />
        </div>

        {/* ================================
            Quick Stats
        ================================ */}

        <div className="mt-6 w-full min-w-0 sm:mt-8">
          <QuickStats />
        </div>

        {/* ================================
            Planner + Current Session
        ================================ */}

        <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 sm:mt-8 lg:gap-8 xl:grid-cols-3">

          <div className="min-w-0 xl:col-span-2">
            <PlannerPreview />
          </div>

          <div className="min-w-0">
            <CurrentSessionPreview />
          </div>

        </div>

        {/* ================================
            Live Status + AI Recommendation
        ================================ */}

        <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-6 sm:mt-8 lg:gap-8 xl:grid-cols-2">

          <div className="min-w-0">
            <LiveStatusWidget />
          </div>

          <div className="min-w-0">
            <AIRecommendationCard />
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default DashboardPage;