export type UserRole = "ADMIN" | "USER" | "STORE_OWNER";

export interface AuthUser {
  token: string;
  role: UserRole;
  name: string;
}
