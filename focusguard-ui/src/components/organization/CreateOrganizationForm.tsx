import { useState } from "react";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  loading: boolean;
  onSubmit: (
    organizationName: string
  ) => void;
}

const CreateOrganizationForm = ({
  loading,
  onSubmit,
}: Props) => {
  const [
    organizationName,
    setOrganizationName,
  ] = useState("");

  const organizationNameText =
    useTranslation(
      "Organization Name"
    );

  const organizationPlaceholder =
    useTranslation(
      "e.g. Infosys"
    );

  const creatingText =
    useTranslation("Creating...");

  const createOrganizationText =
    useTranslation(
      "Create Organization"
    );

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedName =
      organizationName.trim();

    if (!trimmedName) return;

    onSubmit(trimmedName);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="organization-name"
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
            dark:text-slate-200
          "
        >
          {organizationNameText}
        </label>

        <input
          id="organization-name"
          type="text"
          value={organizationName}
          onChange={(event) =>
            setOrganizationName(
              event.target.value
            )
          }
          placeholder={
            organizationPlaceholder
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
            text-slate-900
            outline-none
            transition

            placeholder:text-slate-400

            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100

            disabled:cursor-not-allowed
            disabled:bg-slate-100
            disabled:opacity-70

            dark:border-slate-600
            dark:bg-slate-800
            dark:text-white
            dark:placeholder:text-slate-500

            dark:focus:border-indigo-500
            dark:focus:ring-indigo-950
          "
        />
      </div>

      <button
        type="submit"
        disabled={
          loading ||
          !organizationName.trim()
        }
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-indigo-600
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
          ? creatingText
          : createOrganizationText}
      </button>
    </form>
  );
};

export default CreateOrganizationForm;