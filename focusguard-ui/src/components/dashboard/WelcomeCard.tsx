import {
  CalendarDays,
  Shield,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";
import { useTranslation } from "../../hooks/useTranslation";
import Skeleton from "../common/Skeleton";


import { useLocalizedDate } from "../../hooks/useLocalizedDate";

const WelcomeCard = () => {
  const { data, isLoading } = useDashboard();

  const welcomeBackText = useTranslation("Welcome Back");
  const subAdminText = useTranslation("Sub Admin");
  const focusScoreText = useTranslation("Focus Score");
  const dateText = useLocalizedDate(data?.date);

  if (isLoading) {
    return (
      <div className="min-w-0 rounded-3xl bg-indigo-600 p-5 text-white sm:p-6 lg:p-8">
        <Skeleton className="mt-4 h-10 w-60 bg-white/20" />
        <Skeleton className="mt-5 h-8 w-28 bg-white/20" />
        <Skeleton className="mt-4 h-4 w-52 bg-white/20" />
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-3xl bg-indigo-600 p-5 text-white sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm text-indigo-100">
            👋 {welcomeBackText}
          </p>

          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
            {data?.user.full_name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Shield size={14} />
              {subAdminText}
            </span>
          </div>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-indigo-100">
            <CalendarDays size={16} className="shrink-0" />
            {dateText}
          </p>
        </div>

        <div className="w-full shrink-0 rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur sm:w-auto sm:min-w-[150px] sm:px-6 sm:py-5">
          <p className="text-sm text-indigo-100">
            {focusScoreText}
          </p>

          <h2 className="mt-1 text-4xl font-bold sm:text-5xl">
            {data?.focus_score}%
          </h2>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
