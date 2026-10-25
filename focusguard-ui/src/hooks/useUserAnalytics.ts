import { useQuery } from "@tanstack/react-query";

import {
  getUserStatus,
  getUserActivity,
  getUserActivitySummary,
  getUserWebsiteAnalytics,
  getUserCategoryAnalytics,
  getUserTabSwitchAnalytics,
  getUserWeeklyReport,
  getUserMonthlyReport,
} from "../api/userAnalytics.api";


/* =====================================================
   REAL USER STATUS
===================================================== */

export const useUserStatus = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-status", userId],
    queryFn: () =>
      getUserStatus(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Activity History
===================================================== */

export const useUserActivity = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-activity", userId],
    queryFn: () =>
      getUserActivity(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Activity Summary
===================================================== */

export const useUserActivitySummary = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-activity-summary", userId],
    queryFn: () =>
      getUserActivitySummary(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Website Analytics
===================================================== */

export const useUserWebsiteAnalytics = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-website-analytics", userId],
    queryFn: () =>
      getUserWebsiteAnalytics(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Category Analytics
===================================================== */

export const useUserCategoryAnalytics = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-category-analytics", userId],
    queryFn: () =>
      getUserCategoryAnalytics(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Tab Switch Analytics
===================================================== */

export const useUserTabSwitchAnalytics = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-tab-switch-analytics", userId],
    queryFn: () =>
      getUserTabSwitchAnalytics(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Weekly Report
===================================================== */

export const useUserWeeklyReport = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-weekly-report", userId],
    queryFn: () =>
      getUserWeeklyReport(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });


/* =====================================================
   Individual User Monthly Report
===================================================== */

export const useUserMonthlyReport = (
  userId: number | undefined
) =>
  useQuery({
    queryKey: ["user-monthly-report", userId],
    queryFn: () =>
      getUserMonthlyReport(userId as number),
    enabled: !!userId,
    refetchInterval: 30000,
  });