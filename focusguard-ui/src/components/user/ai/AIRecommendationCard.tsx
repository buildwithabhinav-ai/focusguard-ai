import {
  Sparkles,
  BrainCircuit,
} from "lucide-react";

import {
  useAIRecommendation,
} from "../../../hooks/useAI";

import { useTranslation } from "../../../hooks/useTranslation";

import MarkdownText from "../../common/MarkdownText";

const AIRecommendationCard = () => {
  const {
    data,
    isLoading,
  } = useAIRecommendation();

  const loadingText = useTranslation(
    "Loading AI recommendation..."
  );

  const noDataText = useTranslation(
    "No AI recommendation available."
  );

  const title = useTranslation(
    "AI Recommendation"
  );

  const description = useTranslation(
    "Personalized guidance based on your activity"
  );

  const insightTitle = useTranslation(
    "Personalized Insight"
  );

  // Dynamic AI-generated recommendation
  const recommendation = useTranslation(
    data?.recommendation || ""
  );

  if (isLoading) {
    return (
      <div
        className="
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loadingText}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {noDataText}
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20
      "
    >
      <div
        className="
          border-b
          border-slate-200
          p-5

          dark:border-slate-700

          sm:p-6
        "
      >
        <h2
          className="
            flex
            items-center
            gap-2
            text-lg
            font-bold
            text-slate-900

            dark:text-white

            sm:text-xl
          "
        >
          <BrainCircuit
            size={22}
            className="shrink-0 text-indigo-600 dark:text-indigo-400"
          />

          <span>
            {title}
          </span>
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles
            className="shrink-0 text-yellow-500 dark:text-yellow-400"
            size={20}
          />

          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {insightTitle}
          </span>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-4

            dark:border-indigo-900/50
            dark:bg-indigo-950/40

            sm:p-6
          "
        >
          {/* Block content (lists, paragraphs), so not inside a <p>. */}
          <div
            className="
              text-sm
              leading-7
              text-slate-700

              dark:text-slate-200

              sm:text-base
              sm:leading-8
            "
          >
            <MarkdownText text={recommendation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationCard;