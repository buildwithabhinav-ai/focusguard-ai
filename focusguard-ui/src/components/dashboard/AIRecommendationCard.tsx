import {
  BrainCircuit,
  Sparkles,
  Lightbulb,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAIRecommendation } from "../../hooks/useAIRecommendation";
import { useAuth } from "../../context/AuthContext";

import Skeleton from "../common/Skeleton";

import { useTranslation } from "../../hooks/useTranslation";

import TranslatedText from "../common/TranslatedText";

const AIRecommendationCard = () => {
  const {
    data,
    isLoading,
  } = useAIRecommendation();

  const { user } = useAuth();

  const aiRecommendationText = useTranslation(
    "AI Recommendation"
  );

  const generatedTodayText = useTranslation(
    "Generated Today"
  );

  const focusScoreText = useTranslation(
    "Focus Score"
  );

  const todaysSummaryText = useTranslation(
    "Today's Summary"
  );

  const viewFullReportText = useTranslation(
    "View Full AI Report"
  );

  if (isLoading) {
    return (
      <div
        className="
          min-w-0
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5

          dark:border-slate-700
          dark:bg-slate-900

          sm:p-6
        "
      >
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-4 h-4 w-32" />
        <Skeleton className="mt-6 h-24 w-full" />
        <Skeleton className="mt-6 h-20 w-full" />
      </div>
    );
  }

  const recommendation =
    data?.recommendation ?? "";

  const cleaned =
    recommendation.replaceAll("**", "");

  const sections =
    cleaned
      .split("\n\n")
      .filter(Boolean);

  const preview =
    sections.length > 1
      ? sections[1]
      : sections[0] ??
        "No recommendation available.";

  let aiRoute = "/user/ai";

  if (user?.role === "SUPER_ADMIN") {
    aiRoute = "/superadmin/ai";
  } else if (user?.role === "SUB_ADMIN") {
    aiRoute = "/subadmin/ai";
  }

  return (
    <div
      className="
        min-w-0
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        text-slate-900
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-100
        dark:hover:border-slate-600
        dark:hover:shadow-lg
        dark:hover:shadow-black/20

        sm:p-6
      "
    >

      {/* Header */}

      <div className="mb-5 flex min-w-0 items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <BrainCircuit
            className="
              shrink-0
              text-violet-600
              dark:text-violet-400
            "
            size={22}
          />

          <div className="min-w-0">

            <h2
              className="
                truncate
                text-lg
                font-bold
                text-slate-900
                dark:text-white

                sm:text-xl
              "
            >
              {aiRecommendationText}
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {generatedTodayText}
            </p>

          </div>

        </div>

        <Sparkles
          className="
            shrink-0
            text-violet-600
            dark:text-violet-400
          "
          size={20}
        />

      </div>

      {/* Focus Score */}

      <div
        className="
          rounded-2xl
          bg-violet-50
          p-5

          dark:bg-violet-950/40
        "
      >

        <p
          className="
            text-sm
            font-semibold
            text-violet-700
            dark:text-violet-300
          "
        >
          {focusScoreText}
        </p>

        <h1
          className="
            mt-1
            text-3xl
            font-bold
            text-slate-900
            dark:text-white

            sm:text-4xl
          "
        >
          {data?.focus_score ?? 0}%
        </h1>

      </div>

      {/* Summary */}

      <div className="mt-6">

        <div className="mb-2 flex items-center gap-2">

          <Lightbulb
            size={18}
            className="
              shrink-0
              text-amber-500
              dark:text-amber-400
            "
          />

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-600
              dark:text-slate-300

              sm:text-sm
            "
          >
            {todaysSummaryText}
          </p>

        </div>

        <p
          className="
            line-clamp-5
            text-sm
            leading-7
            text-slate-700
            dark:text-slate-300
          "
        >
          <TranslatedText text={preview} />
        </p>

      </div>

      {/* Full Report */}

      <Link
        to={aiRoute}
        className="
          mt-6
          inline-flex
          w-full
          items-center
          justify-center
          rounded-xl
          bg-violet-600
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition

          hover:bg-violet-700
          active:bg-violet-800

          sm:w-auto
        "
      >
        {viewFullReportText}
      </Link>

    </div>
  );
};

export default AIRecommendationCard;