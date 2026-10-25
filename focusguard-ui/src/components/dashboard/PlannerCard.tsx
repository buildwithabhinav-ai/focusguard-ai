import {
  CalendarDays,
  Clock3,
} from "lucide-react";

import { useTodayPlanner } from "../../hooks/usePlanner";

import {
  useTranslation,
} from "../../hooks/useTranslation";


const PlannerCard = () => {

  const {
    data,
    isLoading,
  } = useTodayPlanner();


  // Translated UI text

  const loadingPlanner =
    useTranslation(
      "Loading Planner..."
    );

  const todaysPlanner =
    useTranslation(
      "Today's Planner"
    );

  const goal =
    useTranslation(
      "Goal"
    );

  const min =
    useTranslation(
      "min"
    );

  const noPlannerCreated =
    useTranslation(
      "No planner created for today."
    );

  const minutes =
    useTranslation(
      "minutes"
    );


  if (isLoading) {
    return (
      <div
        className="
          min-w-0
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm

          dark:border-slate-700
          dark:bg-slate-900
          dark:shadow-none

          sm:p-6
        "
      >

        <div
          className="
            animate-pulse
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {loadingPlanner}
        </div>

      </div>
    );
  }


  return (
    <div
      className="
        min-w-0
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        text-slate-900
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md

        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-100
        dark:hover:border-slate-600
        dark:hover:shadow-lg
        dark:hover:shadow-black/20

        sm:p-6
      "
    >

      {/* Header */}

      <div
        className="
          mb-6
          flex
          min-w-0
          items-start
          justify-between
          gap-4
        "
      >

        <div className="min-w-0">

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              dark:text-white

              sm:text-xl
            "
          >
            {todaysPlanner}
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {goal}{" "}
            {data?.total_goal_minutes ?? 0}{" "}
            {min}
          </p>

        </div>


        <CalendarDays
          size={22}
          className="
            shrink-0
            text-indigo-600
            dark:text-indigo-400
          "
        />

      </div>


      {/* Plans */}

      <div className="space-y-4">

        {data?.plans.length === 0 && (

          <div
            className="
              rounded-xl
              bg-slate-50
              p-4
              text-sm
              text-slate-500

              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            {noPlannerCreated}
          </div>

        )}


        {data?.plans.map(
          (plan, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-slate-200
                p-4
                transition

                hover:border-indigo-300
                hover:bg-slate-50

                dark:border-slate-700
                dark:hover:border-indigo-500
                dark:hover:bg-slate-800
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div className="min-w-0">

                  <h3
                    className="
                      break-words
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {plan.category}
                  </h3>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {plan.planned_minutes}{" "}
                    {minutes}
                  </p>

                </div>


                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >

                  <Clock3 size={16} />

                  <span>
                    {plan.start_time.slice(0, 5)}
                    {" - "}
                    {plan.end_time.slice(0, 5)}
                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};


export default PlannerCard;