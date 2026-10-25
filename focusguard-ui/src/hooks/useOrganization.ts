import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  activateOrganization,
  approveRequest,
  assignOrganization,
  createOrganization,
  createOrganizationUser,
  deactivateOrganizationUser,
  deactivateUser,
  getDeactivationRequests,
  getOrganizations,
  rejectRequest,
  requestDeactivation,
  getOrganizationUsers
} from "../api/organization.api";

/* ================================
   Organizations
================================ */

export const useOrganizations = () =>
  useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

export const useCreateOrganization = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "organizations",
        ],
      });
    },
  });
};

/* ================================
   Assign Organization
================================ */

export const useAssignOrganization =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        assignOrganization,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "organizations",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "allUsers",
          ],
        });
      },
    });
  };

/* ================================
   Deactivation Requests
================================ */

export const useDeactivationRequests =
  () =>
    useQuery({
      queryKey: [
        "deactivationRequests",
      ],

      queryFn:
        getDeactivationRequests,
    });

export const useApproveRequest =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        approveRequest,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "deactivationRequests",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "organizations",
            ],
          }
        );
      },
    });
  };

export const useRejectRequest =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        rejectRequest,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "deactivationRequests",
            ],
          }
        );
      },
    });
  };

/* ================================
   Activate Organization
================================ */

export const useActivateOrganization =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        activateOrganization,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "organizations",
            ],
          }
        );
      },
    });
  };

/* ================================
   Sub Admin
================================ */

export const useRequestDeactivation =
  () =>
    useMutation({
      mutationFn:
        requestDeactivation,
    });

export const useDeactivateUser =
  () =>
    useMutation({
      mutationFn:
        deactivateUser,
    });

export const useCreateOrganizationUser =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        createOrganizationUser,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "organizationUsers",
          ],
        });
      },
    });
  };


/* =====================================
Organization Users
===================================== */

export const useOrganizationUsers =
  () =>
    useQuery({
      queryKey: ["organizationUsers"],
      queryFn: getOrganizationUsers,
    });

export const useDeactivateOrganizationUser =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        deactivateOrganizationUser,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "organizationUsers",
          ],
        });
      },
    });
  };