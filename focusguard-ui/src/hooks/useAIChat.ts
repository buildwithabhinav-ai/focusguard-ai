import { useMutation } from "@tanstack/react-query";

import {
  chatWithAI,
} from "../api/ai.api";

export const useAIChat = () => {
  return useMutation({
    mutationFn: chatWithAI,
  });
};