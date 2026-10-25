import api from "./axios";

export interface AIRecommendationResponse {
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
  async (): Promise<AIRecommendationResponse> => {
    const response = await api.get(
      "/ai/recommendation"
    );

    return response.data;
  };

export interface ChatHistoryItem {
  sender: "user" | "ai";
  text: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatHistoryItem[];
}

export interface ChatResponse {
  response: string;
}

export const chatWithAI = async (
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await api.post(
    "/ai/chat",
    data
  );

  return response.data;
};