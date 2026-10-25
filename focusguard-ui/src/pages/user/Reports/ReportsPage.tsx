import AppLayout from "../../../layouts/AppLayout";

import ReportsHeader from "../../../components/user/reports/ReportsHeader";
import WeeklyReportCard from "../../../components/user/reports/WeeklyReportCard";
import MonthlyReportCard from "../../../components/user/reports/MonthlyReportCard";

import WeeklyReportChart from "../../../components/user/reports/WeeklyReportChart";
import MonthlyReportChart from "../../../components/user/reports/MonthlyReportChart";

const ReportsPage = () => {
  return (
    <AppLayout>
      {/* Header */}

      <ReportsHeader />

      {/* Report Cards */}

      <div className="mt-6 space-y-6">
        <WeeklyReportCard />

        <MonthlyReportCard />
      </div>

      {/* Charts */}

      <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-2">
        <WeeklyReportChart />

        <MonthlyReportChart />
      </div>
    </AppLayout>
  );
};

export default ReportsPage;