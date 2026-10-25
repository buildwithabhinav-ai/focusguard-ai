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

      {/* Reports Header */}

      <div className="w-full min-w-0">
        <ReportsHeader />
      </div>


      {/* Report Cards */}

      <div className="mt-5 grid w-full min-w-0 grid-cols-1 gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-2">

        <div className="min-w-0">
          <WeeklyReportCard />
        </div>

        <div className="min-w-0">
          <MonthlyReportCard />
        </div>

      </div>


      {/* Weekly Activity */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <WeeklyActivityChart />
      </div>


      {/* Monthly Activity */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <MonthlyActivityChart />
      </div>


      {/* Export Buttons */}

      <div className="mt-5 w-full min-w-0 sm:mt-6">
        <ExportButtons />
      </div>

    </AppLayout>
  );
};

export default ReportsPage;