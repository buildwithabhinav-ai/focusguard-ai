import AppLayout from "../../../layouts/AppLayout";

import ReportsHeader from "../../../components/reports/ReportsHeader";
import WeeklyReportCard from "../../../components/reports/WeeklyReportCard";
import MonthlyReportCard from "../../../components/reports/MonthlyReportCard";
import ExportButtons from "../../../components/reports/ExportButtons";

import WeeklyActivityChart from "../../../components/dashboard/charts/WeeklyActivityChart";
import MonthlyActivityChart from "../../../components/dashboard/charts/MonthlyActivityChart";

const ReportsPage = () => {
  return (
    <AppLayout>
      <div className="w-full min-w-0">
        <ReportsHeader />

        {/* Weekly + Monthly Reports */}
        <div
          className="
            mt-6
            grid
            min-w-0
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >
          <WeeklyReportCard />

          <MonthlyReportCard />
        </div>

        {/* Weekly Activity */}
        <div className="mt-6 min-w-0">
          <WeeklyActivityChart />
        </div>

        {/* Monthly Activity */}
        <div className="mt-6 min-w-0">
          <MonthlyActivityChart />
        </div>

        {/* Export */}
        <div className="mt-6 min-w-0 pb-6">
          <ExportButtons />
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;