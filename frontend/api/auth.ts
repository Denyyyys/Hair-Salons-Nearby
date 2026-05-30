import axios from "axios";
import { API_BASE_URL } from "@/constants";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/login`, payload);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/register`, payload);
  return data;
}
