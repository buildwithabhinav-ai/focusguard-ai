import { BarChart3 } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const AnalyticsHeader = () => {
  const title = useTranslation("Analytics");

  const description = useTranslation(
    "Analyze your productivity, focus trends and browsing habits."
  );

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        flex-col
        gap-4
        rounded-3xl
        bg-gradient-to-r
        from-indigo-600
        to-violet-600
        p-5
        text-white
        shadow-sm

        dark:from-indigo-700
        dark:to-violet-800
        dark:shadow-black/20

        sm:p-6
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
          {description}
        </p>
      </div>

      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          self-start
          rounded-2xl
          bg-white/20
          backdrop-blur-sm

          sm:h-14
          sm:w-14

          md:self-center
        "
      >
        <BarChart3
          className="text-white"
          size={26}
        />
      </div>
    </div>
  );
};

export default AnalyticsHeader;