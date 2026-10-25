import { useQuery } from "@tanstack/react-query";

import {
  getRoleActivitySummary,
  getRoleWebsiteAnalytics,
  getRoleCategoryAnalytics,
  getRoleWeeklyReport,
  getRoleMonthlyReport,
} from "../api/roleAnalytics.api";


/* ---------------- Activity Summary ---------------- */

export const useRoleActivitySummary = () =>
  useQuery({
    queryKey: ["role-activity-summary"],
    queryFn: getRoleActivitySummary,
  });


/* ---------------- Website Analytics ---------------- */

export const useRoleWebsiteAnalytics = () =>
  useQuery({
    queryKey: ["role-website-analytics"],
    queryFn: getRoleWebsiteAnalytics,
  });


/* ---------------- Category Analytics ---------------- */

export const useRoleCategoryAnalytics = () =>
  useQuery({
    queryKey: ["role-category-analytics"],
    queryFn: getRoleCategoryAnalytics,
  });


/* ---------------- Weekly Report ---------------- */

export const useRoleWeeklyReport = () =>
  useQuery({
    queryKey: ["role-weekly-report"],
    queryFn: getRoleWeeklyReport,
  });


/* ---------------- Monthly Report ---------------- */

export const useRoleMonthlyReport = () =>
  useQuery({
    queryKey: ["role-monthly-report"],
    queryFn: getRoleMonthlyReport,
  });