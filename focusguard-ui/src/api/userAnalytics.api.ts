import api from "./axios";

/* =====================================================
   Individual User Analytics
   Used by Sub Admin to view one organization's user
===================================================== */

export interface UserActivitySummary {
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    organization_id: number | null;
  };

  browser_time_seconds: number;
  active_time_seconds: number;
  idle_time_seconds: number;
  focus_score: number;
}


export interface UserWebsiteUsage {
  website: string;
  duration_seconds: number;
}


export interface UserCategoryUsage {
  category: string;
  duration_seconds: number;
}


export interface UserTabSwitch {
  from: string;
  to: string;
  time: string;
}


export interface UserTabSwitchAnalytics {
  total_switches: number;
  recent_switches: UserTabSwitch[];
}


export interface UserWeeklyDay {
  day: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;
}


export interface UserWeeklyReport {
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

  daily_breakdown: UserWeeklyDay[];
}


export interface UserMonthlyWeek {
  week: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;
}


export interface UserMonthlyReport {
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

  weekly_breakdown: UserMonthlyWeek[];
}


/* =====================================================
   REAL USER STATUS
   ===================================================== */

export interface UserStatus {
  user_id: number;
  full_name: string;
  status: "ACTIVE" | "IDLE";
  updated_at: string | null;
}


export const getUserStatus = async (
  userId: number
): Promise<UserStatus> => {

  const response = await api.get(
    `/activity/users/${userId}/status`
  );

  return response.data;
};


/* =====================================================
   Activity Summary
===================================================== */

export const getUserActivitySummary = async (
  userId: number
): Promise<UserActivitySummary> => {

  const response = await api.get(
    `/analytics/users/${userId}/activity-summary`
  );

  return response.data;
};


/* =====================================================
   Website Analytics
===================================================== */

export const getUserWebsiteAnalytics = async (
  userId: number
): Promise<UserWebsiteUsage[]> => {

  const response = await api.get(
    `/analytics/users/${userId}/websites`
  );

  return response.data;
};


/* =====================================================
   Category Analytics
===================================================== */

export const getUserCategoryAnalytics = async (
  userId: number
): Promise<UserCategoryUsage[]> => {

  const response = await api.get(
    `/analytics/users/${userId}/categories`
  );

  return response.data;
};


/* =====================================================
   Tab Switch Analytics
===================================================== */

export const getUserTabSwitchAnalytics = async (
  userId: number,
  date?: string
): Promise<UserTabSwitchAnalytics> => {

  const response = await api.get(
    `/analytics/users/${userId}/tab-switches`,
    {
      params: date ? { date } : {},
    }
  );

  return response.data;
};


/* =====================================================
   Weekly Report
===================================================== */

export const getUserWeeklyReport = async (
  userId: number
): Promise<UserWeeklyReport> => {

  const response = await api.get(
    `/analytics/users/${userId}/report`,
    {
      params: {
        type: "weekly",
      },
    }
  );

  return response.data;
};


/* =====================================================
   Monthly Report
===================================================== */

export const getUserMonthlyReport = async (
  userId: number
): Promise<UserMonthlyReport> => {

  const response = await api.get(
    `/analytics/users/${userId}/report`,
    {
      params: {
        type: "monthly",
      },
    }
  );

  return response.data;
};


/* =====================================================
   Individual User Activity History
   Used by Sub Admin to view detailed activity
   ===================================================== */

export interface UserActivity {
  id: number;
  url: string;
  website_name: string;
  tab_title: string;
  application: string;
  category: string;
  productivity: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
}

export const getUserActivity = async (
  userId: number
): Promise<UserActivity[]> => {
  const response = await api.get(
    `/analytics/users/${userId}/activity`
  );

  return response.data;
};