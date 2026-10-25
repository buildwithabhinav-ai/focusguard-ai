import CategoryPieChart from "./CategoryPieChart";
import WebsiteBarChart from "./WebsiteBarChart";

const AnalyticsCharts = () => {
  return (
    <div className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-2">
      <CategoryPieChart />

      <WebsiteBarChart />
    </div>
  );
};

export default AnalyticsCharts;