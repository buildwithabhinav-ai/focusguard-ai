import {
  BarChart3,
  TrendingUp,
  Globe2,
  Activity,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const AnalyticsSection = () => {
  const badgeText = useTranslation(
    "Weekly Analytics"
  );

  const titleOneText = useTranslation(
    "Productivity Overview"
  );

  const activeTimeText = useTranslation(
    "Active Time"
  );

  const websitesText = useTranslation(
    "Websites"
  );

  const productivityAnalyticsText = useTranslation(
    "Productivity Analytics"
  );

  const titleTwoText = useTranslation(
    "Visualize Your Productivity"
  );

  const descriptionText = useTranslation(
    "Understand where your time goes with interactive productivity reports, website insights, focus trends, and performance analytics."
  );

  const reportsText = useTranslation(
    "Interactive Productivity Reports"
  );

  const focusTrendsText = useTranslation(
    "Daily & Weekly Focus Trends"
  );

  const categoryBreakdownText = useTranslation(
    "Website Category Breakdown"
  );

  const activeIdleText = useTranslation(
    "Active vs Idle Analysis"
  );

  return (
    <section className="overflow-hidden bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Analytics Preview */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              {/* Header */}
              <div className="flex min-w-0 items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <BarChart3 size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      {productivityAnalyticsText}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {badgeText}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  7D
                </span>
              </div>

              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6">
                <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activeTimeText}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    32h
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={13} />
                    <span>+14%</span>
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activeTimeText}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400 sm:text-3xl">
                    87%
                  </p>

                  <div className="mt-2 break-words text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeIdleText}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 sm:p-5">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="break-words text-sm font-bold text-slate-900 dark:text-white">
                      {titleOneText}
                    </p>

                    <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Mon – Sun
                    </span>
                  </div>

                  {/* Simple chart */}
                  <div className="flex h-40 items-end gap-2 sm:h-48 sm:gap-3">
                    <ChartBar height="42%" />
                    <ChartBar height="58%" />
                    <ChartBar height="50%" />
                    <ChartBar height="72%" />
                    <ChartBar height="64%" />
                    <ChartBar height="84%" />
                    <ChartBar height="76%" />
                  </div>

                  <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[10px] text-slate-400 sm:text-xs">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>
                </div>
              </div>

              {/* Website Insights */}
              <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-6 sm:pb-6">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Globe2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {websitesText}
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                        42
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Activity size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                        {focusTrendsText}
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                        +18%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="min-w-0">
            {/* Badge */}
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300 sm:px-4 sm:text-sm">
              <BarChart3
                size={16}
                className="shrink-0"
              />

              <span className="break-words">
                {productivityAnalyticsText}
              </span>
            </div>

            {/* Heading */}
            <h2 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="block">
                {titleTwoText}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
              {descriptionText}
            </p>

            {/* Analytics Features */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AnalyticsFeature
                icon={BarChart3}
                title={reportsText}
              />

              <AnalyticsFeature
                icon={TrendingUp}
                title={focusTrendsText}
              />

              <AnalyticsFeature
                icon={Globe2}
                title={categoryBreakdownText}
              />

              <AnalyticsFeature
                icon={Activity}
                title={activeIdleText}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface AnalyticsFeatureProps {
  icon: React.ElementType;
  title: string;
}

const AnalyticsFeature = ({
  icon: Icon,
  title,
}: AnalyticsFeatureProps) => {
  const translatedTitle = useTranslation(title);

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Icon size={19} />
      </div>

      <p className="break-words pt-1 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200 sm:text-base">
        {translatedTitle}
      </p>
    </div>
  );
};

interface ChartBarProps {
  height: string;
}

const ChartBar = ({
  height,
}: ChartBarProps) => {
  return (
    <div className="flex h-full flex-1 items-end">
      <div
        className="w-full rounded-t-lg bg-indigo-500/80 transition-all duration-300 hover:bg-indigo-600 dark:bg-indigo-500/70 dark:hover:bg-indigo-500"
        style={{ height }}
      />
    </div>
  );
};

export default AnalyticsSection;