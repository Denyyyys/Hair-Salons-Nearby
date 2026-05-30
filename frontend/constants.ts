const CLIENT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8085";

const SERVER_API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ?? "http://backend:8085";

export const API_BASE_URL =
  typeof window === "undefined" ? SERVER_API_BASE_URL : CLIENT_API_BASE_URL;
