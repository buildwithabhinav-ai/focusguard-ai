import { Users } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

const UsersPageHeader = () => {
  const usersText = useTranslation("Users");
  const descriptionText = useTranslation(
    "Manage all users in the platform."
  );

  return (
    <div
      className="
        mb-6
        flex
        min-w-0
        items-start
        gap-3
        sm:mb-8
        sm:items-center
        sm:gap-4
      "
    >
      <div
        className="
          shrink-0
          rounded-2xl
          bg-indigo-100
          p-3
          dark:bg-indigo-950/60
        "
      >
        <Users
          size={24}
          className="
            text-indigo-600
            dark:text-indigo-400
            sm:h-7
            sm:w-7
          "
        />
      </div>

      <div className="min-w-0">
        <h1
          className="
            break-words
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
          "
        >
          {usersText}
        </h1>

        <p
          className="
            mt-1
            break-words
            text-sm
            text-slate-500
            dark:text-slate-400
            sm:text-base
          "
        >
          {descriptionText}
        </p>
      </div>
    </div>
  );
};

export default UsersPageHeader;