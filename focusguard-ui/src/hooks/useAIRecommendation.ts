import { useQuery } from "@tanstack/react-query";

import {
  getAIRecommendation,
} from "../api/ai.api";

export const useAIRecommendation = () =>
  useQuery({
    queryKey: ["ai-recommendation"],
    queryFn: getAIRecommendation,
  });