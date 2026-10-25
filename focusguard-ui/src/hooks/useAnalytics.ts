import { useQuery } from "@tanstack/react-query";

import {
  getActivitySummary,
  getAnalyticsSummary,
  getWebsiteUsage,
  getCategoryAnalytics,
  getTabSwitchAnalytics,
  getDashboardSummary,
  getAIRecommendation,
  getRoleWebsiteAnalytics,
  getRoleCategoryAnalytics,
  getRoleActivitySummary,
} from "../api/analytics.api";

/* =========================================================
   USER ANALYTICS
   ========================================================= */

export const useActivitySummary = () =>
  useQuery({
    queryKey: ["activity-summary"],
    queryFn: getActivitySummary,
  });

export const useAnalyticsSummary = () =>
  useQuery({
    queryKey: ["analytics-summary"],
    queryFn: getAnalyticsSummary,
  });

export const useWebsiteAnalytics = () =>
  useQuery({
    queryKey: ["website-analytics"],
    queryFn: getWebsiteUsage,
  });

export const useCategoryAnalytics = () =>
  useQuery({
    queryKey: ["category-analytics"],
    queryFn: getCategoryAnalytics,
  });

/*
  Tab Switch Analytics

  Optional date filter.
  If a date is selected, the backend returns
  tab switches for that date.
*/

export const useTabSwitchAnalytics = (
  date?: string
) =>
  useQuery({
    queryKey: [
      "tab-switch-analytics",
      date,
    ],
    queryFn: () =>
      getTabSwitchAnalytics(date),
  });

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

export const useAIRecommendation = () =>
  useQuery({
    queryKey: ["ai-recommendation"],
    queryFn: getAIRecommendation,
  });


/* =========================================================
   ROLE-BASED ANALYTICS
   ========================================================= */

/*
  Used by SUB_ADMIN and SUPER_ADMIN.

  Backend determines the correct organization-level
  data according to the authenticated user's role.
*/

export const useRoleWebsiteAnalytics = () =>
  useQuery({
    queryKey: ["role-website-analytics"],
    queryFn: getRoleWebsiteAnalytics,
  });

export const useRoleCategoryAnalytics = () =>
  useQuery({
    queryKey: ["role-category-analytics"],
    queryFn: getRoleCategoryAnalytics,
  });

export const useRoleActivitySummary = () =>
  useQuery({
    queryKey: ["role-activity-summary"],
    queryFn: getRoleActivitySummary,
  });