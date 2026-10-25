import { Building2 } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";

const OrganizationHeader = () => {
  const { user } = useAuth();

  const titleText = useTranslation("My Organization");

  const descriptionText = useTranslation(
    "View your organization details and manage organization requests."
  );

  const loggedInAsText = useTranslation("Logged in as");

  const roleSource = user?.role
    ? user.role
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "User";

  const roleText = useTranslation(roleSource);

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
        sm:gap-5
      "
    >
      {/* =====================================================
          ICON
      ===================================================== */}

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
          dark:bg-indigo-950/60

          sm:h-16
          sm:w-16
          sm:rounded-3xl
        "
      >
        <Building2
          size={30}
          className="
            text-indigo-600
            dark:text-indigo-400
            sm:h-[34px]
            sm:w-[34px]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="min-w-0">
        <h1
          className="
            break-words
            text-2xl
            font-bold
            text-slate-900
            dark:text-slate-100

            sm:text-3xl
          "
        >
          {titleText}
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            break-words
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400

            sm:text-base
          "
        >
          {descriptionText}
        </p>

        {/* Role */}

        <div className="mt-4">
          <span
            className="
              inline-flex
              max-w-full
              items-center
              rounded-full
              bg-indigo-100
              px-3
              py-2
              text-xs
              font-semibold
              text-indigo-700
              dark:bg-indigo-950/60
              dark:text-indigo-300

              sm:px-4
              sm:text-sm
            "
          >
            <span className="truncate">
              {loggedInAsText} {roleText}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHeader;