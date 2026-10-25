import {
  Building2,
  CheckCircle2,
  XCircle,
  Power,
} from "lucide-react";

import toast from "react-hot-toast";

import type {
  Organization,
} from "../../api/organization.api";

import {
  useActivateOrganization,
} from "../../hooks/useOrganization";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  organization: Organization;
}

const OrganizationCard = ({
  organization,
}: Props) => {
  const activateOrganization =
    useActivateOrganization();

  const organizationIdText =
    useTranslation(
      "Organization ID"
    );

  const organizationStatusText =
    useTranslation(
      "Organization Status"
    );

  const activeText =
    useTranslation("Active");

  const inactiveText =
    useTranslation("Inactive");

  const activatingText =
    useTranslation(
      "Activating..."
    );

  const activateOrganizationText =
    useTranslation(
      "Activate Organization"
    );

  const activationSuccessText =
    useTranslation(
      "Organization activated successfully."
    );

  const activationFailedText =
    useTranslation(
      "Unable to activate organization."
    );

  const activationConfirmationText =
    useTranslation(
      "Are you sure you want to activate this organization?"
    );

  const handleActivate =
    async () => {
      const confirmed =
        window.confirm(
          activationConfirmationText
        );

      if (!confirmed) return;

      try {
        await activateOrganization.mutateAsync(
          organization.id
        );

        toast.success(
          activationSuccessText
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data
            ?.detail ??
            activationFailedText
        );
      }
    };

  return (
    <div
      className="
        group
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-xl

        dark:border-slate-700
        dark:bg-slate-900
        dark:shadow-black/20

        sm:p-6
      "
    >
      {/* Header */}

      <div
        className="
          flex
          min-w-0
          items-start
          gap-4
        "
      >
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
          "
        >
          <Building2
            size={27}
            className="
              text-indigo-600
              dark:text-indigo-400
            "
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="
              break-words
              text-lg
              font-bold
              text-slate-900
              dark:text-white

              sm:text-xl
            "
          >
            {organization.organization_name}
          </h2>

          <p
            className="
              mt-1
              break-words
              text-xs
              text-slate-500
              dark:text-slate-400

              sm:text-sm
            "
          >
            {organizationIdText}:{" "}
            {organization.id}
          </p>
        </div>
      </div>

      {/* Divider */}

      <div
        className="
          my-6
          h-px
          bg-slate-100
          dark:bg-slate-800
        "
      />

      {/* Status */}

      <div>
        <p
          className="
            mb-2
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-slate-500
            dark:text-slate-400
          "
        >
          {organizationStatusText}
        </p>

        {organization.is_active ? (
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-green-100
              px-4
              py-2
              text-sm
              font-semibold
              text-green-700

              dark:bg-green-950/50
              dark:text-green-300
            "
          >
            <CheckCircle2 size={16} />

            {activeText}
          </span>
        ) : (
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-red-100
              px-4
              py-2
              text-sm
              font-semibold
              text-red-700

              dark:bg-red-950/50
              dark:text-red-300
            "
          >
            <XCircle size={16} />

            {inactiveText}
          </span>
        )}
      </div>

      {/* Action */}

      {!organization.is_active && (
        <button
          type="button"
          onClick={handleActivate}
          disabled={
            activateOrganization.isPending
          }
          className="
            mt-7
            flex
            h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-indigo-600
            px-5
            font-semibold
            text-white
            transition

            hover:bg-indigo-700
            hover:shadow-md

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Power size={18} />

          {activateOrganization.isPending
            ? activatingText
            : activateOrganizationText}
        </button>
      )}
    </div>
  );
};

export default OrganizationCard;