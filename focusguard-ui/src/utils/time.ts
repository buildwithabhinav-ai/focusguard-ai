export const formatDuration = (
  seconds: number
) => {
  if (!seconds) return "0m";

  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor(
    (seconds % 3600) / 60
  );

  if (hrs === 0) {
    return `${mins}m`;
  }

  return `${hrs}h ${mins}m`;
};