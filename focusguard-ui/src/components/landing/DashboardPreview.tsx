import {
  Activity,
  BarChart3,
  Brain,
  CalendarCheck,
  Globe,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const DashboardPreview = () => {
  const dashboardText = useTranslation("Dashboard");

  const todaysProductivityText = useTranslation(
    "Today's Productivity"
  );

  const activeText = useTranslation(
    "Active"
  );

  const focusScoreText = useTranslation(
    "Focus Score"
  );

  const plannerText = useTranslation(
    "Planner"
  );

  const backendDevelopmentText = useTranslation(
    "Backend Development"
  );

  const aiInsightText = useTranslation(
    "AI Insight"
  );

  const excellentFocusText = useTranslation(
    "Excellent focus. Continue for another 25 minutes."
  );

  const topWebsitesText = useTranslation(
    "Top Websites"
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      {/* Dashboard Header */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            F
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
              {dashboardText}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {todaysProductivityText}
            </p>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {activeText}
        </span>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-4 p-4 sm:p-5">
        {/* Productivity / Focus Score */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <BarChart3
                  size={17}
                  className="shrink-0 text-indigo-600 dark:text-indigo-400"
                />

                <span className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                  {todaysProductivityText}
                </span>
              </div>

              <span className="shrink-0 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                87%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full w-[87%] rounded-full bg-indigo-600" />
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Activity
                size={17}
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <span className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                {focusScoreText}
              </span>
            </div>

            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                92
              </span>

              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                +12%
              </span>
            </div>
          </div>
        </div>

        {/* Planner */}
        <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <CalendarCheck
                size={17}
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <span className="break-words text-sm font-bold text-slate-900 dark:text-white">
                {plannerText}
              </span>
            </div>

            <span className="shrink-0 text-xs font-medium text-slate-400">
              09:00 - 11:00
            </span>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Activity size={17} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                {backendDevelopmentText}
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                09:00 - 11:00
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="min-w-0 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/30">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Brain size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                {aiInsightText}
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                {excellentFocusText}
              </p>
            </div>
          </div>
        </div>

        {/* Top Websites */}
        <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe
              size={17}
              className="shrink-0 text-indigo-600 dark:text-indigo-400"
            />

            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {topWebsitesText}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <WebsiteRow
              name="GitHub"
              time="2h 15m"
              percentage="54%"
            />

            <WebsiteRow
              name="VS Code"
              time="4h 08m"
              percentage="78%"
            />

            <WebsiteRow
              name="ChatGPT"
              time="1h 12m"
              percentage="32%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface WebsiteRowProps {
  name: string;
  time: string;
  percentage: string;
}

const WebsiteRow = ({
  name,
  time,
  percentage,
}: WebsiteRowProps) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {name.charAt(0)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm">
            {name}
          </span>

          <span className="shrink-0 text-[10px] font-medium text-slate-400 sm:text-xs">
            {time}
          </span>
        </div>

        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-500"
            style={{
              width: percentage,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;