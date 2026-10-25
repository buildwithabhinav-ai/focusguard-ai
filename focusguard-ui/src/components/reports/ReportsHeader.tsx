import { FileBarChart2 } from "lucide-react";

import { useTranslation } from "../../hooks/useTranslation";

const ReportsHeader = () => {
  const reportsText = useTranslation("Reports");

  const reportsDescriptionText = useTranslation(
    "Weekly and monthly productivity reports."
  );

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="min-w-0 flex-1">
        <h1
          className="
            break-words
            text-2xl
            font-bold
            leading-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
          "
        >
          {reportsText}
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {reportsDescriptionText}
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
          bg-indigo-100
          dark:bg-indigo-950/50
          sm:h-14
          sm:w-14
          sm:self-center
        "
      >
        <FileBarChart2
          size={26}
          className="
            text-indigo-600
            dark:text-indigo-400
            sm:h-7
            sm:w-7
          "
        />
      </div>
    </div>
  );
};

export default ReportsHeader;