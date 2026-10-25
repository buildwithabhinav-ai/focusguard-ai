import {
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import {
  useForm,
  useFieldArray,
} from "react-hook-form";

import { usePlannerCategories } from "../../hooks/usePlanner";
import { useTranslation } from "../../hooks/useTranslation";

interface PlannerFormValues {
  plan_date: string;
  total_goal_minutes: number;

  plans: {
    category: string;
    planned_minutes: number;
    start_time: string;
    end_time: string;
  }[];
}

interface Props {
  defaultValues?: PlannerFormValues;

  onSubmit: (
    values: PlannerFormValues
  ) => void;

  loading?: boolean;
}

/* =========================================================
   Category option

   IMPORTANT:
   value stays original because backend expects
   original category string.
========================================================= */

const CategoryOption = ({
  category,
}: {
  category: string;
}) => {
  const translatedCategory =
    useTranslation(category);

  return (
    <option value={category}>
      {translatedCategory}
    </option>
  );
};

const PlannerForm = ({
  defaultValues,
  onSubmit,
  loading = false,
}: Props) => {
  const {
    data: categories,
  } = usePlannerCategories();

  const {
    register,
    control,
    handleSubmit,
  } = useForm<PlannerFormValues>({
    defaultValues:
      defaultValues ?? {
        plan_date: new Date()
          .toISOString()
          .slice(0, 10),

        total_goal_minutes: 180,

        plans: [
          {
            category: "",
            planned_minutes: 60,
            start_time: "09:00",
            end_time: "10:00",
          },
        ],
      },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "plans",
  });

  const totalGoalMinutesText =
    useTranslation("Total Goal Minutes");

  const taskText =
    useTranslation("Task");

  const removeTaskText =
    useTranslation("Remove task");

  const categoryText =
    useTranslation("Category");

  const selectCategoryText =
    useTranslation("Select Category");

  const minutesText =
    useTranslation("Minutes");

  const startTimeText =
    useTranslation("Start Time");

  const endTimeText =
    useTranslation("End Time");

  const addTaskText =
    useTranslation("Add Task");

  const savingText =
    useTranslation("Saving...");

  const savePlannerText =
    useTranslation("Save Planner");

  return (
    <form
      onSubmit={handleSubmit(
        (values) => {
          onSubmit({
            ...values,

            plans: values.plans.map(
              (plan) => ({
                ...plan,

                start_time:
                  plan.start_time.length === 5
                    ? `${plan.start_time}:00`
                    : plan.start_time,

                end_time:
                  plan.end_time.length === 5
                    ? `${plan.end_time}:00`
                    : plan.end_time,
              })
            ),
          });
        }
      )}
      className="space-y-6"
    >
      {/* =================================================
          TOTAL GOAL
      ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {totalGoalMinutesText}
        </label>

        <input
          type="number"
          min="1"
          {...register(
            "total_goal_minutes",
            {
              valueAsNumber: true,
            }
          )}
          className="
            h-11
            w-full
            rounded-xl
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
            dark:border-slate-600
            dark:bg-slate-800
            dark:text-white
            dark:placeholder:text-slate-500
            dark:focus:border-indigo-400
            dark:focus:ring-indigo-950/50
          "
        />
      </div>

      {/* =================================================
          TASKS
      ================================================= */}

      <div className="space-y-5">
        {fields.map(
          (field, index) => (
            <div
              key={field.id}
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                p-4
                dark:border-slate-700
                sm:p-5
              "
            >
              {/* Task Header */}

              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {taskText} {index + 1}
                </h3>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      remove(index)
                    }
                    aria-label={`${removeTaskText} ${
                      index + 1
                    }`}
                    className="
                      shrink-0
                      rounded-lg
                      p-2
                      text-red-600
                      transition
                      hover:bg-red-50
                      dark:text-red-400
                      dark:hover:bg-red-950/30
                    "
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Task Inputs */}

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Category */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    {categoryText}
                  </label>

                  <select
                    {...register(
                      `plans.${index}.category`
                    )}
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-3
                      text-sm
                      text-slate-900
                      outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-100
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
                      dark:focus:border-indigo-400
                      dark:focus:ring-indigo-950/50
                    "
                  >
                    <option value="">
                      {selectCategoryText}
                    </option>

                    {categories?.categories.map(
                      (category) => (
                        <CategoryOption
                          key={category}
                          category={category}
                        />
                      )
                    )}
                  </select>
                </div>

                {/* Minutes */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    {minutesText}
                  </label>

                  <input
                    type="number"
                    min="1"
                    {...register(
                      `plans.${index}.planned_minutes`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-3
                      text-sm
                      text-slate-900
                      outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-100
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
                      dark:focus:border-indigo-400
                      dark:focus:ring-indigo-950/50
                    "
                  />
                </div>

                {/* Start */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    {startTimeText}
                  </label>

                  <input
                    type="time"
                    {...register(
                      `plans.${index}.start_time`
                    )}
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-3
                      text-sm
                      text-slate-900
                      outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-100
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
                      dark:focus:border-indigo-400
                      dark:focus:ring-indigo-950/50
                    "
                  />
                </div>

                {/* End */}

                <div className="min-w-0">
                  <label className="mb-2 block text-sm text-slate-700 dark:text-slate-300">
                    {endTimeText}
                  </label>

                  <input
                    type="time"
                    {...register(
                      `plans.${index}.end_time`
                    )}
                    className="
                      h-11
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-3
                      text-sm
                      text-slate-900
                      outline-none
                      focus:border-indigo-500
                      focus:ring-4
                      focus:ring-indigo-100
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
                      dark:focus:border-indigo-400
                      dark:focus:ring-indigo-950/50
                    "
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* =================================================
          ADD TASK
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          append({
            category: "",
            planned_minutes: 60,
            start_time: "09:00",
            end_time: "10:00",
          })
        }
        className="
          inline-flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          text-sm
          font-medium
          text-slate-700
          transition
          hover:bg-slate-100
          dark:border-slate-600
          dark:text-slate-300
          dark:hover:bg-slate-800
          sm:w-auto
        "
      >
        <Plus size={18} />

        {addTaskText}
      </button>

      {/* =================================================
          SUBMIT
      ================================================= */}

      <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-indigo-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          <Save size={18} />

          {loading
            ? savingText
            : savePlannerText}
        </button>
      </div>
    </form>
  );
};

export default PlannerForm;