import { useQuery } from "@tanstack/react-query";

import {
  getRoleTabSwitchAnalytics,
} from "../api/roleTabSwitch.api";

export const useRoleTabSwitchAnalytics = (
  date?: string
) =>
  useQuery({
    queryKey: [
      "role-tab-switch-analytics",
      date,
    ],
    queryFn: () =>
      getRoleTabSwitchAnalytics(date),
  });