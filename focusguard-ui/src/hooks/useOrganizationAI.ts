import { useQuery } from "@tanstack/react-query";

import {
  getOrganizationAIRecommendation,
} from "../api/organizationAI.api";

export const useOrganizationAI = (
  organizationId?: number
) => {
  return useQuery({
    queryKey: [
      "organization-ai-recommendation",
      organizationId,
    ],
    queryFn: () =>
      getOrganizationAIRecommendation(
        organizationId as number
      ),
    enabled: organizationId !== undefined,
  });
};