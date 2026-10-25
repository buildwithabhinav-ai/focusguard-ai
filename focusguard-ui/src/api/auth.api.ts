import api from "./axios";

/* ====================================
   Register
==================================== */

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  age: number;
  occupation: string;
}

export interface RegisterResponse {
  message: string;
}

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post(
    "/auth/register-user",
    data
  );

  return response.data;
};


/* ====================================
   Login
==================================== */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role: string;
}

export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};


/* ====================================
   Current User
==================================== */

export const getCurrentUser = async () => {
  const response = await api.get(
    "/users/me"
  );

  return response.data;
};


/* ====================================
   Change Password
==================================== */

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await api.patch(
    "/auth/change-password",
    data
  );

  return response.data;
};