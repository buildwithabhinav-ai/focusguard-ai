import api from "./axios";

export interface RoleRecentTabSwitch {
  from: string;
  to: string;
  time: string;
}

export interface RoleTabSwitchAnalytics {
  total_switches: number;
  recent_switches: RoleRecentTabSwitch[];
}


export const getRoleTabSwitchAnalytics =
  async (
    date?: string
  ): Promise<RoleTabSwitchAnalytics> => {

    const response = await api.get(
      "/analytics/role/tab-switches",
      {
        params: date ? { date } : {},
      }
    );

    return response.data;
  };