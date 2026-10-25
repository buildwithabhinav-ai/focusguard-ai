import AppLayout from "../../../layouts/AppLayout";

import PlannerHeader from "../../../components/planner/PlannerHeader";
import GoalProgressCard from "../../../components/planner/GoalProgressCard";
import CurrentSessionCard from "../../../components/planner/CurrentSessionCard";
import LiveStatusCard from "../../../components/planner/LiveStatusCard";
import PlannerTimeline from "../../../components/planner/PlannerTimeline";
import PlannerRecommendationCard from "../../../components/planner/PlannerRecommendationCard";

const PlannerPage = () => {
  return (
    <AppLayout>
      {/* =====================================================
          PLANNER HEADER
      ===================================================== */}

      <div className="w-full min-w-0">
        <PlannerHeader />
      </div>

      {/* =====================================================
          PLANNER SUMMARY
      ===================================================== */}

      <div
        className="
          mt-5
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-5
          sm:mt-6
          sm:gap-6
          lg:grid-cols-3
        "
      >
        <div className="min-w-0">
          <GoalProgressCard />
        </div>

        <div className="min-w-0">
          <CurrentSessionCard />
        </div>

        <div className="min-w-0">
          <LiveStatusCard />
        </div>
      </div>

      {/* =====================================================
          TIMELINE + AI RECOMMENDATION
      ===================================================== */}

      <div
        className="
          mt-5
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-5
          sm:mt-6
          sm:gap-6
          lg:grid-cols-3
        "
      >
        <div className="min-w-0 lg:col-span-2">
          <PlannerTimeline />
        </div>

        <div className="min-w-0">
          <PlannerRecommendationCard />
        </div>
      </div>
    </AppLayout>
  );
};

export default PlannerPage;