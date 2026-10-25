import {
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import {
  useOrganizations,
} from "../../../hooks/useOrganization";

import { useTranslation } from "../../../hooks/useTranslation";

import RequestDeactivationModal from "./RequestDeactivationModal";

const OrganizationCard = () => {
  const { user } = useAuth();

  const {
    data: organizations,
    isLoading,
  } = useOrganizations();

  const [open, setOpen] = useState(false);

  const organizationIdText = useTranslation(
    "Organization ID"
  );

  const statusText = useTranslation("Status");

  const activeText = useTranslation("Active");

  const inactiveText = useTranslation("Inactive");

  const requestDeactivationText = useTranslation(
    "Request Deactivation"
  );

  const organizationNotFoundText = useTranslation(
    "Organization Not Found"
  );

  const notAssignedText = useTranslation(
    "You are not assigned to any organization."
  );

  /* =====================================================
      LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900

          sm:rounded-3xl
          sm:p-6
        "
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    );
  }

  /* =====================================================
      FIND ORGANIZATION
  ===================================================== */

  const organization = organizations?.find(
    (org) => org.id === user?.organization_id
  );

  /* =====================================================
      ORGANIZATION NOT FOUND
  ===================================================== */

  if (!organization) {
    return (
      <div
        className="
          w-full
          rounded-2xl
          border
          border-yellow-200
          bg-yellow-50
          p-5
          dark:border-yellow-900/60
          dark:bg-yellow-950/30

          sm:rounded-3xl
          sm:p-6
        "
      >
        <h2
          className="
            text-lg
            font-semibold
            text-yellow-800
            dark:text-yellow-300

            sm:text-xl
          "
        >
          {organizationNotFoundText}
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-yellow-600
            dark:text-yellow-400

            sm:text-base
          "
        >
          {notAssignedText}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          ORGANIZATION CARD
      ===================================================== */}

      <div
        className="
          w-full
          min-w-0
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
          dark:border-slate-700
          dark:bg-slate-900

          sm:rounded-3xl
          sm:p-6
          lg:p-8
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:gap-5
          "
        >
          {/* Icon */}

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
              size={28}
              className="
                text-indigo-600
                dark:text-indigo-400
                sm:h-[30px]
                sm:w-[30px]
              "
            />
          </div>

          {/* Organization Information */}

          <div className="min-w-0">
            <h2
              className="
                break-words
                text-xl
                font-bold
                text-slate-900
                dark:text-slate-100

                sm:text-2xl
              "
            >
              {organization.organization_name}
            </h2>

            <p
              className="
                mt-1
                break-all
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {organizationIdText}: {organization.id}
            </p>
          </div>
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="mt-6 sm:mt-8">
          <p
            className="
              mb-3
              text-sm
              font-semibold
              text-slate-500
              dark:text-slate-400
            "
          >
            {statusText}
          </p>

          {organization.is_active ? (
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-green-100
                px-3
                py-2
                text-sm
                font-semibold
                text-green-700
                dark:bg-green-950/60
                dark:text-green-300

                sm:px-4
              "
            >
              <CheckCircle2 size={18} />

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
                px-3
                py-2
                text-sm
                font-semibold
                text-red-700
                dark:bg-red-950/60
                dark:text-red-300

                sm:px-4
              "
            >
              <XCircle size={18} />

              {inactiveText}
            </span>
          )}
        </div>

        {/* =================================================
            DEACTIVATION BUTTON
        ================================================= */}

        {organization.is_active && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              mt-6
              w-full
              rounded-2xl
              bg-red-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
              active:bg-red-800

              sm:mt-8
              sm:w-auto
              sm:px-6
              sm:text-base
            "
          >
            {requestDeactivationText}
          </button>
        )}
      </div>

      {/* =====================================================
          DEACTIVATION MODAL
      ===================================================== */}

      <RequestDeactivationModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default OrganizationCard;