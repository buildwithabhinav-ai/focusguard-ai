import api from "./axios";

export interface OrganizationAIRecommendation {
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

export const getOrganizationAIRecommendation =
  async (
    organizationId: number
  ): Promise<OrganizationAIRecommendation> => {
    const response = await api.get(
      "/ai/organization-recommendation",
      {
        params: {
          organization_id: organizationId,
        },
      }
    );

    return response.data;
  };