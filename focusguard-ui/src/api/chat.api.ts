import api from "./axios";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export const sendChatMessage = async (
  data: ChatRequest
): Promise<ChatResponse> => {
  const response = await api.post(
    "/ai/chat",
    data
  );

  return response.data;
};