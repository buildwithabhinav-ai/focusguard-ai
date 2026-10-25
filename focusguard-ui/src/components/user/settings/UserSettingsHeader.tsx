import {
  Settings,
} from "lucide-react";

import { useTranslation } from "../../../hooks/useTranslation";

const UserSettingsHeader = () => {
  const titleText = useTranslation(
    "Settings"
  );

  const descriptionText = useTranslation(
    "Manage your FocusGuard account and preferences."
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">

      <div
        className="
          flex
          h-14
          w-14
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-indigo-100
          dark:bg-indigo-950/50
          sm:h-16
          sm:w-16
        "
      >
        <Settings
          size={30}
          className="text-indigo-600 dark:text-indigo-400 sm:hidden"
        />

        <Settings
          size={34}
          className="hidden text-indigo-600 dark:text-indigo-400 sm:block"
        />
      </div>

      <div className="min-w-0">

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
          {titleText}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          {descriptionText}
        </p>

      </div>

    </div>
  );
};

export default UserSettingsHeader;