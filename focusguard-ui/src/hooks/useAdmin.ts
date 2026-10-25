import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  inviteSubAdmin,
  getAllUsers,
} from "../api/admin.api";

export const useInviteSubAdmin =
  () =>
    useMutation({
      mutationFn:
        inviteSubAdmin,
    });

export const useAllUsers =
  () =>
    useQuery({
      queryKey: [
        "allUsers",
      ],

      queryFn:
        getAllUsers,
    });