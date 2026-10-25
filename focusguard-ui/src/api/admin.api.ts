import api from "./axios";


/* ====================================
   Invite Sub Admin
==================================== */

export interface InviteSubAdminRequest {

  full_name: string;

  email: string;

  organization_id: number;
}


export interface InviteResponse {

  message?: string;

  detail?: string;

  // false when the invitation was created but the e-mail could not be sent
  email_sent?: boolean;

  email_error?: string;

  // only present when email_sent is false, so it can be shared manually
  invitation_link?: string;

}


export const inviteSubAdmin = async (

  data: InviteSubAdminRequest

): Promise<InviteResponse> => {

  const response = await api.post(

    "/admin/invite-sub-admin",

    data

  );

  return response.data;

};


/* ====================================
   All Users
==================================== */

export interface UserResponse {

  id: number;

  full_name: string;

  email: string;

  role:
    | "SUPER_ADMIN"
    | "SUB_ADMIN"
    | "USER";

  age: number | null;

  occupation: string | null;

  organization_id: number | null;

  is_active: boolean;

  created_at: string;

}


export const getAllUsers = async ():

  Promise<UserResponse[]> => {

  const response = await api.get(
    "/admin/all-users"
  );

  return response.data;

};