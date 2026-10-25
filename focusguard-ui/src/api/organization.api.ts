import api from "./axios";

/* ==============================
   Interfaces
============================== */

export interface Organization {
  id: number;
  organization_name: string;
  is_active: boolean;
}

export interface CreateOrganizationRequest {
  organization_name: string;
}

export interface AssignOrganizationRequest {
  user_id: number;
  organization_id: number;
}

export interface DeactivationRequest {
  id: number;
  organization_id: number;
  reason: string;
  requested_by: number;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: number | null;
  status: string;
}

/* ==============================
   GET Organizations
============================== */

export const getOrganizations =
  async (): Promise<Organization[]> => {
    const response =
      await api.get("/organizations/");

    return response.data;
  };

/* ==============================
   CREATE Organization
============================== */

export const createOrganization =
  async (
    data: CreateOrganizationRequest
  ): Promise<Organization> => {
    const response =
      await api.post(
        "/organizations/",
        data
      );

    return response.data;
  };

/* ==============================
   Assign Organization
============================== */

export const assignOrganization =
  async (
    data: AssignOrganizationRequest
  ) => {
    const response =
      await api.put(
        "/organizations/assign",
        data
      );

    return response.data;
  };

/* ==============================
Request Deactivation
============================== */

export interface DeactivationRequestBody {
  reason: string;
}

export const requestDeactivation = async (
  data: DeactivationRequestBody
) => {
  const response = await api.post(
    "/organizations/deactivation-request",
    data
  );

  return response.data;
};

/* ==============================
   Get Deactivation Requests
============================== */

export const getDeactivationRequests =
  async (): Promise<
    DeactivationRequest[]
  > => {
    const response =
      await api.get(
        "/organizations/deactivation-requests"
      );

    return response.data;
  };

/* ==============================
   Approve Request
============================== */

export const approveRequest =
  async (
    requestId: number
  ) => {
    const response =
      await api.put(
        `/organizations/deactivation-request/${requestId}/approve`
      );

    return response.data;
  };

/* ==============================
   Reject Request
============================== */

export const rejectRequest =
  async (
    requestId: number
  ) => {
    const response =
      await api.put(
        `/organizations/deactivation-request/${requestId}/reject`
      );

    return response.data;
  };

/* ==============================
   Deactivate User
============================== */

export const deactivateUser =
  async (
    userId: number
  ) => {
    const response =
      await api.put(
        `/organizations/users/${userId}/deactivate`
      );

    return response.data;
  };

/* ==============================
   Activate Organization
============================== */

export const activateOrganization =
  async (
    organizationId: number
  ) => {
    const response =
      await api.put(
        `/organizations/${organizationId}/activate`
      );

    return response.data;
  };

/* ==============================
   Create Organization User
============================== */

export interface CreateOrganizationUserRequest {
  full_name: string;
  email: string;
  password: string;
  age: number;
  occupation: string;
}

export const createOrganizationUser =
  async (
    data: CreateOrganizationUserRequest
  ) => {
    const response =
      await api.post(
        "/organizations/users",
        data
      );

    return response.data;
  };


export interface DeactivationRequestBody {
  reason: string;
}


export interface OrganizationUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  age: number | null;
  occupation: string | null;
  organization_id: number;
  is_active: boolean;
  created_at: string;
}

export const getOrganizationUsers = async (): Promise<OrganizationUser[]> => {
  const response = await api.get("/organizations/users");

  return response.data;
};

export const deactivateOrganizationUser = async (
  userId: number
) => {
  const response = await api.put(
    `/organizations/users/${userId}/deactivate`
  );

  return response.data;
};