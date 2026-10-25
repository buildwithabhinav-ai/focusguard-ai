import {
  FileBarChart,
} from "lucide-react";

import { useTranslation } from "../../../hooks/useTranslation";

const ReportsHeader = () => {
  const titleText = useTranslation(
    "Productivity Reports"
  );

  const descriptionText = useTranslation(
    "View your daily, weekly and monthly productivity reports."
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
        sm:flex-row
        sm:items-center
        sm:gap-5
        sm:p-6
        lg:p-8
      "
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-16 sm:w-16">
        <FileBarChart
          size={30}
          className="sm:hidden"
        />

        <FileBarChart
          size={34}
          className="hidden sm:block"
        />
      </div>

      <div className="min-w-0">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {titleText}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
          {descriptionText}
        </p>
      </div>
    </div>
  );
};

export default ReportsHeader;