import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDashboardSummary,
  getWebsiteUsage,
} from "../api/analytics.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });
};

export const useWebsiteUsage = () => {
  return useQuery({
    queryKey: ["website-usage"],
    queryFn: getWebsiteUsage,
  });
};