import { Download } from "lucide-react";

import {
  useWeeklyReport,
  useMonthlyReport,
} from "../../hooks/useReports";

import { useDashboard } from "../../hooks/useDashboard";

import { exportReportPDF } from "../../utils/pdf";

import { useTranslation } from "../../hooks/useTranslation";

const ExportButtons = () => {
  const { data: weekly } =
    useWeeklyReport();

  const { data: monthly } =
    useMonthlyReport();

  const { data: dashboard } =
    useDashboard();

  const exportReportsText =
    useTranslation("Export Reports");

  const exportDescriptionText =
    useTranslation(
      "Download your productivity reports in different formats."
    );

  const weeklyJSONText =
    useTranslation("Weekly JSON");

  const monthlyJSONText =
    useTranslation("Monthly JSON");

  const weeklyCSVText =
    useTranslation("Weekly CSV");

  const monthlyCSVText =
    useTranslation("Monthly CSV");

  const weeklyPDFText =
    useTranslation("Weekly PDF");

  const monthlyPDFText =
    useTranslation("Monthly PDF");

  const downloadJSON = (
    filename: string,
    data: unknown
  ) => {
    if (!data) return;

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const downloadCSV = (
    filename: string,
    report: any
  ) => {
    if (!report) return;

    let csv = "Field,Value\n";

    csv += `Report Type,${report.report_type}\n`;
    csv += `Start Date,${report.start_date}\n`;
    csv += `End Date,${report.end_date}\n`;
    csv += `Focus Score,${report.focus_score}\n`;
    csv += `Active Time,${report.active_time}\n`;
    csv += `Idle Time,${report.idle_time}\n`;
    csv += `Total Time,${report.total_time}\n`;

    csv += "\n";

    if (report.daily_breakdown) {
      csv += "Day,Active Time,Idle Time\n";

      report.daily_breakdown.forEach(
        (item: any) => {
          csv += `${item.day},${item.active_time},${item.idle_time}\n`;
        }
      );
    }

    if (report.weekly_breakdown) {
      csv += "Week,Active Time,Idle Time\n";

      report.weekly_breakdown.forEach(
        (item: any) => {
          csv += `${item.week},${item.active_time},${item.idle_time}\n`;
        }
      );
    }

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportButtonBase = `
    flex
    min-h-[46px]
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    px-4
    py-3
    text-sm
    font-medium
    transition
    sm:w-auto
    sm:px-5
  `;

  return (
    <div
      className="
        min-w-0
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-700
        dark:bg-slate-900
        sm:p-6
      "
    >
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
        {exportReportsText}
      </h2>

      <p
        className="
          mt-2
          max-w-2xl
          break-words
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        {exportDescriptionText}
      </p>

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-3
          sm:flex
          sm:flex-wrap
          sm:gap-4
        "
      >
        {/* Weekly JSON */}
        <button
          type="button"
          onClick={() =>
            downloadJSON(
              "weekly-report.json",
              weekly
            )
          }
          className={`
            ${exportButtonBase}
            bg-indigo-600
            text-white
            hover:bg-indigo-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {weeklyJSONText}
          </span>
        </button>

        {/* Monthly JSON */}
        <button
          type="button"
          onClick={() =>
            downloadJSON(
              "monthly-report.json",
              monthly
            )
          }
          className={`
            ${exportButtonBase}
            bg-violet-600
            text-white
            hover:bg-violet-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {monthlyJSONText}
          </span>
        </button>

        {/* Weekly CSV */}
        <button
          type="button"
          onClick={() =>
            downloadCSV(
              "weekly-report.csv",
              weekly
            )
          }
          className={`
            ${exportButtonBase}
            border
            border-slate-300
            bg-white
            text-slate-700
            hover:bg-slate-100
            dark:border-slate-600
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:bg-slate-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {weeklyCSVText}
          </span>
        </button>

        {/* Monthly CSV */}
        <button
          type="button"
          onClick={() =>
            downloadCSV(
              "monthly-report.csv",
              monthly
            )
          }
          className={`
            ${exportButtonBase}
            border
            border-slate-300
            bg-white
            text-slate-700
            hover:bg-slate-100
            dark:border-slate-600
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:bg-slate-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {monthlyCSVText}
          </span>
        </button>

        {/* Weekly PDF */}
        <button
          type="button"
          onClick={() => {
            if (
              weekly &&
              dashboard?.user
            ) {
              exportReportPDF(
                weekly,
                dashboard.user
              );
            }
          }}
          className={`
            ${exportButtonBase}
            bg-red-600
            text-white
            hover:bg-red-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {weeklyPDFText}
          </span>
        </button>

        {/* Monthly PDF */}
        <button
          type="button"
          onClick={() => {
            if (
              monthly &&
              dashboard?.user
            ) {
              exportReportPDF(
                monthly,
                dashboard.user
              );
            }
          }}
          className={`
            ${exportButtonBase}
            bg-rose-600
            text-white
            hover:bg-rose-700
          `}
        >
          <Download
            size={18}
            className="shrink-0"
          />
          <span className="break-words">
            {monthlyPDFText}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;