import {
  Sparkles,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";

import { useLocalizedDate } from "../../../hooks/useLocalizedDate";

const WelcomeCard = () => {
  const { user } = useAuth();

  const welcomeBack = useTranslation(
    "Welcome Back"
  );

  const productivityText = useTranslation(
    "Let's make today productive."
  );

  const today = useLocalizedDate();

  return (
    <div
      className="
        min-w-0
        rounded-3xl
        bg-indigo-600
        p-5
        text-white

        dark:bg-indigo-700

        sm:p-6
        lg:p-8
      "
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles
              size={22}
              className="shrink-0"
            />

            <span className="font-semibold">
              {welcomeBack}
            </span>
          </div>

          <h1 className="mt-3 break-words text-3xl font-bold sm:text-4xl">
            {user?.full_name}
          </h1>

          <p className="mt-3 text-sm text-indigo-100 sm:text-base">
            {productivityText}
          </p>
        </div>

        <div
          className="
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            bg-white/20
            p-4
            backdrop-blur

            sm:w-auto
            sm:min-w-[190px]
            sm:flex-col
            sm:items-start
            sm:p-5
          "
        >
          <CalendarDays
            size={30}
            className="shrink-0 sm:h-9 sm:w-9"
          />

          <p className="text-sm">
            {today}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;