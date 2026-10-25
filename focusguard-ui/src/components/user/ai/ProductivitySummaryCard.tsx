import {
  BrainCircuit,
  Clock3,
  Target,
} from "lucide-react";

import {
  useAIRecommendation,
} from "../../../hooks/useAI";

import { useTranslation } from "../../../hooks/useTranslation";

const ProductivitySummaryCard = () => {
  const {
    data,
    isLoading,
  } = useAIRecommendation();

  const loadingText = useTranslation(
    "Loading AI summary..."
  );

  const noDataText = useTranslation(
    "No productivity data available."
  );

  const title = useTranslation(
    "Today's Productivity Summary"
  );

  const description = useTranslation(
    "Overview of your current productivity"
  );

  const activeTime = useTranslation(
    "Active Time"
  );

  const idleTime = useTranslation(
    "Idle Time"
  );

  const focusScore = useTranslation(
    "Focus Score"
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
          dark:shadow-black/20

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

      <div
        className="
          grid
          grid-cols-1
          gap-4
          p-5

          sm:grid-cols-2
          sm:gap-5
          sm:p-6

          md:grid-cols-3
        "
      >
        {/* Active Time */}

        <div
          className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-5

            dark:border-indigo-900/50
            dark:bg-indigo-950/40
          "
        >
          <Clock3
            className="mb-3 text-indigo-600 dark:text-indigo-400"
            size={24}
          />

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {activeTime}
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900

              dark:text-white

              sm:text-3xl
            "
          >
            {data.active_time}
          </h3>
        </div>

        {/* Idle Time */}

        <div
          className="
            rounded-2xl
            border
            border-yellow-100
            bg-yellow-50
            p-5

            dark:border-yellow-900/50
            dark:bg-yellow-950/40
          "
        >
          <Clock3
            className="mb-3 text-yellow-600 dark:text-yellow-400"
            size={24}
          />

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {idleTime}
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-900

              dark:text-white

              sm:text-3xl
            "
          >
            {data.idle_time}
          </h3>
        </div>

        {/* Focus Score */}

        <div
          className="
            rounded-2xl
            border
            border-green-100
            bg-green-50
            p-5

            dark:border-green-900/50
            dark:bg-green-950/40

            sm:col-span-2
            md:col-span-1
          "
        >
          <Target
            className="mb-3 text-green-600 dark:text-green-400"
            size={24}
          />

          <p className="text-sm text-slate-600 dark:text-slate-400">
            {focusScore}
          </p>

          <h3
            className="
              mt-1
              text-2xl
              font-bold
              text-green-700

              dark:text-green-400

              sm:text-3xl
            "
          >
            {data.focus_score}%
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductivitySummaryCard;