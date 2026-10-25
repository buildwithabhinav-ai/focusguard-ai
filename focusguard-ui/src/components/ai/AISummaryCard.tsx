import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { useAIRecommendation } from "../../hooks/useAIRecommendation";

import { useTranslation } from "../../hooks/useTranslation";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

const AISummaryCard = () => {
  const {
    data,
    isLoading,
    isError,
  } = useAIRecommendation();

  const unableToGenerateText =
    useTranslation(
      "Unable to generate AI summary."
    );

  const noRecommendationText =
    useTranslation(
      "No AI recommendation is available yet."
    );

  const summaryTitle =
    useTranslation(
      "AI Productivity Summary"
    );

  const generatedFromActivityText =
    useTranslation(
      "Generated from your recent activity"
    );

  const aiGeneratedText =
    useTranslation("AI Generated");

  const currentFocusScoreText =
    useTranslation(
      "Current Focus Score"
    );

  const basedOnRecentActivityText =
    useTranslation(
      "Based on recent activity"
    );

  const aiRecommendationText =
    useTranslation(
      "AI Recommendation"
    );

  const productiveWebsitesText =
    useTranslation(
      "Productive Websites"
    );

  const distractingWebsitesText =
    useTranslation(
      "Distracting Websites"
    );

  const identifiedByAIText =
    useTranslation(
      "Identified by AI"
    );

  /*
   * Dynamic AI recommendation.
   */
  const translatedRecommendation =
    useTranslation(
      data?.recommendation ?? ""
    );

  if (isLoading) {
    return (
      <Card
        className="
          min-w-0
          border
          border-slate-200
          bg-white
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <Skeleton className="h-6 w-48" />

        <Skeleton className="mt-4 h-4 w-32" />

        <Skeleton className="mt-6 h-24 w-full" />

        <Skeleton className="mt-6 h-16 w-full" />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card
        className="
          border
          border-slate-200
          bg-white
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <p
          className="
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {unableToGenerateText}
        </p>
      </Card>
    );
  }

  const cleanedRecommendation =
    translatedRecommendation
      ?.replaceAll("**", "")
      .trim() ||
    noRecommendationText;

  return (
    <Card
      className="
        min-w-0
        overflow-hidden
        border
        border-slate-200
        bg-white

        dark:border-slate-700
        dark:bg-slate-900
      "
    >
      {/* Header */}

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl

              bg-violet-100
              text-violet-600

              dark:bg-violet-950/50
              dark:text-violet-400
            "
          >
            <BrainCircuit size={23} />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {summaryTitle}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {generatedFromActivityText}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-xl
            bg-violet-50
            px-3
            py-2
            text-sm
            font-medium
            text-violet-700

            dark:bg-violet-950/40
            dark:text-violet-300
          "
        >
          <Sparkles size={16} />

          {aiGeneratedText}
        </div>
      </div>

      {/* Focus Score */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-indigo-100
          bg-indigo-50
          p-5

          dark:border-indigo-900/50
          dark:bg-indigo-950/40
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-indigo-700
                dark:text-indigo-300
              "
            >
              {currentFocusScoreText}
            </p>

            <p
              className="
                mt-1
                text-xs
                text-indigo-600/80
                dark:text-indigo-400
              "
            >
              {basedOnRecentActivityText}
            </p>
          </div>

          <div
            className="
              text-3xl
              font-bold
              text-indigo-700
              dark:text-indigo-300
              sm:text-4xl
            "
          >
            {data.focus_score.toFixed(1)}%
          </div>
        </div>

        <div
          className="
            mt-4
            h-2
            overflow-hidden
            rounded-full
            bg-indigo-100
            dark:bg-indigo-900/60
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-indigo-600
              transition-all
              duration-700
              dark:bg-indigo-400
            "
            style={{
              width: `${Math.min(
                Math.max(data.focus_score, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Recommendation */}

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <TrendingUp
            size={18}
            className="text-green-600 dark:text-green-400"
          />

          <h3
            className="
              text-sm
              font-semibold
              text-slate-800
              dark:text-slate-200
            "
          >
            {aiRecommendationText}
          </h3>
        </div>

        <div
          className="
            mt-3
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4

            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          <p
            className="
              whitespace-pre-wrap
              break-words
              text-sm
              leading-7
              text-slate-700
              dark:text-slate-200
            "
          >
            {cleanedRecommendation}
          </p>
        </div>
      </div>

      {/* Productivity / Distraction */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-green-100
            bg-green-50
            p-4

            dark:border-green-900/50
            dark:bg-green-950/30
          "
        >
          <div className="flex items-center gap-2">
            <TrendingUp
              size={17}
              className="text-green-600 dark:text-green-400"
            />

            <p
              className="
                text-sm
                font-semibold
                text-green-700
                dark:text-green-300
              "
            >
              {productiveWebsitesText}
            </p>
          </div>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-green-700
              dark:text-green-300
            "
          >
            {data.productive_websites.length}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-green-700/70
              dark:text-green-400
            "
          >
            {identifiedByAIText}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-orange-100
            bg-orange-50
            p-4

            dark:border-orange-900/50
            dark:bg-orange-950/30
          "
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={17}
              className="text-orange-600 dark:text-orange-400"
            />

            <p
              className="
                text-sm
                font-semibold
                text-orange-700
                dark:text-orange-300
              "
            >
              {distractingWebsitesText}
            </p>
          </div>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-orange-700
              dark:text-orange-300
            "
          >
            {data.distracting_websites.length}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-orange-700/70
              dark:text-orange-400
            "
          >
            {identifiedByAIText}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AISummaryCard;