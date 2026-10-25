import {
  FileText,
} from "lucide-react";

import {
  useDeactivationRequests,
} from "../../hooks/useOrganization";

import DeactivationRequestCard from "./DeactivationRequestCard";

import {
  useTranslation,
} from "../../hooks/useTranslation";

const DeactivationRequests = () => {
  const {
    data,
    isLoading,
    error,
  } = useDeactivationRequests();

  const unableToLoadText =
    useTranslation(
      "Unable to load deactivation requests."
    );

  const refreshText =
    useTranslation(
      "Please refresh the page and try again."
    );

  const noRequestsText =
    useTranslation(
      "No Deactivation Requests"
    );

  const noRequestsDescription =
    useTranslation(
      "There are currently no organization deactivation requests to review."
    );

  if (isLoading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map(
          (item) => (
            <div
              key={item}
              className="
                h-64
                animate-pulse
                rounded-3xl
                border
                border-slate-200
                bg-slate-100

                dark:border-slate-700
                dark:bg-slate-800
              "
            />
          )
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-6
          text-center

          dark:border-red-900/50
          dark:bg-red-950/30

          sm:p-8
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-red-600
            dark:text-red-400
          "
        >
          {unableToLoadText}
        </p>

        <p
          className="
            mt-1
            text-xs
            text-red-500/80
            dark:text-red-400/70
          "
        >
          {refreshText}
        </p>
      </div>
    );
  }

  if (
    !data ||
    data.length === 0
  ) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-dashed
          border-slate-300
          bg-white
          p-8
          text-center

          dark:border-slate-700
          dark:bg-slate-900

          sm:p-10
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-slate-100

            dark:bg-slate-800
          "
        >
          <FileText
            size={28}
            className="
              text-slate-400
              dark:text-slate-500
            "
          />
        </div>

        <h2
          className="
            mt-5
            text-lg
            font-bold
            text-slate-800
            dark:text-white
          "
        >
          {noRequestsText}
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {noRequestsDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {data.map(
        (request) => (
          <DeactivationRequestCard
            key={request.id}
            request={request}
          />
        )
      )}
    </div>
  );
};

export default DeactivationRequests;