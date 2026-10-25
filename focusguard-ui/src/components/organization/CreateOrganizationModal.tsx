import toast from "react-hot-toast";

import CreateOrganizationForm from "./CreateOrganizationForm";

import {
  useCreateOrganization,
} from "../../hooks/useOrganization";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateOrganizationModal = ({
  open,
  onClose,
}: Props) => {
  const createOrganization =
    useCreateOrganization();

  const createOrganizationText =
    useTranslation(
      "Create Organization"
    );

  const createDescriptionText =
    useTranslation(
      "Add a new organization to FocusGuard."
    );

  const closeText =
    useTranslation("Close");

  const organizationCreatedText =
    useTranslation(
      "Organization created successfully."
    );

  const unableToCreateText =
    useTranslation(
      "Unable to create organization."
    );

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[80]
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl

          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            px-5
            py-5

            dark:border-slate-700

            sm:px-7
            sm:py-6
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white

                sm:text-2xl
              "
            >
              {createOrganizationText}
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {createDescriptionText}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeText}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-xl
              text-slate-500
              transition

              hover:bg-slate-100
              hover:text-slate-800

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="p-5 sm:p-7">
          <CreateOrganizationForm
            loading={
              createOrganization.isPending
            }
            onSubmit={async (
              organizationName
            ) => {
              try {
                await createOrganization.mutateAsync(
                  {
                    organization_name:
                      organizationName,
                  }
                );

                toast.success(
                  organizationCreatedText
                );

                onClose();
              } catch (error: any) {
                toast.error(
                  error?.response?.data
                    ?.detail ??
                    unableToCreateText
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;