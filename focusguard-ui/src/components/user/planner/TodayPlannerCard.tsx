import {
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  Pencil,
  Plus,
} from "lucide-react";

import {
  useTodayPlanner,
} from "../../../hooks/usePlanner";

import {
  useTranslation,
} from "../../../hooks/useTranslation";

import CreatePlannerModal from "./CreatePlannerModal";
import EditPlannerModal from "./EditPlannerModal";


interface PlannerTaskProps {
  category: string;
  startTime: string;
  endTime: string;
  plannedMinutes: number;
}


const PlannerTask = ({
  category,
  startTime,
  endTime,
  plannedMinutes,
}: PlannerTaskProps) => {
  /*
   * Dynamic planner category is translated.
   * Time and duration are real backend values,
   * so they are NOT hardcoded.
   */
  const translatedCategory =
    useTranslation(category);

  const minsText =
    useTranslation("mins");

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        p-5
        transition
        hover:bg-slate-50

        dark:hover:bg-slate-800/50

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:p-6
      "
    >

      {/* Task Information */}

      <div className="min-w-0">

        <h3 className="break-words text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          {translatedCategory}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:gap-4">

          <span className="flex items-center gap-2 whitespace-nowrap">

            <Clock3
              size={16}
              className="shrink-0"
            />

            {startTime}

          </span>

          <span>
            →
          </span>

          <span className="whitespace-nowrap">
            {endTime}
          </span>

        </div>

      </div>

      {/* Duration */}

      <div
        className="
          w-fit
          rounded-xl
          bg-indigo-50
          px-4
          py-2.5

          dark:bg-indigo-950/40

          sm:px-5
          sm:py-3
        "
      >

        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 sm:text-base">
          {plannedMinutes} {minsText}
        </span>

      </div>

    </div>
  );
};


const TodayPlannerCard = () => {
  const {
    data,
    isLoading,
  } = useTodayPlanner();

  const [openCreate, setOpenCreate] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);


  /*
   * Static UI translations
   */

  const loadingText =
    useTranslation(
      "Loading today's planner..."
    );

  const noPlannerText =
    useTranslation(
      "No Planner Found"
    );

  const createDescriptionText =
    useTranslation(
      "Create today's planner to start tracking your focus."
    );

  const createPlannerText =
    useTranslation(
      "Create Planner"
    );

  const todayPlannerText =
    useTranslation(
      "Today's Planner"
    );

  const goalText =
    useTranslation(
      "Goal"
    );

  const minsText =
    useTranslation(
      "mins"
    );

  const editPlannerLabel =
    useTranslation(
      "Edit today's planner"
    );


  if (isLoading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20

          sm:p-6
        "
      >

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loadingText}
        </p>

      </div>
    );
  }


  if (!data) {
    return (
      <>
        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            text-center

            dark:border-slate-700
            dark:bg-slate-900
            dark:shadow-black/20

            sm:p-8
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-indigo-100

              dark:bg-indigo-950/40

              sm:h-16
              sm:w-16
            "
          >

            <CalendarDays
              size={28}
              className="text-indigo-600 dark:text-indigo-400"
            />

          </div>


          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white sm:mt-6 sm:text-2xl">
            {noPlannerText}
          </h2>


          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            {createDescriptionText}
          </p>


          <button
            type="button"
            onClick={() =>
              setOpenCreate(true)
            }
            className="
              mt-6
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-indigo-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-indigo-700

              dark:bg-indigo-500
              dark:hover:bg-indigo-600

              sm:mt-8
              sm:w-auto
            "
          >

            <Plus size={18} />

            {createPlannerText}

          </button>

        </div>


        <CreatePlannerModal
          open={openCreate}
          onClose={() =>
            setOpenCreate(false)
          }
        />

      </>
    );
  }


  return (
    <>
      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-black/20
        "
      >

        {/* Header */}

        <div className="border-b border-slate-200 p-5 dark:border-slate-700 sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {todayPlannerText}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {data.date}
              </p>

            </div>


            <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">

              {/* Goal */}

              <div
                className="
                  min-w-0
                  flex-1
                  rounded-2xl
                  bg-indigo-100
                  px-4
                  py-3

                  dark:bg-indigo-950/40

                  sm:flex-none
                  sm:px-5
                "
              >

                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  {goalText}
                </p>

                <h3 className="mt-0.5 text-base font-bold text-indigo-700 dark:text-indigo-400 sm:text-xl">
                  {data.total_goal_minutes} {minsText}
                </h3>

              </div>


              {/* Edit */}

              <button
                type="button"
                onClick={() =>
                  setOpenEdit(true)
                }
                aria-label={editPlannerLabel}
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-600
                  text-white
                  transition
                  hover:bg-indigo-700

                  dark:bg-indigo-500
                  dark:hover:bg-indigo-600
                "
              >

                <Pencil size={18} />

              </button>

            </div>

          </div>

        </div>


        {/* Planner Tasks */}

        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {data.plans.map(
            (task, index) => (
              <PlannerTask
                key={index}
                category={task.category}
                startTime={task.start_time}
                endTime={task.end_time}
                plannedMinutes={task.planned_minutes}
              />
            )
          )}

        </div>

      </div>


      {/* Create Modal */}

      <CreatePlannerModal
        open={openCreate}
        onClose={() =>
          setOpenCreate(false)
        }
      />


      {/* Edit Modal */}

      <EditPlannerModal
        open={openEdit}
        onClose={() =>
          setOpenEdit(false)
        }
        planner={data}
      />

    </>
  );
};


export default TodayPlannerCard;