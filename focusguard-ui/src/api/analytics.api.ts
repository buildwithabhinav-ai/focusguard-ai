import api from "./axios";

/* ---------------- Dashboard ---------------- */

export interface DashboardSummary {
  user: {
    id: number;
    full_name: string;
    email: string;
    role: "SUPER_ADMIN" | "SUB_ADMIN" | "USER";
  };

  date: string;

  productive_time: number;
  non_productive_time: number;
  browser_time: number;
  active_time: number;
  idle_time: number;
  focus_score: number;

  total_website_visited: number;
  total_tab_switches: number;

  category_summary: Record<string, number>;

  website_summary: Record<
    string,
    {
      url: string;
      time_spent: number;
      visits: number;
    }
  >;
}

export const getDashboardSummary =
  async (): Promise<DashboardSummary> => {
    const response = await api.get(
      "/analytics/dashboard"
    );

    return response.data;
  };

/* ---------------- Website Analytics ---------------- */

export interface WebsiteUsage {
  website: string;
  duration_seconds: number;
}

export const getWebsiteUsage =
  async (): Promise<WebsiteUsage[]> => {
    const response = await api.get(
      "/analytics/websites"
    );

    return response.data;
  };

/* ---------------- Category Analytics ---------------- */

export interface CategoryAnalytics {
  category: string;
  duration_seconds: number;
}

export const getCategoryAnalytics =
  async (): Promise<CategoryAnalytics[]> => {
    const response = await api.get(
      "/analytics/categories"
    );

    return response.data;
  };

/* ---------------- Activity Summary ---------------- */

export interface ActivitySummary {
  browser_time_seconds: number;
  active_time_seconds: number;
  idle_time_seconds: number;
  focus_score: number;

  productive_time_seconds?: number;
  non_productive_time_seconds?: number;
  tab_switches?: number;
  active_sessions?: number;
}

export const getActivitySummary =
  async (): Promise<ActivitySummary> => {
    const response = await api.get(
      "/analytics/activity-summary"
    );

    return response.data;
  };

/* ---------------- Tab Switch Analytics ---------------- */

export interface RecentTabSwitch {
  from: string;
  to: string;
  time: string;
}

export interface TabSwitchAnalytics {
  total_switches: number;
  recent_switches: RecentTabSwitch[];
}

export const getTabSwitchAnalytics =
  async (
    date?: string
  ): Promise<TabSwitchAnalytics> => {
    const response = await api.get(
      "/analytics/tab-switches",
      {
        params: date
          ? { date }
          : undefined,
      }
    );

    return response.data;
  };

/* ---------------- Analytics Summary ---------------- */

export interface AnalyticsSummary {
  browser_time_seconds: number;
  productive_time_seconds: number;
  non_productive_time_seconds: number;
  tab_switches: number;
  active_sessions: number;
}

export const getAnalyticsSummary =
  async (): Promise<AnalyticsSummary> => {
    const response = await api.get(
      "/analytics/summary"
    );

    return response.data;
  };

/* ---------------- AI Recommendation ---------------- */

export interface AIRecommendation {
  period: string;
  generated_at: string;

  active_time_seconds: number;
  active_time: string;

  idle_time_seconds: number;
  idle_time: string;

  browser_time_seconds: number;
  browser_time: string;

  productive_time_seconds: number;
  productive_time: string;

  non_productive_time_seconds: number;
  non_productive_time: string;

  focus_score: number;

  tab_switches: number;

  top_websites: string[];
  top_categories: string[];

  productive_websites: string[];
  distracting_websites: string[];

  recommendation: string;
}

export const getAIRecommendation =
  async (): Promise<AIRecommendation> => {
    const response = await api.get(
      "/ai/recommendation"
    );

    return response.data;
  };

/* ================================================= */
/* ROLE-BASED ANALYTICS                              */
/* ================================================= */

/*
  USER
  -> Existing personal analytics APIs above

  SUB_ADMIN
  -> Analytics of USERS belonging to
     the Sub Admin's organization

  SUPER_ADMIN
  -> Overall organization USER analytics
*/

/* ---------------- Role-Based Website Analytics ---------------- */

export const getRoleWebsiteAnalytics =
  async (): Promise<WebsiteUsage[]> => {
    const response = await api.get(
      "/analytics/role/websites"
    );

    return response.data;
  };

/* ---------------- Role-Based Category Analytics ---------------- */

export const getRoleCategoryAnalytics =
  async (): Promise<CategoryAnalytics[]> => {
    const response = await api.get(
      "/analytics/role/categories"
    );

    return response.data;
  };

/* ---------------- Role-Based Activity Summary ---------------- */

export const getRoleActivitySummary =
  async (): Promise<ActivitySummary> => {
    const response = await api.get(
      "/analytics/role/activity-summary"
    );

    return response.data;
  };