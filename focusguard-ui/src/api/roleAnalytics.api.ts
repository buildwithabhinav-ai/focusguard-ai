import api from "./axios";

export interface RoleActivitySummary {
  browser_time_seconds: number;
  active_time_seconds: number;
  idle_time_seconds: number;
  focus_score: number;
}

export interface RoleWebsiteUsage {
  website: string;
  duration_seconds: number;
}

export interface RoleCategoryAnalytics {
  category: string;
  duration_seconds: number;
}

export interface RoleWeeklyDay {
  day: string;
  active_time_seconds: number;
  active_time: string;
  idle_time_seconds: number;
  idle_time: string;
}

export interface RoleWeeklyReport {
  report_type: string;
  start_date: string;
  end_date: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;

  total_time_seconds: number;
  total_time: string;

  focus_score: number;

  daily_breakdown: RoleWeeklyDay[];
}

export interface RoleMonthlyWeek {
  week: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;
}

export interface RoleMonthlyReport {
  report_type: string;
  start_date: string;
  end_date: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;

  total_time_seconds: number;
  total_time: string;

  focus_score: number;

  weekly_breakdown: RoleMonthlyWeek[];
}

/* ---------------- Activity Summary ---------------- */

export const getRoleActivitySummary =
  async (): Promise<RoleActivitySummary> => {
    const response = await api.get(
      "/analytics/role/activity-summary"
    );

    return response.data;
  };

/* ---------------- Website Analytics ---------------- */

export const getRoleWebsiteAnalytics =
  async (): Promise<RoleWebsiteUsage[]> => {
    const response = await api.get(
      "/analytics/role/websites"
    );

    return response.data;
  };

/* ---------------- Category Analytics ---------------- */

export const getRoleCategoryAnalytics =
  async (): Promise<RoleCategoryAnalytics[]> => {
    const response = await api.get(
      "/analytics/role/categories"
    );

    return response.data;
  };

/* ---------------- Weekly Report ---------------- */

export const getRoleWeeklyReport =
  async (): Promise<RoleWeeklyReport> => {
    const response = await api.get(
      "/analytics/role/report",
      {
        params: {
          type: "weekly",
        },
      }
    );

    return response.data;
  };

/* ---------------- Monthly Report ---------------- */

export const getRoleMonthlyReport =
  async (): Promise<RoleMonthlyReport> => {
    const response = await api.get(
      "/analytics/role/report",
      {
        params: {
          type: "monthly",
        },
      }
    );

    return response.data;
  };