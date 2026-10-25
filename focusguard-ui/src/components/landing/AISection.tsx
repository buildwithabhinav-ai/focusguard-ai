import {
  Brain,
  TrendingUp,
  Activity,
  Lightbulb,
} from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const AISection = () => {
  const badgeText = useTranslation("AI Powered Insights");

  const titleOneText = useTranslation("Personalized");
  const titleTwoText = useTranslation("AI Recommendations");

  const descriptionText = useTranslation(
    "FocusGuard AI studies your productivity patterns, browser activity, planner progress, and focus score to generate intelligent recommendations that help you work more efficiently."
  );

  const adaptiveRecommendationsText = useTranslation(
    "Adaptive AI Recommendations"
  );

  const focusScoreImprovementText = useTranslation(
    "Focus Score Improvement"
  );

  const behaviourPatternText = useTranslation(
    "Behaviour Pattern Analysis"
  );

  const aiInsightText = useTranslation("AI Insight");
  const generatedJustNowText = useTranslation(
    "Generated just now"
  );

  const excellentWorkText = useTranslation(
    "Excellent work today!"
  );

  const scoreDescriptionText = useTranslation(
    "Your focus score has increased by 12% compared to yesterday."
  );

  const focusScoreText = useTranslation("Focus Score");

  const reducedWebsitesText = useTranslation(
    "Reduced distracting websites by 28%"
  );

  const bestProductivityText = useTranslation(
    "Best productivity: 09:00–11:30 AM"
  );

  const recommendationText = useTranslation(
    "Recommendation"
  );

  const recommendationDescriptionText = useTranslation(
    "Continue your current coding session for another 25 minutes, then take a 10-minute break."
  );

  return (
    <section className="overflow-hidden bg-slate-50 py-16 dark:bg-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Badge */}
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/50 dark:text-indigo-300 sm:px-4 sm:text-sm">
              <Brain
                size={16}
                className="shrink-0"
              />

              <span className="break-words">
                {badgeText}
              </span>
            </div>

            {/* Heading */}
            <h2 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="block">
                {titleOneText}
              </span>

              <span className="block text-indigo-600 dark:text-indigo-400">
                {titleTwoText}
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-2xl break-words text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
              {descriptionText}
            </p>

            {/* AI Benefits */}
            <div className="mt-8 space-y-5">
              <AIHighlight
                icon={Brain}
                title={adaptiveRecommendationsText}
              />

              <AIHighlight
                icon={TrendingUp}
                title={focusScoreImprovementText}
              />

              <AIHighlight
                icon={Activity}
                title={behaviourPatternText}
              />
            </div>
          </div>

          {/* Right AI Insight Card */}
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-7 lg:p-8">
              {/* Decorative background */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

              {/* Card Header */}
              <div className="relative flex min-w-0 items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Brain size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                      {aiInsightText}
                    </p>

                    <p className="mt-0.5 break-words text-xs text-slate-500 dark:text-slate-400">
                      {generatedJustNowText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Insight */}
              <div className="relative mt-7 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70 sm:p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                  />

                  <div className="min-w-0">
                    <h3 className="break-words text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {excellentWorkText}
                    </h3>

                    <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {scoreDescriptionText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="break-words text-xs font-medium text-slate-500 dark:text-slate-400">
                    {focusScoreText}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    +12%
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="break-words text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                    {reducedWebsitesText}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    28%
                  </p>
                </div>
              </div>

              {/* Productivity */}
              <div className="relative mt-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                  {bestProductivityText}
                </p>
              </div>

              {/* Recommendation */}
              <div className="relative mt-5 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/30 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {recommendationText}
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {recommendationDescriptionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface AIHighlightProps {
  icon: React.ElementType;
  title: string;
}

const AIHighlight = ({
  icon: Icon,
  title,
}: AIHighlightProps) => {
  const translatedTitle = useTranslation(title);

  return (
    <div className="flex min-w-0 items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h3 className="break-words text-sm font-bold text-slate-900 dark:text-white sm:text-base">
          {translatedTitle}
        </h3>
      </div>
    </div>
  );
};

export default AISection;