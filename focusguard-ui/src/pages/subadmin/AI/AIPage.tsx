import AppLayout from "../../../layouts/AppLayout";
import { useAIRecommendation } from "../../../hooks/useAIRecommendation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BrainCircuit, Sparkles } from "lucide-react";
import Chatbot from "../../../components/ai/Chatbot";
import { useTranslation } from "../../../hooks/useTranslation";

const AIPage = () => {
  const { data, isLoading } = useAIRecommendation();

  const loadingText = useTranslation("Loading AI Report...");
  const titleText = useTranslation("AI Productivity Report");
  const generatedAtText = useTranslation("Generated at");
  const translatedRecommendation = useTranslation(
    data?.recommendation ?? ""
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[400px] items-center justify-center px-4">
          <p className="text-center text-base font-medium text-slate-500 sm:text-lg">
            {loadingText}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl min-w-0">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:gap-3 sm:text-3xl lg:text-4xl">
              <BrainCircuit
                className="shrink-0 text-violet-600 dark:text-violet-400"
                size={30}
              />

              <span>{titleText}</span>
            </h1>

            <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400 sm:mt-3">
              {generatedAtText} {data?.generated_at}
            </p>
          </div>

          <Sparkles
            className="hidden shrink-0 text-violet-600 dark:text-violet-400 sm:block"
            size={30}
          />
        </div>

        {/* AI Report */}
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:rounded-3xl sm:p-8 lg:p-10">
          <article className="prose prose-slate max-w-none break-words text-sm dark:prose-invert sm:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {translatedRecommendation}
            </ReactMarkdown>
          </article>
        </div>

        {/* AI Chatbot */}
        <div className="mt-6 w-full min-w-0 sm:mt-8">
          <Chatbot />
        </div>
      </div>
    </AppLayout>
  );
};

export default AIPage;