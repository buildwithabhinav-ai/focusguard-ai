import { useQuery } from "@tanstack/react-query";

import {
  getWeeklyReport,
  getMonthlyReport,
  getRoleWeeklyReport,
  getRoleMonthlyReport,
} from "../api/reports.api";

/* ---------------- User Reports ---------------- */

export const useWeeklyReport = () =>
  useQuery({
    queryKey: ["weekly-report"],
    queryFn: getWeeklyReport,
  });

export const useMonthlyReport = () =>
  useQuery({
    queryKey: ["monthly-report"],
    queryFn: getMonthlyReport,
  });

/* ---------------- Role-Based Reports ---------------- */

/*
  Used by Sub Admin and Super Admin.

  Backend determines the correct organization-level
  data according to the authenticated user's role.
*/

export const useRoleWeeklyReport = () =>
  useQuery({
    queryKey: ["role-weekly-report"],
    queryFn: getRoleWeeklyReport,
  });

export const useRoleMonthlyReport = () =>
  useQuery({
    queryKey: ["role-monthly-report"],
    queryFn: getRoleMonthlyReport,
  });