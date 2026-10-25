import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  getCurrentUser,
  registerUser,
} from "../api/auth.api";


/* ====================================
   Current User
==================================== */

export const useCurrentUser = () =>
  useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });


/* ====================================
   Register User / Super Admin
==================================== */

export const useRegister = () =>
  useMutation({
    mutationFn: registerUser,
  });