import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  usePlannerCategories,
  useCreatePlanner,
  useUpdatePlanner,
} from "../../../hooks/usePlanner";

import type {
  TodayPlannerResponse,
} from "../../../api/planner.api";

import { useTranslation } from "../../../hooks/useTranslation";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  planner?: TodayPlannerResponse | null;
}

interface PlannerTask {
  category: string;
  planned_minutes: number;
  start_time: string;
  end_time: string;
}

interface CategoryOptionProps {
  category: string;
}

const CategoryOption = ({
  category,
}: CategoryOptionProps) => {
  const translatedCategory =
    useTranslation(category);

  return (
    <option value={category}>
      {translatedCategory}
    </option>
  );
};

const PlannerModal = ({
  open,
  onClose,
  mode,
  planner,
}: Props) => {
  const { data } =
    usePlannerCategories();

  const createPlanner =
    useCreatePlanner();

  const updatePlanner =
    useUpdatePlanner();

  const [planDate, setPlanDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [tasks, setTasks] =
    useState<PlannerTask[]>([
      {
        category: "",
        planned_minutes: 60,
        start_time: "",
        end_time: "",
      },
    ]);

  const closeLabel = useTranslation(
    "Close planner modal"
  );

  const createTitle = useTranslation(
    "Create Today's Planner"
  );

  const editTitle = useTranslation(
    "Edit Today's Planner"
  );

  const description = useTranslation(
    "Plan your work and stay focused."
  );

  const plannerDateText = useTranslation(
    "Planner Date"
  );

  const categoryText = useTranslation(
    "Category"
  );

  const selectCategoryText =
    useTranslation("Select Category");

  const plannedMinutesText =
    useTranslation("Planned Minutes");

  const startTimeText =
    useTranslation("Start Time");

  const endTimeText =
    useTranslation("End Time");

  const addTaskText =
    useTranslation("Add Task");

  const cancelText =
    useTranslation("Cancel");

  const creatingText =
    useTranslation("Creating...");

  const updatingText =
    useTranslation("Updating...");

  const createPlannerText =
    useTranslation("Create Planner");

  const updatePlannerText =
    useTranslation("Update Planner");

  useEffect(() => {
    if (
      mode === "edit" &&
      planner
    ) {
      setPlanDate(planner.date);

      setTasks(
        planner.plans.map((plan) => ({
          category: plan.category,
          planned_minutes:
            plan.planned_minutes,
          start_time:
            plan.start_time,
          end_time:
            plan.end_time,
        }))
      );
    }
  }, [mode, planner]);

  if (!open) {
    return null;
  }

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        category: "",
        planned_minutes: 60,
        start_time: "",
        end_time: "",
      },
    ]);
  };

  const removeTask = (
    index: number
  ) => {
    setTasks(
      tasks.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateTask = (
    index: number,
    field: keyof PlannerTask,
    value: string | number
  ) => {
    const updated = [...tasks];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setTasks(updated);
  };

  const handleSubmit = async () => {
    if (tasks.length === 0) {
      toast.error(
        "Please add at least one task."
      );
      return;
    }

    for (const task of tasks) {
      if (
        !task.category ||
        !task.start_time ||
        !task.end_time
      ) {
        toast.error(
          "Please fill all task fields."
        );
        return;
      }

      if (
        task.planned_minutes <= 0
      ) {
        toast.error(
          "Planned minutes must be greater than zero."
        );
        return;
      }
    }

    const totalGoal =
      tasks.reduce(
        (sum, task) =>
          sum +
          task.planned_minutes,
        0
      );

    try {
      if (mode === "create") {
        await createPlanner.mutateAsync({
          plan_date: planDate,
          total_goal_minutes:
            totalGoal,
          plans: tasks,
        });

        toast.success(
          "Planner created successfully."
        );
      } else {
        if (!planner) {
          return;
        }

        await updatePlanner.mutateAsync({
          planId: planner.plan_id,
          payload: {
            total_goal_minutes:
              totalGoal,
            plans: tasks,
          },
        });

        toast.success(
          "Planner updated successfully."
        );
      }

      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail ??
          "Something went wrong."
      );
    }
  };

  const isSubmitting =
    createPlanner.isPending ||
    updatePlanner.isPending;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-3
        backdrop-blur-[2px]

        dark:bg-black/60

        sm:p-4
      "
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-xl

          dark:border
          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/50

          sm:rounded-3xl
        "
      >
        {/* Header */}

        <div
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            p-4

            dark:border-slate-700

            sm:p-6
          "
        >
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
              {mode === "create"
                ? createTitle
                : editTitle}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* Planner Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {plannerDateText}
              </label>

              <input
                type="date"
                value={planDate}
                onChange={(e) =>
                  setPlanDate(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-100

                  dark:border-slate-600
                  dark:bg-slate-800
                  dark:text-slate-200
                  dark:focus:border-indigo-400
                  dark:focus:ring-indigo-950
                "
              />
            </div>

            {/* Tasks */}

            {tasks.map(
              (task, index) => (
                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    p-4

                    dark:border-slate-700
                    dark:bg-slate-800/40

                    sm:p-5
                  "
                >
                  {/* Task Header */}

                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Task {index + 1}
                    </h3>

                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTask(
                            index
                          )
                        }
                        aria-label={`Remove task ${
                          index + 1
                        }`}
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition
                          hover:bg-red-50

                          dark:hover:bg-red-950/40
                        "
                      >
                        <Trash2
                          size={18}
                          className="text-red-500 dark:text-red-400"
                        />
                      </button>
                    )}
                  </div>

                  {/* Task Fields */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Category */}

                    <div className="min-w-0">
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {categoryText}
                      </label>

                      <select
                        value={
                          task.category
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "category",
                            e.target.value
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-3
                          text-sm
                          text-slate-700
                          outline-none
                          transition
                          focus:border-indigo-500
                          focus:ring-4
                          focus:ring-indigo-100

                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-slate-200
                          dark:focus:border-indigo-400
                          dark:focus:ring-indigo-950
                        "
                      >
                        <option value="">
                          {selectCategoryText}
                        </option>

                        {data?.categories.map(
                          (category) => (
                            <CategoryOption
                              key={category}
                              category={category}
                            />
                          )
                        )}
                      </select>
                    </div>

                    {/* Planned Minutes */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {plannedMinutesText}
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          task.planned_minutes
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "planned_minutes",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-3
                          text-sm
                          text-slate-700
                          outline-none
                          transition
                          focus:border-indigo-500
                          focus:ring-4
                          focus:ring-indigo-100

                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-slate-200
                          dark:focus:border-indigo-400
                          dark:focus:ring-indigo-950
                        "
                      />
                    </div>

                    {/* Start Time */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {startTimeText}
                      </label>

                      <input
                        type="time"
                        value={
                          task.start_time
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "start_time",
                            e.target.value
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-3
                          text-sm
                          text-slate-700
                          outline-none
                          transition
                          focus:border-indigo-500
                          focus:ring-4
                          focus:ring-indigo-100

                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-slate-200
                          dark:focus:border-indigo-400
                          dark:focus:ring-indigo-950
                        "
                      />
                    </div>

                    {/* End Time */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {endTimeText}
                      </label>

                      <input
                        type="time"
                        value={
                          task.end_time
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "end_time",
                            e.target.value
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-3
                          text-sm
                          text-slate-700
                          outline-none
                          transition
                          focus:border-indigo-500
                          focus:ring-4
                          focus:ring-indigo-100

                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-slate-200
                          dark:focus:border-indigo-400
                          dark:focus:ring-indigo-950
                        "
                      />
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Add Task */}

            <button
              type="button"
              onClick={addTask}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-indigo-600
                px-5
                py-3
                text-sm
                font-medium
                text-indigo-600
                transition
                hover:bg-indigo-50

                dark:border-indigo-400
                dark:text-indigo-400
                dark:hover:bg-indigo-950/40

                sm:w-auto
              "
            >
              <Plus size={18} />

              {addTaskText}
            </button>
          </div>
        </div>

        {/* Footer */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-3
            border-t
            border-slate-200
            p-4

            dark:border-slate-700

            sm:flex-row
            sm:justify-end
            sm:gap-4
            sm:p-6
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-6
              py-3
              text-sm
              text-slate-700
              transition
              hover:bg-slate-50

              dark:border-slate-600
              dark:text-slate-300
              dark:hover:bg-slate-800

              sm:w-auto
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              w-full
              rounded-xl
              bg-indigo-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-60

              dark:bg-indigo-500
              dark:hover:bg-indigo-600

              sm:w-auto
            "
          >
            {isSubmitting
              ? mode === "create"
                ? creatingText
                : updatingText
              : mode === "create"
              ? createPlannerText
              : updatePlannerText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerModal;