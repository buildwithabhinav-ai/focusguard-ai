import { useTranslation } from "../../../hooks/useTranslation";
import { usePlannerProgress } from "../../../hooks/usePlanner";

const PlannerProgressCard = () => {
  const { data, isLoading } = usePlannerProgress();

  const loadingText = useTranslation("Loading progress...");
  const noProgressText = useTranslation("No progress available.");

  const titleText = useTranslation("Planner Progress");
  const goalText = useTranslation("Goal");
  const completedText = useTranslation("Completed");
  const goalCompletionText = useTranslation("Goal Completion");
  const focusScoreText = useTranslation("Focus Score");
  const minutesText = useTranslation("min");

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loadingText}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {noProgressText}
        </p>
      </div>
    );
  }

  const goalMinutes = data.goal_minutes ?? 0;
  const completedMinutes = data.completed_minutes ?? 0;

  // Backend field is goal_completion_percentage
  const goalCompletionPercentage =
    data.goal_completion_percentage ?? 0;

  const focusScore = data.focus_score ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
        {titleText}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {goalText}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {goalMinutes} {minutesText}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedText}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {completedMinutes} {minutesText}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {goalCompletionText}
          </span>

          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {goalCompletionPercentage}%
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{
              width: `${Math.min(
                Math.max(goalCompletionPercentage, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {focusScoreText}
        </span>

        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {focusScore}
        </span>
      </div>
    </div>
  );
};

export default PlannerProgressCard;