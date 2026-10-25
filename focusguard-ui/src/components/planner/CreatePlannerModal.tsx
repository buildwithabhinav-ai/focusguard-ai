import PlannerForm from "./PlannerForm";

import toast from "react-hot-toast";

import {
  useCreatePlanner,
  useTodayPlanner,
  useUpdatePlanner,
} from "../../hooks/usePlanner";

import { useTranslation } from "../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
}

/* =========================================================
   Dynamic translated toast message
========================================================= */

const TranslatedToastMessage = ({
  message,
}: {
  message: string;
}) => {
  const translatedMessage = useTranslation(message);

  return <>{translatedMessage}</>;
};

const CreatePlannerModal = ({
  open,
  onClose,
}: Props) => {
  const createPlanner = useCreatePlanner();

  const updatePlanner = useUpdatePlanner();

  const {
    data: planner,
  } = useTodayPlanner();

  const editFocusPlanText =
    useTranslation("Edit Focus Plan");

  const createFocusPlanText =
    useTranslation("Create Focus Plan");

  const closePlannerModalText =
    useTranslation("Close planner modal");

  const plannerUpdatedText =
    useTranslation("Planner updated successfully.");

  const plannerCreatedText =
    useTranslation("Planner created successfully.");

  const unableToSavePlannerText =
    useTranslation("Unable to save planner.");

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-slate-900/50
        p-3
        backdrop-blur-sm
        sm:p-6
        lg:items-center
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          my-2
          w-full
          max-w-3xl
          min-w-0
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
          dark:bg-slate-900
          dark:ring-1
          dark:ring-slate-700
          sm:my-6
          sm:rounded-3xl
          sm:p-7
          lg:p-8
        "
      >
        {/* Header */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            className="
              min-w-0
              text-xl
              font-bold
              text-slate-900
              dark:text-white
              sm:text-2xl
            "
          >
            {planner
              ? editFocusPlanText
              : createFocusPlanText}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={closePlannerModalText}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-lg
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            ✕
          </button>
        </div>

        <PlannerForm
          loading={
            createPlanner.isPending ||
            updatePlanner.isPending
          }
          defaultValues={
            planner
              ? {
                  plan_date: planner.date,
                  total_goal_minutes:
                    planner.total_goal_minutes,
                  plans: planner.plans,
                }
              : undefined
          }
          onSubmit={async (values) => {
            try {
              if (planner) {
                await updatePlanner.mutateAsync({
                  planId: planner.plan_id,

                  payload: {
                    total_goal_minutes:
                      values.total_goal_minutes,

                    plans: values.plans,
                  },
                });

                toast.success(
                  <TranslatedToastMessage
                    message={plannerUpdatedText}
                  />
                );
              } else {
                await createPlanner.mutateAsync({
                  ...values,

                  plan_date: `${values.plan_date}T00:00:00`,
                });

                toast.success(
                  <TranslatedToastMessage
                    message={plannerCreatedText}
                  />
                );
              }

              onClose();
            } catch (error: any) {
              console.error(error);

              const errorMessage =
                error?.response?.data?.detail;

              toast.error(
                <TranslatedToastMessage
                  message={
                    errorMessage ||
                    unableToSavePlannerText
                  }
                />
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default CreatePlannerModal;