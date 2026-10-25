import toast from "react-hot-toast";

import AssignOrganizationForm from "./AssignOrganizationForm";

import {
  useOrganizations,
  useAssignOrganization,
} from "../../hooks/useOrganization";

import {
  useTranslation,
} from "../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

const AssignOrganizationModal = ({
  open,
  onClose,
  userId,
  userName,
}: Props) => {
  const {
    data,
    isLoading,
  } = useOrganizations();

  const assign =
    useAssignOrganization();

  const assignOrganizationText =
    useTranslation(
      "Assign Organization"
    );

  const assignUserDescriptionText =
    useTranslation(
      "Assign an organization to"
    );

  const closeText =
    useTranslation("Close");

  const assignmentSuccessText =
    useTranslation(
      "Organization assigned successfully."
    );

  const assignmentFailedText =
    useTranslation(
      "Assignment failed."
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
              {assignOrganizationText}
            </h2>

            <p
              className="
                mt-1
                break-words
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {assignUserDescriptionText}{" "}
              <span
                className="
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                {userName}
              </span>
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
          {isLoading ? (
            <div className="space-y-4">
              <div
                className="
                  h-5
                  w-32
                  animate-pulse
                  rounded
                  bg-slate-200
                  dark:bg-slate-700
                "
              />

              <div
                className="
                  h-12
                  w-full
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                  dark:bg-slate-800
                "
              />

              <div
                className="
                  h-12
                  w-full
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                  dark:bg-slate-800
                "
              />
            </div>
          ) : (
            <AssignOrganizationForm
              organizations={data ?? []}
              loading={assign.isPending}
              onSubmit={async (
                organizationId
              ) => {
                try {
                  await assign.mutateAsync({
                    user_id: userId,
                    organization_id:
                      organizationId,
                  });

                  toast.success(
                    assignmentSuccessText
                  );

                  onClose();
                } catch (error: any) {
                  toast.error(
                    error?.response?.data
                      ?.detail ??
                      assignmentFailedText
                  );
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignOrganizationModal;