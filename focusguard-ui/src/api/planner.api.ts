import api from "./axios";

/* ---------------- Today's Plan ---------------- */

export interface PlannerItem {
  category: string;
  planned_minutes: number;
  start_time: string;
  end_time: string;
}

export interface TodayPlannerResponse {
  plan_id: number;
  date: string;
  total_goal_minutes: number;
  plans: PlannerItem[];
}

export const getTodayPlanner =
  async (): Promise<TodayPlannerResponse> => {
    const response = await api.get(
      "/planner/today"
    );

    return response.data;
  };

/* ---------------- Progress ---------------- */

export interface ProgressPlannerItem {
  category: string;
  planned_minutes: number;
  start_time: string;
  end_time: string;
  actual_minutes: number;
  difference_minutes: number;
  completion_percentage: number;
  status: string;
}

export interface PlannerProgress {
  date: string;
  goal_minutes: number;
  completed_minutes: number;
  goal_completion_percentage: number;
  focus_score: number;
  planner: ProgressPlannerItem[];
}

export const getPlannerProgress =
  async (): Promise<PlannerProgress> => {
    const response = await api.get(
      "/planner/progress"
    );

    return response.data;
  };

/* ---------------- Current Session ---------------- */

export interface CurrentSession {
  category: string;
  planned_minutes: number;
  start_time: string;
  end_time: string;
  remaining_minutes: number;
}

export const getCurrentSession =
  async (): Promise<CurrentSession> => {
    const response = await api.get(
      "/planner/current-session"
    );

    return response.data;
  };

/* ---------------- Live Status ---------------- */

export interface LiveStatus {
  status: string;
  planned_category: string;
  current_category: string;
  website: string;
  url: string;
  message: string;
}

export const getLiveStatus =
  async (): Promise<LiveStatus> => {
    const response = await api.get(
      "/planner/live-status"
    );

    return response.data;
  };

/* ---------------- Categories ---------------- */

export interface PlannerCategories {
  categories: string[];
}

export const getPlannerCategories =
  async (): Promise<PlannerCategories> => {
    const response = await api.get(
      "/planner/categories"
    );

    return response.data;
  };

/* ---------------- AI Recommendation ---------------- */

export interface PlannerRecommendation {
  date: string;
  goal_minutes: number;
  completed_minutes: number;
  focus_score: number;

  planner: {
    category: string;
    planned_minutes: number;
    actual_minutes: number;
    status: string;
  }[];

  recommendation: string;
}

export const getPlannerRecommendation =
  async (): Promise<PlannerRecommendation> => {
    const response = await api.get(
      "/planner/recommendation"
    );

    return response.data;
  };

/* ---------------- Create Planner ---------------- */

export interface PlannerTaskRequest {
  category: string;
  planned_minutes: number;
  start_time: string;
  end_time: string;
}

export interface CreatePlannerRequest {
  plan_date: string;
  total_goal_minutes: number;
  plans: PlannerTaskRequest[];
}

export const createPlanner = async (
  payload: CreatePlannerRequest
) => {
  const response = await api.post(
    "/planner",
    payload
  );

  return response.data;
};

/* ---------------- Update Planner ---------------- */

export interface UpdatePlannerRequest {
  total_goal_minutes: number;
  plans: PlannerTaskRequest[];
}

export const updatePlanner = async (
  planId: number,
  payload: UpdatePlannerRequest
) => {
  const response = await api.put(
    `/planner/${planId}`,
    payload
  );

  return response.data;
};