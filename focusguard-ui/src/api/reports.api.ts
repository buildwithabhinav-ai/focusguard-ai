import api from "./axios";

/* ================================================= */
/* Weekly Report                                      */
/* ================================================= */

export interface WeeklyDay {
  day: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;
}

export interface WeeklyReport {
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

  daily_breakdown: WeeklyDay[];
}

/* ================================================= */
/* Monthly Report                                     */
/* ================================================= */

export interface MonthlyWeek {
  week: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;
}

export interface MonthlyReport {
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

  weekly_breakdown: MonthlyWeek[];
}

/* ================================================= */
/* User Reports                                       */
/* ================================================= */

/*
  These endpoints are for the logged-in USER's
  personal activity.
*/

export const getWeeklyReport =
  async (): Promise<WeeklyReport> => {
    const res = await api.get(
      "/analytics/report",
      {
        params: {
          type: "weekly",
        },
      }
    );

    return res.data;
  };

export const getMonthlyReport =
  async (): Promise<MonthlyReport> => {
    const res = await api.get(
      "/analytics/report",
      {
        params: {
          type: "monthly",
        },
      }
    );

    return res.data;
  };

/* ================================================= */
/* Role-Based Reports                                 */
/* ================================================= */

/*
  These endpoints are for:

  SUB_ADMIN
  -> Users belonging to their organization

  SUPER_ADMIN
  -> Overall USER activity
*/

/* ---------------- Role Weekly Report ---------------- */

export const getRoleWeeklyReport =
  async (): Promise<WeeklyReport> => {
    const res = await api.get(
      "/analytics/role/report",
      {
        params: {
          type: "weekly",
        },
      }
    );

    return res.data;
  };

/* ---------------- Role Monthly Report ---------------- */

export const getRoleMonthlyReport =
  async (): Promise<MonthlyReport> => {
    const res = await api.get(
      "/analytics/role/report",
      {
        params: {
          type: "monthly",
        },
      }
    );

    return res.data;
  };