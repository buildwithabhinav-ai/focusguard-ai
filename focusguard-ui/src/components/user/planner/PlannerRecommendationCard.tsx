import { useTranslation } from "../../../hooks/useTranslation";
import { usePlannerRecommendation } from "../../../hooks/usePlanner";

const PlannerRecommendationCard = () => {
  const { data, isLoading } = usePlannerRecommendation();

  const loadingText = useTranslation(
    "Loading AI recommendation..."
  );

  const noRecommendationText = useTranslation(
    "No recommendation available."
  );

  const titleText = useTranslation("AI Recommendation");
  const goalText = useTranslation("Goal");
  const completedText = useTranslation("Completed");
  const focusScoreText = useTranslation("Focus Score");
  const tasksText = useTranslation("Tasks");
  const suggestionText = useTranslation("AI Suggestion");
  const minutesText = useTranslation("min");

  // Dynamic AI recommendation
  const recommendationText = useTranslation(
    data?.recommendation ?? ""
  );

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
          {noRecommendationText}
        </p>
      </div>
    );
  }

  const goalMinutes = data.goal_minutes ?? 0;
  const completedMinutes = data.completed_minutes ?? 0;
  const focusScore = data.focus_score ?? 0;

  // Backend returns planner[], not tasks
  const taskCount = data.planner?.length ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
        {titleText}
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {goalText}
          </p>

          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
            {goalMinutes} {minutesText}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {completedText}
          </p>

          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
            {completedMinutes} {minutesText}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {focusScoreText}
          </p>

          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
            {focusScore}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tasksText}
          </p>

          <p className="mt-1 font-semibold text-gray-900 dark:text-white">
            {taskCount}
          </p>
        </div>
      </div>

      {data.recommendation && (
        <div className="mt-5 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            {suggestionText}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {recommendationText}
          </p>
        </div>
      )}
    </div>
  );
};

export default PlannerRecommendationCard;