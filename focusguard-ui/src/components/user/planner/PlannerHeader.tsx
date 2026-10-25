import {
  CalendarDays,
} from "lucide-react";

import { useTranslation } from "../../../hooks/useTranslation";

const PlannerHeader = () => {
  const title = useTranslation(
    "Focus Planner"
  );

  const description = useTranslation(
    "Plan your day, stay focused, and track your productivity."
  );

  return (
    <div
      className="
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
        lg:p-8
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-16 sm:w-16">
          <CalendarDays
            size={30}
            className="sm:hidden"
          />

          <CalendarDays
            size={32}
            className="hidden sm:block"
          />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlannerHeader;