import {
  BrainCircuit,
  Globe,
  Tags,
  CheckCircle2,
  AlertTriangle,
  MousePointerClick,
  Clock3,
} from "lucide-react";

import { useAIRecommendation } from "../../hooks/useAIRecommendation";

import { useTranslation } from "../../hooks/useTranslation";

import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

const AIReportCard = () => {
  const {
    data,
    isLoading,
    isError,
  } = useAIRecommendation();

  const unableToLoadText =
    useTranslation(
      "Unable to load AI report."
    );

  const noRecommendationText =
    useTranslation(
      "No recommendation available."
    );

  const aiProductivityReportText =
    useTranslation(
      "AI Productivity Report"
    );

  const productiveTimeText =
    useTranslation("Productive Time");

  const nonProductiveText =
    useTranslation("Non-Productive");

  const focusScoreText =
    useTranslation("Focus Score");

  const tabSwitchesText =
    useTranslation("Tab Switches");

  const productiveWebsitesText =
    useTranslation("Productive Websites");

  const distractingWebsitesText =
    useTranslation(
      "Distracting Websites"
    );

  const noProductiveWebsitesText =
    useTranslation(
      "No productive websites identified."
    );

  const noDistractingWebsitesText =
    useTranslation(
      "No distracting websites identified."
    );

  const topCategoriesText =
    useTranslation(
      "Top Activity Categories"
    );

  const noCategoriesText =
    useTranslation(
      "No categories available."
    );

  const mostUsedWebsitesText =
    useTranslation(
      "Most Used Websites"
    );

  const noWebsiteDataText =
    useTranslation(
      "No website data available."
    );

  const aiRecommendationText =
    useTranslation(
      "AI Recommendation"
    );

  const footerText =
    useTranslation(
      "This report is generated using recent activity and AI-based productivity analysis."
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
        <Skeleton className="h-6 w-52" />

        <Skeleton className="mt-4 h-4 w-40" />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>

        <Skeleton className="mt-6 h-32 w-full" />
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
          {unableToLoadText}
        </p>
      </Card>
    );
  }

  const recommendation =
    translatedRecommendation.trim() ||
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
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
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
                truncate
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {aiProductivityReportText}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {data.period}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          <Clock3 size={16} className="shrink-0" />

          <span className="break-words">
            {new Date(
              data.generated_at
            ).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Productivity Metrics */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        <div
          className="
            rounded-2xl
            bg-green-50
            p-4
            dark:bg-green-950/30
          "
        >
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-green-700
              dark:text-green-300
            "
          >
            {productiveTimeText}
          </p>

          <p
            className="
              mt-2
              text-xl
              font-bold
              text-green-700
              dark:text-green-300
            "
          >
            {data.productive_time}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-orange-50
            p-4
            dark:bg-orange-950/30
          "
        >
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-orange-700
              dark:text-orange-300
            "
          >
            {nonProductiveText}
          </p>

          <p
            className="
              mt-2
              text-xl
              font-bold
              text-orange-700
              dark:text-orange-300
            "
          >
            {data.non_productive_time}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-indigo-50
            p-4
            dark:bg-indigo-950/30
          "
        >
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-indigo-700
              dark:text-indigo-300
            "
          >
            {focusScoreText}
          </p>

          <p
            className="
              mt-2
              text-xl
              font-bold
              text-indigo-700
              dark:text-indigo-300
            "
          >
            {data.focus_score.toFixed(1)}%
          </p>
        </div>

        <div
          className="
            rounded-2xl
            bg-violet-50
            p-4
            dark:bg-violet-950/30
          "
        >
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-violet-700
              dark:text-violet-300
            "
          >
            {tabSwitchesText}
          </p>

          <p
            className="
              mt-2
              text-xl
              font-bold
              text-violet-700
              dark:text-violet-300
            "
          >
            {data.tab_switches}
          </p>
        </div>
      </div>

      {/* Websites */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-2
        "
      >
        {/* Productive */}

        <div
          className="
            rounded-2xl
            border
            border-green-200
            bg-green-50/70
            p-5

            dark:border-green-900/50
            dark:bg-green-950/20
          "
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={19}
              className="text-green-600 dark:text-green-400"
            />

            <h3
              className="
                font-semibold
                text-green-800
                dark:text-green-300
              "
            >
              {productiveWebsitesText}
            </h3>
          </div>

          <div className="mt-4 space-y-2">
            {data.productive_websites.length > 0 ? (
              data.productive_websites.map(
                (website) => (
                  <div
                    key={website}
                    className="
                      flex
                      min-w-0
                      items-start
                      gap-2
                      rounded-xl
                      bg-white
                      p-3

                      dark:bg-slate-900
                    "
                  >
                    <Globe
                      size={16}
                      className="
                        mt-0.5
                        shrink-0
                        text-green-600
                        dark:text-green-400
                      "
                    />

                    <span
                      className="
                        min-w-0
                        break-all
                        text-sm
                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      {website}
                    </span>
                  </div>
                )
              )
            ) : (
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {noProductiveWebsitesText}
              </p>
            )}
          </div>
        </div>

        {/* Distracting */}

        <div
          className="
            rounded-2xl
            border
            border-orange-200
            bg-orange-50/70
            p-5

            dark:border-orange-900/50
            dark:bg-orange-950/20
          "
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={19}
              className="text-orange-600 dark:text-orange-400"
            />

            <h3
              className="
                font-semibold
                text-orange-800
                dark:text-orange-300
              "
            >
              {distractingWebsitesText}
            </h3>
          </div>

          <div className="mt-4 space-y-2">
            {data.distracting_websites.length > 0 ? (
              data.distracting_websites.map(
                (website) => (
                  <div
                    key={website}
                    className="
                      flex
                      min-w-0
                      items-start
                      gap-2
                      rounded-xl
                      bg-white
                      p-3

                      dark:bg-slate-900
                    "
                  >
                    <Globe
                      size={16}
                      className="
                        mt-0.5
                        shrink-0
                        text-orange-600
                        dark:text-orange-400
                      "
                    />

                    <span
                      className="
                        min-w-0
                        break-all
                        text-sm
                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      {website}
                    </span>
                  </div>
                )
              )
            ) : (
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {noDistractingWebsitesText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Tags
            size={19}
            className="text-indigo-600 dark:text-indigo-400"
          />

          <h3
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {topCategoriesText}
          </h3>
        </div>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {data.top_categories.length > 0 ? (
            data.top_categories.map(
              (category) => (
                <span
                  key={category}
                  className="
                    max-w-full
                    break-words
                    rounded-full
                    bg-indigo-100
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-indigo-700

                    dark:bg-indigo-950/60
                    dark:text-indigo-300
                  "
                >
                  {category}
                </span>
              )
            )
          ) : (
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {noCategoriesText}
            </p>
          )}
        </div>
      </div>

      {/* Top Websites */}

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Globe
            size={19}
            className="text-violet-600 dark:text-violet-400"
          />

          <h3
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {mostUsedWebsitesText}
          </h3>
        </div>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          {data.top_websites.length > 0 ? (
            data.top_websites.map(
              (website) => (
                <span
                  key={website}
                  className="
                    max-w-full
                    break-all
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-slate-700

                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-200
                  "
                >
                  {website}
                </span>
              )
            )
          ) : (
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {noWebsiteDataText}
            </p>
          )}
        </div>
      </div>

      {/* Recommendation */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-violet-200
          bg-violet-50
          p-5

          dark:border-violet-900/50
          dark:bg-violet-950/30
        "
      >
        <div className="flex items-center gap-2">
          <BrainCircuit
            size={19}
            className="text-violet-600 dark:text-violet-400"
          />

          <h3
            className="
              font-semibold
              text-violet-800
              dark:text-violet-300
            "
          >
            {aiRecommendationText}
          </h3>
        </div>

        <p
          className="
            mt-3
            whitespace-pre-wrap
            break-words
            text-sm
            leading-7
            text-slate-700
            dark:text-slate-200
          "
        >
          {recommendation}
        </p>
      </div>

      {/* Footer */}

      <div
        className="
          mt-5
          flex
          items-start
          gap-2
          border-t
          border-slate-200
          pt-4
          text-xs
          text-slate-500

          dark:border-slate-700
          dark:text-slate-400
        "
      >
        <MousePointerClick
          size={15}
          className="mt-0.5 shrink-0"
        />

        <span>
          {footerText}
        </span>
      </div>
    </Card>
  );
};

export default AIReportCard;