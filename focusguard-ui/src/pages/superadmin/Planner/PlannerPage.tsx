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
      <PlannerHeader />

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3">
        <GoalProgressCard />

        <CurrentSessionCard />

        <LiveStatusCard />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3">
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