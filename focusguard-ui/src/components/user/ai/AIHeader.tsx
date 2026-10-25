import {
  BrainCircuit,
} from "lucide-react";

import { useTranslation } from "../../../hooks/useTranslation";

const AIHeader = () => {
  const title = useTranslation(
    "AI Productivity Insights"
  );

  const description = useTranslation(
    "Personalized recommendations generated from your productivity data."
  );

  return (
    <div
      className="
        flex
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
        md:gap-5
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          shrink-0
          items-center
          justify-center
          self-start
          rounded-2xl
          bg-white/20

          md:h-16
          md:w-16
          md:self-center
        "
      >
        <BrainCircuit
          size={30}
          className="md:hidden"
        />

        <BrainCircuit
          size={34}
          className="hidden md:block"
        />
      </div>

      <div className="min-w-0">
        <h1
          className="
            text-2xl
            font-bold
            leading-tight

            sm:text-3xl
            lg:text-4xl
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-indigo-100

            sm:text-base
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default AIHeader;