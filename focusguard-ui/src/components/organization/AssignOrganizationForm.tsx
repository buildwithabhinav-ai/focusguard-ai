import { useState } from "react";

import type {
  Organization,
} from "../../api/organization.api";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  organizations: Organization[];
  loading: boolean;
  onSubmit: (
    organizationId: number
  ) => void;
}

const AssignOrganizationForm = ({
  organizations,
  loading,
  onSubmit,
}: Props) => {
  const [
    organizationId,
    setOrganizationId,
  ] = useState("");

  const organizationText =
    useTranslation("Organization");

  const selectOrganizationText =
    useTranslation(
      "Select Organization"
    );

  const noOrganizationsText =
    useTranslation(
      "No organizations are currently available."
    );

  const assigningText =
    useTranslation("Assigning...");

  const assignOrganizationText =
    useTranslation(
      "Assign Organization"
    );

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!organizationId) return;

    onSubmit(
      Number(organizationId)
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="organization-select"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
            dark:text-slate-200
          "
        >
          {organizationText}
        </label>

        <select
          id="organization-select"
          value={organizationId}
          onChange={(event) =>
            setOrganizationId(
              event.target.value
            )
          }
          disabled={loading}
          className="
            h-12
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            px-4
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition

            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100

            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:opacity-70

            dark:border-slate-600
            dark:bg-slate-800
            dark:text-slate-200

            dark:focus:border-indigo-500
            dark:focus:ring-indigo-950
          "
        >
          <option value="">
            {selectOrganizationText}
          </option>

          {organizations.map(
            (organization) => (
              <option
                key={organization.id}
                value={organization.id}
              >
                {organization.organization_name}
              </option>
            )
          )}
        </select>

        {organizations.length === 0 && (
          <p
            className="
              mt-2
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {noOrganizationsText}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={
          loading ||
          !organizationId ||
          organizations.length === 0
        }
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-indigo-600
          px-5
          font-semibold
          text-white
          shadow-sm
          transition

          hover:bg-indigo-700
          hover:shadow-md

          active:scale-[0.99]

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading
          ? assigningText
          : assignOrganizationText}
      </button>
    </form>
  );
};

export default AssignOrganizationForm;