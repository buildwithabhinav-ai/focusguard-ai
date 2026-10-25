import AppLayout from "../../../layouts/AppLayout";

import { useAIRecommendation } from "../../../hooks/useAIRecommendation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  BrainCircuit,
  Sparkles,
} from "lucide-react";

import Chatbot from "../../../components/ai/Chatbot";

import { useTranslation } from "../../../hooks/useTranslation";

const AIPage = () => {
  const {
    data,
    isLoading,
    isError,
  } = useAIRecommendation();

  const loadingText = useTranslation(
    "Loading AI Report..."
  );

  const unableToLoadText = useTranslation(
    "Unable to load AI report"
  );

  const tryAgainText = useTranslation(
    "Please try again later."
  );

  const reportTitle = useTranslation(
    "AI Productivity Report"
  );

  const generatedAtText = useTranslation(
    "Generated at"
  );

  /*
   * AI-generated recommendation is dynamic content.
   *
   * useTranslation() will:
   * 1. Return English when language = en.
   * 2. Check static translation if available.
   * 3. Fall back to Sarvam dynamic translation.
   * 4. Fall back to original recommendation if translation fails.
   */
  const translatedRecommendation =
    useTranslation(
      data?.recommendation ?? ""
    );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="w-full min-w-0">
          <div
            className="
              flex
              min-h-[400px]
              items-center
              justify-center
              rounded-3xl
              border
              border-slate-200
              bg-white
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-100
                  text-violet-600

                  dark:bg-violet-950/50
                  dark:text-violet-400
                "
              >
                <BrainCircuit size={28} />
              </div>

              <p
                className="
                  mt-4
                  text-base
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {loadingText}
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !data) {
    return (
      <AppLayout>
        <div
          className="
            w-full
            min-w-0
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm

            dark:border-slate-700
            dark:bg-slate-900

            sm:p-8
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-red-600

                dark:bg-red-950/50
                dark:text-red-400
              "
            >
              <BrainCircuit size={28} />
            </div>

            <h2
              className="
                mt-4
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {unableToLoadText}
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {tryAgainText}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-w-0">
        <div className="mx-auto w-full max-w-6xl min-w-0">

          {/* ================================================
              HEADER
          ================================================= */}

          <div
            className="
              mb-6
              flex
              min-w-0
              flex-col
              gap-5

              sm:mb-8
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div className="min-w-0">
              <h1
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900

                  dark:text-white

                  sm:text-3xl
                  lg:text-4xl
                "
              >
                <BrainCircuit
                  className="
                    shrink-0
                    text-violet-600
                    dark:text-violet-400
                  "
                  size={30}
                />

                <span className="break-words">
                  {reportTitle}
                </span>
              </h1>

              <p
                className="
                  mt-2
                  break-words
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                  sm:mt-3
                  sm:text-base
                "
              >
                {generatedAtText}{" "}
                {data.generated_at}
              </p>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                self-start
                rounded-2xl
                bg-violet-100

                dark:bg-violet-950/50

                sm:h-12
                sm:w-12
                sm:self-center
              "
            >
              <Sparkles
                className="
                  text-violet-600
                  dark:text-violet-400
                "
                size={24}
              />
            </div>
          </div>

          {/* ================================================
              AI REPORT
          ================================================= */}

          <div
            className="
              w-full
              min-w-0
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm

              dark:border-slate-700
              dark:bg-slate-900
              dark:shadow-black/20

              sm:p-7
              lg:p-10
            "
          >
            <article
              className="
                prose
                prose-slate
                max-w-none

                prose-headings:text-slate-900
                prose-p:text-slate-700
                prose-strong:text-slate-900
                prose-li:text-slate-700
                prose-a:text-violet-600

                dark:prose-invert
                dark:prose-headings:text-white
                dark:prose-p:text-slate-300
                dark:prose-strong:text-white
                dark:prose-li:text-slate-300
                dark:prose-a:text-violet-400

                prose-headings:break-words
                prose-p:break-words
                prose-li:break-words

                prose-sm
                sm:prose-base
                lg:prose-lg
              "
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {translatedRecommendation}
              </ReactMarkdown>
            </article>
          </div>

          {/* ================================================
              CHATBOT
          ================================================= */}

          <div className="mt-6">
            <Chatbot />
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default AIPage;