import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTodayPlanner,
  getPlannerProgress,
  getCurrentSession,
  getLiveStatus,
  getPlannerRecommendation,
  createPlanner,
  updatePlanner,
  getPlannerCategories,
} from "../api/planner.api";

export const useTodayPlanner = () =>
  useQuery({
    queryKey: ["planner-today"],
    queryFn: async () => {
      try {
        return await getTodayPlanner();
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });

export const usePlannerProgress = () =>
  useQuery({
    queryKey: ["planner-progress"],
    queryFn: getPlannerProgress,
  });

export const useCurrentSession = () =>
  useQuery({
    queryKey: ["planner-session"],
    queryFn: getCurrentSession,
  });

export const useLiveStatus = () =>
  useQuery({
    queryKey: ["planner-live"],
    queryFn: getLiveStatus,
  });

export const usePlannerRecommendation = () =>
  useQuery({
    queryKey: ["planner-ai"],
    queryFn: getPlannerRecommendation,
  });

export const useCreatePlanner = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createPlanner,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planner-today"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-progress"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-session"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-live"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-ai"],
      });
    },
  });
};

export const useUpdatePlanner = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: number;
      payload: any;
    }) =>
      updatePlanner(
        planId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["planner-today"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-progress"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-session"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-live"],
      });

      queryClient.invalidateQueries({
        queryKey: ["planner-ai"],
      });
    },
  });
};

export const usePlannerCategories =
  () =>
    useQuery({
      queryKey: [
        "planner-categories",
      ],

      queryFn:
        getPlannerCategories,
    });