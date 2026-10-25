import AppLayout from "../../../layouts/AppLayout";

import AIHeader from "../../../components/user/ai/AIHeader";
import ProductivitySummaryCard from "../../../components/user/ai/ProductivitySummaryCard";
import AIRecommendationCard from "../../../components/user/ai/AIRecommendationCard";

import Chatbot from "../../../components/ai/Chatbot";

const AIPage = () => {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl min-w-0">

        <AIHeader />

        <div className="mt-6 sm:mt-8">
          <ProductivitySummaryCard />
        </div>

        <div className="mt-6 sm:mt-8">
          <AIRecommendationCard />
        </div>

      </div>

      <Chatbot />
    </AppLayout>
  );
};

export default AIPage;