import AppLayout from "../../../layouts/AppLayout";

import PlannerHeader from "../../../components/user/planner/PlannerHeader";
import TodayPlannerCard from "../../../components/user/planner/TodayPlannerCard";
import PlannerProgressCard from "../../../components/user/planner/PlannerProgressCard";
import CurrentSessionCard from "../../../components/user/planner/CurrentSessionCard";
import LiveStatusCard from "../../../components/user/planner/LiveStatusCard";
import PlannerRecommendationCard from "../../../components/user/planner/PlannerRecommendationCard";

const PlannerPage = () => {
  return (
    <AppLayout>
      <div className="min-w-0">

        {/* Page Header */}

        <PlannerHeader />

        {/* Planner Content */}

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Left Section */}

          <div className="min-w-0 space-y-6 xl:col-span-2">

            <TodayPlannerCard />

            <PlannerRecommendationCard />

          </div>

          {/* Right Section */}

          <div className="min-w-0 space-y-6">

            <PlannerProgressCard />

            <CurrentSessionCard />

            <LiveStatusCard />

          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default PlannerPage;