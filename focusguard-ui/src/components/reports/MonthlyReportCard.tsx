import {
  Activity,
  Clock3,
  Timer,
} from "lucide-react";

import Card from "../common/Card";

import { useMonthlyReport } from "../../hooks/useReports";

import { useTranslation } from "../../hooks/useTranslation";

const MonthlyReportCard = () => {
  const {
    data,
    isLoading,
  } = useMonthlyReport();

  const loadingText = useTranslation(
    "Loading Monthly Report..."
  );

  const noReportText = useTranslation(
    "No monthly report available."
  );

  const monthlyReportText = useTranslation(
    "Monthly Report"
  );

  const last30DaysText = useTranslation(
    "Last 30 days summary"
  );

  const focusScoreText = useTranslation(
    "Focus Score"
  );

  const activeTimeText = useTranslation(
    "Active Time"
  );

  const idleTimeText = useTranslation(
    "Idle Time"
  );

  const totalTimeText = useTranslation(
    "Total Time"
  );

  if (isLoading) {
    return (
      <Card>
        <p
          className="
            break-words
            text-sm
            leading-6
            text-slate-600
            dark:text-slate-300
          "
        >
          {loadingText}
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p
          className="
            break-words
            text-sm
            leading-6
            text-slate-600
            dark:text-slate-300
          "
        >
          {noReportText}
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="
        min-w-0
        border
        border-slate-200
        shadow-sm
        dark:border-slate-700
      "
    >
      <div className="mb-6 min-w-0">
        <h2
          className="
            break-words
            text-xl
            font-bold
            leading-tight
            text-slate-900
            dark:text-white
          "
        >
          {monthlyReportText}
        </h2>

        <p
          className="
            mt-1
            break-words
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {last30DaysText}
        </p>
      </div>

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-4
          sm:grid-cols-2
        "
      >
        {/* Focus */}
        <div
          className="
            min-w-0
            rounded-2xl
            bg-indigo-50
            p-4
            dark:bg-indigo-950/40
          "
        >
          <Activity
            className="text-indigo-600 dark:text-indigo-400"
            size={22}
          />

          <p
            className="
              mt-3
              break-words
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {focusScoreText}
          </p>

          <h3
            className="
              mt-1
              break-words
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {data.focus_score.toFixed(2)}%
          </h3>
        </div>

        {/* Active */}
        <div
          className="
            min-w-0
            rounded-2xl
            bg-green-50
            p-4
            dark:bg-green-950/40
          "
        >
          <Clock3
            className="text-green-600 dark:text-green-400"
            size={22}
          />

          <p
            className="
              mt-3
              break-words
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {activeTimeText}
          </p>

          <h3
            className="
              mt-1
              break-words
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {data.active_time}
          </h3>
        </div>

        {/* Idle */}
        <div
          className="
            min-w-0
            rounded-2xl
            bg-orange-50
            p-4
            dark:bg-orange-950/40
          "
        >
          <Clock3
            className="text-orange-500 dark:text-orange-400"
            size={22}
          />

          <p
            className="
              mt-3
              break-words
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {idleTimeText}
          </p>

          <h3
            className="
              mt-1
              break-words
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {data.idle_time}
          </h3>
        </div>

        {/* Total */}
        <div
          className="
            min-w-0
            rounded-2xl
            bg-violet-50
            p-4
            dark:bg-violet-950/40
          "
        >
          <Timer
            className="text-violet-600 dark:text-violet-400"
            size={22}
          />

          <p
            className="
              mt-3
              break-words
              text-sm
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {totalTimeText}
          </p>

          <h3
            className="
              mt-1
              break-words
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {data.total_time}
          </h3>
        </div>
      </div>
    </Card>
  );
};

export default MonthlyReportCard;