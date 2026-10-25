import {
  ShieldAlert,
} from "lucide-react";

import {
  useTranslation,
} from "../../hooks/useTranslation";

const RequestsHeader = () => {
  const organizationRequestsText =
    useTranslation(
      "Organization Requests"
    );

  const descriptionText =
    useTranslation(
      "Review organization deactivation requests."
    );

  return (
    <div
      className="
        mb-6
        flex
        min-w-0
        items-start
        gap-4

        sm:mb-8
        sm:items-center
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          bg-red-100

          dark:bg-red-950/50
        "
      >
        <ShieldAlert
          size={26}
          className="
            text-red-600
            dark:text-red-400
          "
        />
      </div>

      <div className="min-w-0">
        <h1
          className="
            break-words
            text-2xl
            font-bold
            text-slate-900
            dark:text-white

            sm:text-3xl
          "
        >
          {organizationRequestsText}
        </h1>

        <p
          className="
            mt-1
            text-sm
            leading-6
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

export default RequestsHeader;